import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Make sure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are in .env');
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

async function uploadAzureAdvanced() {
  console.log('🚀 Uploading Azure Advanced Questions\n');
  console.log('='.repeat(60));
  
  const filePath = path.join(__dirname, '..', 'questions', 'azure-advanced.csv');
  
  if (!fs.existsSync(filePath)) {
    console.error('❌ File not found:', filePath);
    process.exit(1);
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  
  console.log(`📄 File: azure-advanced.csv`);
  console.log(`📊 Total lines: ${lines.length}`);
  
  if (lines.length === 0) {
    console.error('❌ File is empty');
    process.exit(1);
  }
  
  // Parse header
  const headers = parseCSVLine(lines[0]);
  console.log(`📋 Headers: ${headers.join(', ')}\n`);
  
  // Parse data rows
  const questions: any[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    if (values.length === headers.length) {
      const record: any = {};
      headers.forEach((header, index) => {
        record[header] = values[index];
      });
      
      questions.push({
        skill: 'Azure',
        level: 'Advanced',
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
  }
  
  console.log(`✅ Parsed ${questions.length} questions\n`);
  
  if (questions.length === 0) {
    console.error('❌ No valid questions found');
    process.exit(1);
  }
  
  // Upload in batches
  const batchSize = 50;
  let uploaded = 0;
  let skipped = 0;
  
  console.log('📤 Uploading to Supabase...\n');
  
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
        console.log(`   ⚠️  Skipped (duplicates)`);
        skipped += batch.length;
      } else {
        console.error(`   ❌ Error:`, error.message);
      }
    } else {
      uploaded += batch.length;
      console.log(`   ✅ Uploaded ${batch.length} questions`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`📊 Results:`);
  console.log(`   ✅ Uploaded: ${uploaded} questions`);
  console.log(`   ⚠️  Skipped: ${skipped} questions (duplicates)`);
  console.log(`   📝 Total: ${questions.length} questions`);
  console.log('\n✅ Upload complete!');
}

uploadAzureAdvanced().catch(console.error);
