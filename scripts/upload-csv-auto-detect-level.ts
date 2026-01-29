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
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
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

function normalizeLevel(level: string): string {
  const normalized = level.toUpperCase().trim();
  if (normalized === 'EASY' || normalized === 'BASIC') return 'BASIC';
  if (normalized === 'MEDIUM' || normalized === 'INTERMEDIATE') return 'MEDIUM';
  if (normalized === 'HARD' || normalized === 'ADVANCED') return 'ADVANCED';
  return normalized;
}

function readAndTransformCSV(csvPath: string): SupabaseQuestion[] {
  console.log(`\n📖 Reading: ${path.basename(csvPath)}`);
  
  if (!fs.existsSync(csvPath)) {
    console.log(`   ⚠️  File not found`);
    return [];
  }

  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const parsed = Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });
  
  const records = parsed.data as CSVRow[];
  console.log(`   Found ${records.length} rows`);

  const transformed: SupabaseQuestion[] = [];

  records.forEach((record) => {
    if (!record.question || !record.correct_answer || !record.skill || !record.level) {
      return;
    }

    // Use level from CSV (not from filename!)
    const level = normalizeLevel(record.level);
    const skill = record.skill.trim();

    // Transform type
    let type = record.type?.toLowerCase().trim() || 'mcq';
    if (type === 'multiple choice') {
      type = 'mcq';
    } else if (type === 'fill blank' || type === 'fill_blank' || type === 'fill in the blank') {
      type = 'fill_blank';
    }

    // Build options array (only for MCQ)
    const options: string[] = [];
    if (type === 'mcq') {
      if (record.option_a) options.push(record.option_a.trim());
      if (record.option_b) options.push(record.option_b.trim());
      if (record.option_c) options.push(record.option_c.trim());
      if (record.option_d) options.push(record.option_d.trim());
    }

    transformed.push({
      question_id: '', // Will be set after deduplication
      skill: skill,
      level: level,
      type: type,
      question: record.question.trim(),
      options: options,
      correct_answer: record.correct_answer.trim(),
      explanation: record.explanation?.trim() || '',
    });
  });

  return transformed;
}

function removeDuplicates(questions: SupabaseQuestion[]): SupabaseQuestion[] {
  const uniqueMap = new Map<string, SupabaseQuestion>();
  
  questions.forEach((q) => {
    const key = `${q.skill.toLowerCase()}_${q.level.toLowerCase()}_${q.question.toLowerCase().trim()}`;
    
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, q);
    }
  });

  return Array.from(uniqueMap.values());
}

function assignQuestionIds(questions: SupabaseQuestion[]): SupabaseQuestion[] {
  return questions.map((q, index) => ({
    ...q,
    question_id: generateQuestionId(q.skill, q.level, index),
  }));
}

async function uploadToSupabase(questions: SupabaseQuestion[]) {
  console.log(`\n🚀 Uploading ${questions.length} questions to Supabase...`);

  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  const batchSize = 50;
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    
    const { data, error } = await supabase
      .from('questions')
      .insert(batch)
      .select();

    if (error) {
      console.error(`   ❌ Batch ${i / batchSize + 1} failed:`, error.message);
      errorCount += batch.length;
      errors.push(`Batch ${i / batchSize + 1}: ${error.message}`);
    } else {
      successCount += batch.length;
      console.log(`   ✅ Batch ${i / batchSize + 1}: ${batch.length} questions`);
    }
  }

  return { success: successCount, errors: errorCount, errorMessages: errors };
}

async function main() {
  console.log('========================================');
  console.log('Upload CSV with Auto-Detect Level');
  console.log('========================================');

  const csvFile = process.argv[2];
  
  if (!csvFile) {
    console.error('❌ Please provide CSV file path');
    console.log('\nUsage: npx tsx scripts/upload-csv-auto-detect-level.ts <csv-file-path>');
    console.log('Example: npx tsx scripts/upload-csv-auto-detect-level.ts client/dist/assets/css_easy_questions.csv');
    process.exit(1);
  }

  const csvPath = path.resolve(csvFile);

  // Read and transform
  let allQuestions = readAndTransformCSV(csvPath);

  if (allQuestions.length === 0) {
    console.log('\n❌ No valid questions found!');
    process.exit(1);
  }

  console.log(`\n📊 Total questions read: ${allQuestions.length}`);

  // Group by level to show breakdown
  const byLevel: { [key: string]: number } = {};
  allQuestions.forEach(q => {
    byLevel[q.level] = (byLevel[q.level] || 0) + 1;
  });

  console.log('\n📋 Questions by level (before deduplication):');
  Object.entries(byLevel).forEach(([level, count]) => {
    console.log(`   ${level}: ${count} questions`);
  });

  // Remove duplicates
  console.log('\n🔍 Removing duplicates...');
  const beforeCount = allQuestions.length;
  allQuestions = removeDuplicates(allQuestions);
  const afterCount = allQuestions.length;
  const duplicatesRemoved = beforeCount - afterCount;
  console.log(`   Removed ${duplicatesRemoved} duplicates`);
  console.log(`   Unique questions: ${afterCount}`);

  // Group by level after deduplication
  const byLevelAfter: { [key: string]: number } = {};
  allQuestions.forEach(q => {
    byLevelAfter[q.level] = (byLevelAfter[q.level] || 0) + 1;
  });

  console.log('\n📋 Questions by level (after deduplication):');
  Object.entries(byLevelAfter).forEach(([level, count]) => {
    console.log(`   ${level}: ${count} questions`);
  });

  // Assign unique question IDs
  allQuestions = assignQuestionIds(allQuestions);

  // Save transformed data
  const outputPath = csvPath.replace('.csv', '_transformed.json');
  fs.writeFileSync(outputPath, JSON.stringify(allQuestions, null, 2));
  console.log(`\n💾 Saved transformed data: ${outputPath}`);

  // Confirm upload
  console.log(`\n⚠️  Ready to upload ${allQuestions.length} questions to Supabase`);
  console.log(`   Press Ctrl+C to cancel, or wait 3 seconds...`);
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Upload
  const result = await uploadToSupabase(allQuestions);

  // Summary
  console.log('\n========================================');
  console.log('📊 Upload Summary');
  console.log('========================================');
  console.log(`   Total processed: ${allQuestions.length}`);
  console.log(`   ✅ Success: ${result.success}`);
  console.log(`   ❌ Errors: ${result.errors}`);
  console.log(`   🗑️  Duplicates removed: ${duplicatesRemoved}`);
  console.log('\n📋 By Level:');
  Object.entries(byLevelAfter).forEach(([level, count]) => {
    console.log(`   ${level}: ${count} questions`);
  });
  
  if (result.errorMessages.length > 0) {
    console.log('\n⚠️  Error Details:');
    result.errorMessages.forEach(msg => console.log(`   ${msg}`));
  }
  
  console.log('========================================\n');
}

main();
