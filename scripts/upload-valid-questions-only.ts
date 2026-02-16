import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const questionsDir = path.join(process.cwd(), 'questions');

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

    if (char === '"') {
      inQuotes = !inQuotes;
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

function parseCSVFile(filePath: string): Question[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());

  if (lines.length <= 1) {
    return [];
  }

  const questions: Question[] = [];
  const headerLine = lines[0];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip if it's a duplicate header
    if (line === headerLine || line.startsWith('skill,level,question_text')) {
      continue;
    }

    const fields = parseCSVLine(line);

    // Skip if not exactly 16 fields
    if (fields.length !== 16) {
      continue;
    }

    // Skip if essential fields are empty
    if (!fields[0] || !fields[2] || !fields[7]) {
      continue;
    }

    questions.push({
      skill: fields[0],
      level: fields[1],
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

  return questions;
}

async function uploadQuestions(questions: Question[], fileName: string): Promise<boolean> {
  if (questions.length === 0) {
    return false;
  }

  try {
    // Upload in batches of 100
    const batchSize = 100;
    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      const { error } = await supabase
        .from('practice_questions')
        .insert(batch);

      if (error) {
        console.error(`   ❌ Error uploading batch: ${error.message}`);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error(`   ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting CSV Upload to Supabase\n');
  console.log('='.repeat(80));

  const csvFiles = fs.readdirSync(questionsDir)
    .filter(file => file.endsWith('.csv'))
    .sort();

  let totalFiles = 0;
  let uploadedFiles = 0;
  let skippedFiles = 0;
  let totalQuestions = 0;

  for (const file of csvFiles) {
    const filePath = path.join(questionsDir, file);
    totalFiles++;

    process.stdout.write(`\n📄 ${file}... `);

    try {
      const questions = parseCSVFile(filePath);

      if (questions.length === 0) {
        console.log(`⏭️  Skipped (0 valid questions)`);
        skippedFiles++;
        continue;
      }

      console.log(`Found ${questions.length} questions`);
      process.stdout.write(`   Uploading... `);

      const success = await uploadQuestions(questions, file);

      if (success) {
        console.log(`✅ Uploaded ${questions.length} questions`);
        uploadedFiles++;
        totalQuestions += questions.length;
      } else {
        console.log(`❌ Failed to upload`);
        skippedFiles++;
      }
    } catch (error) {
      console.log(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      skippedFiles++;
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n📊 SUMMARY:');
  console.log(`Total files processed: ${totalFiles}`);
  console.log(`✅ Successfully uploaded: ${uploadedFiles} files`);
  console.log(`⏭️  Skipped: ${skippedFiles} files`);
  console.log(`📝 Total questions uploaded: ${totalQuestions}`);

  console.log('\n✅ Upload complete!');
  console.log('\nVerify in Supabase with:');
  console.log('SELECT COUNT(*) FROM practice_questions;');
}

main().catch(console.error);
