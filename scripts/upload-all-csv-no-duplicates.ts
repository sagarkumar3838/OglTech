import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface Question {
  skill: string;
  level: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
  mdn_link?: string;
  youtube_english?: string;
  youtube_hindi?: string;
  youtube_kannada?: string;
  youtube_tamil?: string;
  youtube_telugu?: string;
}

async function uploadAllCSVFiles() {
  const questionsDir = path.join(process.cwd(), 'questions');
  
  if (!fs.existsSync(questionsDir)) {
    console.error('❌ Questions directory not found:', questionsDir);
    process.exit(1);
  }

  const csvFiles = fs.readdirSync(questionsDir)
    .filter(file => file.endsWith('.csv') && !file.includes('.backup'));

  console.log(`\n📁 Found ${csvFiles.length} CSV files to process\n`);

  let totalProcessed = 0;
  let totalInserted = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const file of csvFiles) {
    const filePath = path.join(questionsDir, file);
    console.log(`\n📄 Processing: ${file}`);

    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      // Parse CSV
      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_quotes: true,
        relax_column_count: true,
      });

      console.log(`   Found ${records.length} questions`);

      let fileInserted = 0;
      let fileSkipped = 0;
      let fileErrors = 0;

      for (const record of records) {
        totalProcessed++;

        // Validate required fields
        if (!record.skill || !record.level || !record.question_text) {
          console.log(`   ⚠️  Skipping invalid record (missing required fields)`);
          fileSkipped++;
          totalSkipped++;
          continue;
        }

        // Prepare question object
        const question: Question = {
          skill: record.skill.trim(),
          level: record.level.trim(),
          question_text: record.question_text.trim(),
          option_a: record.option_a?.trim() || '',
          option_b: record.option_b?.trim() || '',
          option_c: record.option_c?.trim() || '',
          option_d: record.option_d?.trim() || '',
          correct_answer: record.correct_answer?.trim() || 'A',
          explanation: record.explanation?.trim() || '',
          mdn_link: record.mdn_link?.trim() || null,
          youtube_english: record.youtube_english?.trim() || null,
          youtube_hindi: record.youtube_hindi?.trim() || null,
          youtube_kannada: record.youtube_kannada?.trim() || null,
          youtube_tamil: record.youtube_tamil?.trim() || null,
          youtube_telugu: record.youtube_telugu?.trim() || null,
        };

        // Check if question already exists
        const { data: existing, error: checkError } = await supabase
          .from('practice_questions')
          .select('id')
          .eq('skill', question.skill)
          .eq('level', question.level)
          .eq('question_text', question.question_text)
          .maybeSingle();

        if (checkError) {
          console.log(`   ❌ Error checking duplicate: ${checkError.message}`);
          fileErrors++;
          totalErrors++;
          continue;
        }

        if (existing) {
          fileSkipped++;
          totalSkipped++;
          continue;
        }

        // Insert new question
        const { error: insertError } = await supabase
          .from('practice_questions')
          .insert([question]);

        if (insertError) {
          console.log(`   ❌ Error inserting: ${insertError.message}`);
          fileErrors++;
          totalErrors++;
        } else {
          fileInserted++;
          totalInserted++;
        }
      }

      console.log(`   ✅ Inserted: ${fileInserted} | ⏭️  Skipped: ${fileSkipped} | ❌ Errors: ${fileErrors}`);

    } catch (error) {
      console.error(`   ❌ Error processing file: ${error}`);
      totalErrors++;
    }
  }

  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 UPLOAD SUMMARY');
  console.log('='.repeat(60));
  console.log(`📁 Files processed:     ${csvFiles.length}`);
  console.log(`📝 Questions processed: ${totalProcessed}`);
  console.log(`✅ Successfully inserted: ${totalInserted}`);
  console.log(`⏭️  Skipped (duplicates): ${totalSkipped}`);
  console.log(`❌ Errors:              ${totalErrors}`);
  console.log('='.repeat(60));

  // Verify final count
  const { count, error } = await supabase
    .from('practice_questions')
    .select('*', { count: 'exact', head: true });

  if (!error) {
    console.log(`\n🎯 Total questions in database: ${count}`);
  }

  console.log('\n✨ Upload complete!\n');
}

// Run the upload
uploadAllCSVFiles().catch(console.error);
