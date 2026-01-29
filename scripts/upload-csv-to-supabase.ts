import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as Papa from 'papaparse';

const supabaseUrl = 'https://ksjgsgebjnpwyycnptom.supabase.co';
// Use service_role key to bypass RLS
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzamdzZ2Viam5wd3l5Y25wdG9tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTAzMzk0MSwiZXhwIjoyMDg0NjA5OTQxfQ.9Y2JuAmAXSU7vXZB-UaLQkCw5iddITkJcVTRi6bTfd0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface CSVRow {
  skill: string;
  level: string;
  type: string;
  question: string;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  correct_answer: string;
  explanation: string;
}

/**
 * Upload questions from CSV file to Supabase
 * Supports large batches (25,000+ questions)
 * 
 * Usage:
 * npx tsx scripts/upload-csv-to-supabase.ts path/to/questions.csv [--clear]
 * 
 * Options:
 * --clear: Delete all existing questions before uploading
 */
async function uploadQuestionsFromCSV(csvFilePath: string, clearExisting: boolean = false) {
  console.log('🚀 Starting CSV to Supabase Upload\n');
  console.log(`Reading file: ${csvFilePath}\n`);

  try {
    // Clear existing questions if requested
    if (clearExisting) {
      console.log('🗑️  Clearing existing questions...');
      const { error: deleteError } = await supabase
        .from('questions')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      
      if (deleteError) {
        console.error('❌ Error clearing questions:', deleteError.message);
      } else {
        console.log('✅ Existing questions cleared\n');
      }
    }
    // Read CSV file
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
    
    // Parse CSV
    const parseResult = Papa.parse<CSVRow>(fileContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, '_')
    });

    const rows = parseResult.data;
    console.log(`📊 Found ${rows.length} questions in CSV\n`);

    if (rows.length === 0) {
      console.error('❌ No questions found in CSV');
      return;
    }

    // Process in batches of 100 to avoid timeouts
    const BATCH_SIZE = 100;
    let totalUploaded = 0;
    let totalSkipped = 0;

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(rows.length / BATCH_SIZE);

      console.log(`\n📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} questions)`);

      // Prepare questions for insertion
      const questionsToInsert = batch.map((row, idx) => {
        // Skip rows with missing required fields
        if (!row.skill || !row.level || !row.type || !row.question || !row.correct_answer) {
          console.log(`  ⚠️  Skipping row ${i + idx + 1}: Missing required fields`);
          return null;
        }

        // Normalize skill name: lowercase, remove spaces
        // "HTML" -> "html", "OGL Knowledge" -> "oglknowledge"
        const normalizedSkill = row.skill.trim().toLowerCase().replace(/\s+/g, '');
        
        // Normalize level: BASIC -> easy, INTERMEDIATE -> medium, ADVANCED -> hard
        let normalizedLevel = row.level.trim().toLowerCase();
        if (normalizedLevel === 'basic' || normalizedLevel === 'beginner') {
          normalizedLevel = 'easy';
        } else if (normalizedLevel === 'intermediate' || normalizedLevel === 'inter') {
          normalizedLevel = 'medium';
        } else if (normalizedLevel === 'advanced' || normalizedLevel === 'expert') {
          normalizedLevel = 'hard';
        }
        
        // Build options array
        const options = [];
        if (row.option_a) options.push(row.option_a.trim());
        if (row.option_b) options.push(row.option_b.trim());
        if (row.option_c) options.push(row.option_c.trim());
        if (row.option_d) options.push(row.option_d.trim());

        // Normalize type
        let normalizedType = 'mcq';
        const typeStr = row.type.trim().toLowerCase();
        if (typeStr.includes('multiple') || typeStr.includes('choice')) {
          normalizedType = 'mcq';
        } else if (typeStr.includes('fill') || typeStr.includes('blank')) {
          normalizedType = 'fill_blank';
        } else if (typeStr.includes('coding')) {
          normalizedType = 'coding';
        }

        // Generate unique question_id using random string
        const randomId = Math.random().toString(36).substring(2, 15);
        const uniqueId = `${normalizedSkill}-${normalizedLevel}-${Date.now()}-${randomId}-${i + idx}`;

        return {
          question_id: uniqueId,
          skill: normalizedSkill,
          level: normalizedLevel,
          type: normalizedType,
          question: row.question.trim(),
          options: options,
          correct_answer: row.correct_answer.trim(),
          explanation: row.explanation?.trim() || '',
          verified: true,
          usage_count: 0
        };
      }).filter(q => q !== null); // Filter out null entries

      // Insert into Supabase
      const { data, error } = await supabase
        .from('questions')
        .insert(questionsToInsert);

      if (error) {
        console.error(`  ❌ Error in batch ${batchNumber}: ${error.message}`);
        console.error(`  Error details:`, error);
        totalSkipped += batch.length;
      } else {
        console.log(`  ✅ Uploaded ${batch.length} questions`);
        totalUploaded += batch.length;
      }

      // Progress indicator
      const progress = Math.round(((i + batch.length) / rows.length) * 100);
      console.log(`  📊 Progress: ${progress}% (${totalUploaded}/${rows.length})`);

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Upload Complete!`);
    console.log(`   Total uploaded: ${totalUploaded}`);
    console.log(`   Total skipped: ${totalSkipped}`);
    console.log(`   Success rate: ${Math.round((totalUploaded / rows.length) * 100)}%`);
    console.log('='.repeat(60));

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Get file path from command line argument
const csvFilePath = process.argv[2];
const clearExisting = process.argv.includes('--clear');

if (!csvFilePath) {
  console.error('❌ Please provide a CSV file path');
  console.log('\nUsage:');
  console.log('  npx tsx scripts/upload-csv-to-supabase.ts path/to/questions.csv [--clear]');
  console.log('\nOptions:');
  console.log('  --clear    Delete all existing questions before uploading');
  console.log('\nExamples:');
  console.log('  npx tsx scripts/upload-csv-to-supabase.ts ./questions.csv');
  console.log('  npx tsx scripts/upload-csv-to-supabase.ts ./questions.csv --clear');
  process.exit(1);
}

if (!fs.existsSync(csvFilePath)) {
  console.error(`❌ File not found: ${csvFilePath}`);
  process.exit(1);
}

uploadQuestionsFromCSV(csvFilePath, clearExisting);
