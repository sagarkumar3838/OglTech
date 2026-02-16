ole.log('\n✅ Upload complete!');
  console.log('\n📌 Next step: Run CHECK_AND_FIX_QUESTIONS.sql to copy to questions table');
}

main().catch(console.error);
rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 UPLOAD SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total beginner files: ${beginnerFiles.length}`);
  console.log(`Total questions uploaded: ${totalUploaded}`);
  console.log('\n📋 Breakdown by skill:');
  
  results.forEach(({ skill, count }) => {
    const status = count > 0 ? '✅' : '❌';
    console.log(`  ${status} ${skill}: ${count} questions`);
  });

  consfile => file.endsWith('-beginner.csv'))
    .sort();

  console.log(`\n📁 Found ${beginnerFiles.length} beginner CSV files\n`);

  let totalUploaded = 0;
  const results: Array<{ skill: string; count: number }> = [];

  for (const file of beginnerFiles) {
    const filePath = path.join(questionsDir, file);
    const skill = file.replace('-beginner.csv', '');
    
    const count = await uploadBeginnerCSV(filePath);
    totalUploaded += count;
    results.push({ skill, count });
    
    // Small delay to avoid 
      }

      uploaded += batch.length;
      console.log(`   ✅ Uploaded ${uploaded}/${questions.length}`);
    }

    return uploaded;
  } catch (error: any) {
    console.error(`   ❌ Error:`, error.message);
    return 0;
  }
}

async function main() {
  console.log('🚀 Uploading ALL Beginner-Level Questions\n');
  console.log('=' .repeat(60));

  const questionsDir = path.join(__dirname, '..', 'questions');
  
  // Get all beginner CSV files
  const beginnerFiles = fs.readdirSync(questionsDir)
    .filter(utube_tamil || record.YoutubeSearchTamil,
      youtube_telugu: record.youtube_telugu || record.YoutubeSearchTelugu,
    }));

    // Upload in batches
    const batchSize = 50;
    let uploaded = 0;

    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('practice_questions')
        .insert(batch);

      if (error) {
        console.error(`   ❌ Error:`, error.message);
        continue;   option_d: record.option_d || record.Concept4,
      correct_answer: record.correct_answer || record.AnswerType,
      explanation: record.explanation || record.Answer,
      topic: record.topic || record.Category,
      mdn_link: record.mdn_link || record.DocLink,
      youtube_english: record.youtube_english || record.YoutubeSearchEN,
      youtube_hindi: record.youtube_hindi || record.YoutubeSearchHindi,
      youtube_kannada: record.youtube_kannada || record.YoutubeSearchKannada,
      youtube_tamil: record.yol = filename.split('-')[0];

    console.log(`   Found ${records.length} questions for ${skill}`);

    // Transform to match practice_questions table structure
    const questions = records.map((record: any) => ({
      skill: skill,
      level: 'Basic', // All beginner files map to "Basic"
      question_text: record.question_text || record.Question,
      option_a: record.option_a || record.Concept1,
      option_b: record.option_b || record.Concept2,
      option_c: record.option_c || record.Concept3,
   me(filePath)}`);
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      from_line: 2, // Skip the description row
    });

    if (records.length === 0) {
      console.log(`⚠️  No data found`);
      return 0;
    }

    // Extract skill from filename (e.g., "python-beginner.csv" -> "python")
    const filename = path.basename(filePath, '.csv');
    const skilc';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadBeginnerCSV(filePath: string): Promise<number> {
  try {
    console.log(`\n📄 Reading: ${path.basenaimport { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/syn