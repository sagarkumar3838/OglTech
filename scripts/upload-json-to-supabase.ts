import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = 'https://ksjgsgebjnpwyycnptom.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzamdzZ2Viam5wd3l5Y25wdG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMzM5NDEsImV4cCI6MjA4NDYwOTk0MX0.R4w_7BJ7AgzegkpCaJZji154NFlmzjjnOs3VkH4eYjU';

const supabase = createClient(supabaseUrl, supabaseKey);

interface Question {
  type: string;
  question: string;
  options?: string[];
  correct_answer: any;
  explanation?: string;
  code_snippet?: string;
  test_cases?: any[];
}

interface QuestionBank {
  [skill: string]: {
    [level: string]: Question[];
  };
}

/**
 * Upload questions from JSON file to Supabase
 * 
 * Usage:
 * npx tsx scripts/upload-json-to-supabase.ts path/to/questions.json
 */
async function uploadQuestionsFromJSON(jsonFilePath: string) {
  console.log('🚀 Starting JSON to Supabase Upload\n');
  console.log(`Reading file: ${jsonFilePath}\n`);

  try {
    // Read JSON file
    const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
    const questionBank: QuestionBank = JSON.parse(fileContent);

    let totalUploaded = 0;
    let totalSkipped = 0;

    // Iterate through skills
    for (const [skill, levels] of Object.entries(questionBank)) {
      console.log(`\n📚 Processing skill: ${skill}`);

      // Iterate through levels
      for (const [level, questions] of Object.entries(levels)) {
        console.log(`  📝 Level: ${level} (${questions.length} questions)`);

        // Prepare questions for insertion
        const questionsToInsert = questions.map((q, idx) => ({
          question_id: `${skill.toLowerCase().replace(/\s+/g, '-')}-${level.toLowerCase()}-${Date.now()}-${idx}`,
          skill: skill,
          level: level,
          type: q.type || 'mcq',
          question: q.question,
          options: q.options || [],
          correct_answer: q.correct_answer,
          explanation: q.explanation || '',
          code_snippet: q.code_snippet || null,
          test_cases: q.test_cases || [],
          verified: true,
          usage_count: 0
        }));

        // Insert into Supabase
        const { data, error } = await supabase
          .from('questions')
          .insert(questionsToInsert);

        if (error) {
          console.error(`  ❌ Error: ${error.message}`);
          totalSkipped += questions.length;
        } else {
          console.log(`  ✅ Uploaded ${questions.length} questions`);
          totalUploaded += questions.length;
        }

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Upload Complete!`);
    console.log(`   Total uploaded: ${totalUploaded}`);
    console.log(`   Total skipped: ${totalSkipped}`);
    console.log('='.repeat(50));

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Get file path from command line argument
const jsonFilePath = process.argv[2];

if (!jsonFilePath) {
  console.error('❌ Please provide a JSON file path');
  console.log('\nUsage:');
  console.log('  npx tsx scripts/upload-json-to-supabase.ts path/to/questions.json');
  console.log('\nExample:');
  console.log('  npx tsx scripts/upload-json-to-supabase.ts ./my-questions.json');
  process.exit(1);
}

if (!fs.existsSync(jsonFilePath)) {
  console.error(`❌ File not found: ${jsonFilePath}`);
  process.exit(1);
}

uploadQuestionsFromJSON(jsonFilePath);
