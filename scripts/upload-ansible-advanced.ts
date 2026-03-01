import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
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
  topic: string;
  mdn_link: string;
  youtube_english: string;
  youtube_hindi: string;
  youtube_kannada: string;
  youtube_tamil: string;
  youtube_telugu: string;
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let currentField = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(currentField.trim());
      currentField = '';
    } else {
      currentField += char;
    }
  }
  
  fields.push(currentField.trim());
  return fields;
}

async function uploadAnsibleAdvanced() {
  // Handle both root and scripts directory execution
  const rootDir = process.cwd().endsWith('scripts') 
    ? path.join(process.cwd(), '..')
    : process.cwd();
  const csvFile = path.join(rootDir, 'questions', 'ansible-advanced.csv');
  
  console.log('========================================');
  console.log('Uploading Ansible Advanced Questions');
  console.log('========================================\n');
  
  // Check if file exists
  if (!fs.existsSync(csvFile)) {
    console.error(`File not found: ${csvFile}`);
    process.exit(1);
  }
  
  // Read and parse CSV
  console.log('Reading CSV file...');
  const content = fs.readFileSync(csvFile, 'utf-8');
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  
  console.log(`Total lines: ${lines.length}`);
  console.log(`Questions to upload: ${lines.length - 1}\n`);
  
  // Check existing questions
  console.log('Checking existing questions in database...');
  const { data: existing, error: checkError } = await supabase
    .from('practice_questions')
    .select('id, question_text')
    .eq('skill', 'Ansible')
    .eq('level', 'Advanced');
  
  if (checkError) {
    console.error('Error checking existing questions:', checkError);
  } else {
    console.log(`Found ${existing?.length || 0} existing Ansible Advanced questions\n`);
  }
  
  // Parse questions
  const questions: Question[] = [];
  const header = parseCSVLine(lines[0]);
  
  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);
    
    if (fields.length < 16) {
      console.log(`Skipping line ${i + 1}: Only ${fields.length} fields`);
      continue;
    }
    
    questions.push({
      skill: fields[0] || 'Ansible',
      level: fields[1] || 'Advanced',
      question_text: fields[2],
      option_a: fields[3],
      option_b: fields[4],
      option_c: fields[5],
      option_d: fields[6],
      correct_answer: fields[7],
      explanation: fields[8],
      topic: fields[9],
      mdn_link: fields[10],
      youtube_english: fields[11],
      youtube_hindi: fields[12],
      youtube_kannada: fields[13],
      youtube_tamil: fields[14],
      youtube_telugu: fields[15]
    });
  }
  
  console.log(`Parsed ${questions.length} valid questions\n`);
  
  // Ask user if they want to delete existing questions
  if (existing && existing.length > 0) {
    console.log('⚠️  WARNING: Existing questions found!');
    console.log('Options:');
    console.log('1. Delete existing and upload new (recommended)');
    console.log('2. Skip upload (keep existing)');
    console.log('3. Add new questions (may create duplicates)\n');
    
    // For automation, we'll delete and re-upload
    console.log('Deleting existing Ansible Advanced questions...');
    const { error: deleteError } = await supabase
      .from('practice_questions')
      .delete()
      .eq('skill', 'Ansible')
      .eq('level', 'Advanced');
    
    if (deleteError) {
      console.error('Error deleting existing questions:', deleteError);
      process.exit(1);
    }
    console.log('✓ Existing questions deleted\n');
  }
  
  // Upload in batches
  console.log('Uploading questions to database...');
  const batchSize = 50;
  let uploaded = 0;
  let failed = 0;
  
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    
    const { data, error } = await supabase
      .from('practice_questions')
      .insert(batch)
      .select();
    
    if (error) {
      console.error(`Batch ${Math.floor(i / batchSize) + 1} failed:`, error.message);
      failed += batch.length;
    } else {
      uploaded += data?.length || 0;
      console.log(`✓ Batch ${Math.floor(i / batchSize) + 1}: ${data?.length} questions uploaded`);
    }
  }
  
  console.log('\n========================================');
  console.log('Upload Complete!');
  console.log('========================================');
  console.log(`Successfully uploaded: ${uploaded} questions`);
  console.log(`Failed: ${failed} questions`);
  
  // Verify upload
  console.log('\nVerifying upload...');
  const { data: verify, error: verifyError } = await supabase
    .from('practice_questions')
    .select('id')
    .eq('skill', 'Ansible')
    .eq('level', 'Advanced');
  
  if (verifyError) {
    console.error('Verification error:', verifyError);
  } else {
    console.log(`✓ Verified: ${verify?.length || 0} Ansible Advanced questions in database`);
  }
}

uploadAnsibleAdvanced().catch(console.error);
