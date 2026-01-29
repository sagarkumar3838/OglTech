import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import Papa from 'papaparse';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface CSVRow {
  skill: string;
  level: string;
  type: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
}

interface SupabaseQuestion {
  question_id: string;
  skill: string;
  level: string;
  type: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

function generateQuestionId(skill: string, level: string, index: number): string {
  return `${skill.toLowerCase()}_${level.toLowerCase()}_${Date.now()}_${index}`;
}

function transformCSVToSupabase(csvPath: string): SupabaseQuestion[] {
  console.log(`📖 Reading CSV file: ${csvPath}`);
  
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const parsed = Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });
  
  const records = parsed.data as CSVRow[];
  console.log(`📊 Found ${records.length} rows in CSV`);

  // Remove duplicates based on question text
  const uniqueQuestions = new Map<string, CSVRow>();
  records.forEach(record => {
    const key = record.question.trim().toLowerCase();
    if (!uniqueQuestions.has(key)) {
      uniqueQuestions.set(key, record);
    }
  });

  console.log(`✨ After removing duplicates: ${uniqueQuestions.size} unique questions`);

  const transformed: SupabaseQuestion[] = [];
  let index = 0;

  uniqueQuestions.forEach((record) => {
    // Skip if any required field is missing
    if (!record.question || !record.correct_answer) {
      console.warn(`⚠️  Skipping invalid row: ${record.question}`);
      return;
    }

    // Transform type from "Multiple Choice" to "mcq"
    let type = record.type.toLowerCase().trim();
    if (type === 'multiple choice') {
      type = 'mcq';
    }

    // Build options array
    const options: string[] = [];
    if (record.option_a) options.push(record.option_a.trim());
    if (record.option_b) options.push(record.option_b.trim());
    if (record.option_c) options.push(record.option_c.trim());
    if (record.option_d) options.push(record.option_d.trim());

    transformed.push({
      question_id: generateQuestionId(record.skill, record.level, index++),
      skill: record.skill.trim(),
      level: record.level.trim(),
      type: type,
      question: record.question.trim(),
      options: options,
      correct_answer: record.correct_answer.trim(),
      explanation: record.explanation?.trim() || '',
    });
  });

  return transformed;
}

async function uploadToSupabase(questions: SupabaseQuestion[]) {
  console.log(`\n🚀 Uploading ${questions.length} questions to Supabase...`);

  let successCount = 0;
  let errorCount = 0;

  // Upload in batches of 50
  const batchSize = 50;
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    
    const { data, error } = await supabase
      .from('questions')
      .insert(batch)
      .select();

    if (error) {
      console.error(`❌ Error uploading batch ${i / batchSize + 1}:`, error.message);
      errorCount += batch.length;
    } else {
      successCount += batch.length;
      console.log(`✅ Uploaded batch ${i / batchSize + 1}: ${batch.length} questions`);
    }
  }

  console.log(`\n📊 Upload Summary:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📝 Total: ${questions.length}`);
}

async function main() {
  const csvPath = path.join(__dirname, '../client/dist/assets/css_easy_questions.csv');

  if (!fs.existsSync(csvPath)) {
    console.error(`❌ CSV file not found: ${csvPath}`);
    process.exit(1);
  }

  try {
    // Transform CSV
    const questions = transformCSVToSupabase(csvPath);

    // Save transformed data to JSON for review
    const outputPath = path.join(__dirname, '../client/dist/assets/css_easy_questions_transformed.json');
    fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2));
    console.log(`\n💾 Saved transformed data to: ${outputPath}`);

    // Ask for confirmation
    console.log(`\n⚠️  Ready to upload ${questions.length} questions to Supabase`);
    console.log(`   Press Ctrl+C to cancel, or wait 3 seconds to continue...`);
    
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Upload to Supabase
    await uploadToSupabase(questions);

    console.log(`\n✅ Done!`);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
