import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = 'https://ksjgsgebjnpwyycnptom.supabase.co';
// Use service_role key to bypass RLS for bulk insert
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzamdzZ2Viam5wd3l5Y25wdG9tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTAzMzk0MSwiZXhwIjoyMDg0NjA5OTQxfQ.9Y2JuAmAXSU7vXZB-UaLQkCw5iddITkJcVTRi6bTfd0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function parseCSV(content: string): any[] {
  const lines = content.split('\n');
  const headers = lines[0].split(',');
  const questions = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const values = lines[i].split(',');
    if (values.length < headers.length) continue;

    const question: any = {};
    headers.forEach((header, index) => {
      question[header.trim()] = values[index]?.trim() || '';
    });

    questions.push(question);
  }

  return questions;
}

async function uploadCSVToSupabase(csvFilePath: string) {
  console.log('🚀 Starting CSV Upload to Supabase\n');
  console.log(`Reading file: ${csvFilePath}\n`);

  try {
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
    const csvQuestions = parseCSV(fileContent);

    console.log(`📊 Found ${csvQuestions.length} questions in CSV\n`);

    let totalUploaded = 0;
    let totalSkipped = 0;
    const batchSize = 100;

    // Process in batches
    for (let i = 0; i < csvQuestions.length; i += batchSize) {
      const batch = csvQuestions.slice(i, i + batchSize);
      
      const questionsToInsert = batch.map((q, idx) => {
        const skill = q.skill?.toLowerCase() || 'unknown';
        
        // Convert CSV levels to database levels
        let level = q.level?.toLowerCase() || 'basic';
        if (level === 'basic') level = 'easy';
        if (level === 'intermediate') level = 'medium';
        if (level === 'advanced') level = 'hard';
        
        // Build options array based on question type
        let options = [];
        if (q.type === 'Multiple Choice') {
          options = [
            q.option_a || '',
            q.option_b || '',
            q.option_c || '',
            q.option_d || ''
          ].filter(opt => opt.trim() !== '');
        } else if (q.type === 'Fill in the Blank') {
          options = [
            q.option_a || '',
            q.option_b || '',
            q.option_c || '',
            q.option_d || ''
          ].filter(opt => opt.trim() !== '');
        }

        return {
          question_id: `${skill}-${level}-${Date.now()}-${i + idx}`,
          skill: skill,
          level: level,
          type: q.type === 'Multiple Choice' ? 'mcq' : 
                q.type === 'Fill in the Blank' ? 'fill_blank' :
                q.type === 'One Word Answer' ? 'fill_blank' : 'mcq',
          question: q.question || '',
          options: JSON.stringify(options),
          correct_answer: JSON.stringify(q.correct_answer || ''),
          explanation: q.explanation || '',
          verified: true,
          usage_count: 0
        };
      });

      const { data, error } = await supabase
        .from('questions')
        .insert(questionsToInsert);

      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
        totalSkipped += batch.length;
      } else {
        totalUploaded += batch.length;
        console.log(`✅ Batch ${Math.floor(i / batchSize) + 1}: Uploaded ${batch.length} questions (Total: ${totalUploaded})`);
      }

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Upload Complete!`);
    console.log(`   Total uploaded: ${totalUploaded}`);
    console.log(`   Total skipped: ${totalSkipped}`);
    console.log('='.repeat(60));

    // Show breakdown by skill and level
    console.log('\n📊 Breakdown by Skill and Level:');
    const { data: counts } = await supabase
      .from('questions')
      .select('skill, level')
      .order('skill')
      .order('level');

    if (counts) {
      const breakdown: any = {};
      counts.forEach((q: any) => {
        const key = `${q.skill} - ${q.level}`;
        breakdown[key] = (breakdown[key] || 0) + 1;
      });

      Object.entries(breakdown).forEach(([key, count]) => {
        console.log(`   ${key}: ${count} questions`);
      });
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

const csvFilePath = process.argv[2] || 'client/dist/assets/ogl_developer_questions_combined_3000_cleaned.csv';

if (!fs.existsSync(csvFilePath)) {
  console.error(`❌ File not found: ${csvFilePath}`);
  process.exit(1);
}

uploadCSVToSupabase(csvFilePath);
