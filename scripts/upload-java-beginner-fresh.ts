import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadJavaBeginner() {
  console.log('🚀 Starting Java Beginner upload...\n');

  // Step 1: Delete existing Java Basic questions
  console.log('🗑️  Deleting existing Java Basic questions...');
  const { error: deleteError } = await supabase
    .from('practice_questions')
    .delete()
    .eq('skill', 'Java')
    .eq('level', 'Basic');

  if (deleteError) {
    console.error('❌ Error deleting:', deleteError.message);
  } else {
    console.log('✅ Deleted old questions\n');
  }

  // Step 2: Read CSV
  const csvPath = path.join(__dirname, '..', 'questions', 'java-beginner.csv');
  console.log('📄 Reading:', csvPath);
  
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
    quote: '"',
    escape: '"',
    relax_quotes: true,
  });

  console.log(`📊 Found ${records.length} questions in CSV\n`);

  // Step 3: Transform and upload
  const questions = records.map((record: any) => ({
    skill: record.skill || 'Java',
    level: record.level || 'Basic',
    question_text: record.question_text,
    option_a: record.option_a,
    option_b: record.option_b,
    option_c: record.option_c,
    option_d: record.option_d,
    correct_answer: record.correct_answer,
    explanation: record.explanation || null,
    topic: record.topic || 'Basics',
    mdn_link: record.mdn_link || null,
    youtube_english: record.youtube_english || null,
    youtube_hindi: record.youtube_hindi || null,
    youtube_kannada: record.youtube_kannada || null,
    youtube_tamil: record.youtube_tamil || null,
    youtube_telugu: record.youtube_telugu || null,
  }));

  // Upload in batches
  const batchSize = 50;
  let uploaded = 0;

  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    
    console.log(`📤 Uploading batch ${Math.floor(i / batchSize) + 1}...`);
    
    const { error } = await supabase
      .from('practice_questions')
      .insert(batch);

    if (error) {
      console.error(`❌ Error:`, error.message);
      console.error('First question in failed batch:', batch[0]);
    } else {
      uploaded += batch.length;
      console.log(`✅ Uploaded ${uploaded}/${questions.length}`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ COMPLETE: ${uploaded} questions uploaded!`);
  console.log('='.repeat(50));
}

uploadJavaBeginner().catch(console.error);
