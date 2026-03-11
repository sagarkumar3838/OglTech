import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Make sure .env file has VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

async function uploadGCPBeginner() {
  console.log('🚀 Uploading GCP Beginner Questions\n');
  console.log('='.repeat(60));
  
  const filePath = path.join(__dirname, '..', 'questions', 'gcp-beginner.csv');
  
  if (!fs.existsSync(filePath)) {
    console.error('❌ File not found:', filePath);
    process.exit(1);
  }
  
  console.log('📄 Reading file:', filePath);
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  
  if (lines.length === 0) {
    console.error('❌ File is empty');
    process.exit(1);
  }
  
  // Parse header
  const headers = parseCSVLine(lines[0]);
  console.log('📋 Headers:', headers.join(', '));
  console.log(`📊 Total rows: ${lines.length - 1}\n`);
  
  // Parse data rows
  const questions: any[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    if (values.length !== headers.length) {
      console.warn(`⚠️  Row ${i} has ${values.length} columns, expected ${headers.length}. Skipping.`);
      continue;
    }
    
    const record: any = {};
    headers.forEach((header, index) => {
      record[header] = values[index];
    });
    
    // Transform to database format
    questions.push({
      skill: record.skill || 'GCP',
      level: record.level || 'beginner',
      question_text: record.question_text || '',
      option_a: record.option_a || '',
      option_b: record.option_b || '',
      option_c: record.option_c || '',
      option_d: record.option_d || '',
      correct_answer: record.correct_answer || 'A',
      explanation: record.explanation || '',
      topic: record.topic || '',
      mdn_link: record.mdn_link || '',
      youtube_english: record.youtube_english || '',
      youtube_hindi: record.youtube_hindi || '',
      youtube_kannada: record.youtube_kannada || '',
      youtube_tamil: record.youtube_tamil || '',
      youtube_telugu: record.youtube_telugu || '',
    });
  }
  
  console.log(`✅ Parsed ${questions.length} valid questions\n`);
  
  if (questions.length === 0) {
    console.error('❌ No valid questions to upload');
    process.exit(1);
  }
  
  // Show sample question
  console.log('📝 Sample question:');
  console.log('  Skill:', questions[0].skill);
  console.log('  Level:', questions[0].level);
  console.log('  Question:', questions[0].question_text.substring(0, 60) + '...');
  console.log('  Options: A, B, C, D');
  console.log('  Correct:', questions[0].correct_answer);
  console.log();
  
  // Upload in batches
  console.log('📤 Uploading to Supabase...\n');
  
  const batchSize = 50;
  let uploaded = 0;
  let skipped = 0;
  
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(questions.length / batchSize);
    
    console.log(`   Batch ${batchNum}/${totalBatches} (${batch.length} questions)...`);
    
    const { data, error } = await supabase
      .from('practice_questions')
      .insert(batch)
      .select();
    
    if (error) {
      if (error.message.includes('duplicate') || error.message.includes('unique')) {
        console.log(`   ⚠️  Some questions already exist (skipped)`);
        skipped += batch.length;
      } else {
        console.error(`   ❌ Error:`, error.message);
        console.error('   Details:', error);
      }
    } else {
      uploaded += batch.length;
      console.log(`   ✅ Uploaded ${batch.length} questions`);
    }
    
    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`📊 Upload Summary:`);
  console.log(`   ✅ Uploaded: ${uploaded} questions`);
  console.log(`   ⚠️  Skipped: ${skipped} questions (duplicates)`);
  console.log(`   📝 Total processed: ${questions.length} questions`);
  console.log('\n✅ Upload complete!');
  
  // Verify upload
  console.log('\n🔍 Verifying upload...');
  const { data: verifyData, error: verifyError } = await supabase
    .from('practice_questions')
    .select('id', { count: 'exact' })
    .eq('skill', 'GCP')
    .eq('level', 'beginner');
  
  if (verifyError) {
    console.error('❌ Verification error:', verifyError.message);
  } else {
    console.log(`✅ Found ${verifyData?.length || 0} GCP beginner questions in database`);
  }
}

uploadGCPBeginner().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
