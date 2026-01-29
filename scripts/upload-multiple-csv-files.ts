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

function normalizeSkillName(filename: string): string {
  // Extract skill from filename
  if (filename.includes('ogl_easy')) return 'OGL';
  if (filename.includes('jquery')) return 'jQuery';
  if (filename.includes('js_easy') || filename.includes('javascript')) return 'JavaScript';
  if (filename.includes('css')) return 'CSS';
  if (filename.includes('html')) return 'HTML';
  return 'Unknown';
}

function normalizeLevel(level: string): string {
  const normalized = level.toUpperCase().trim();
  if (normalized === 'EASY' || normalized === 'BASIC') return 'BASIC';
  if (normalized === 'MEDIUM' || normalized === 'INTERMEDIATE') return 'MEDIUM';
  if (normalized === 'HARD' || normalized === 'ADVANCED') return 'ADVANCED';
  return normalized;
}

function readCSVFile(csvPath: string): CSVRow[] {
  console.log(`\n📖 Reading: ${path.basename(csvPath)}`);
  
  if (!fs.existsSync(csvPath)) {
    console.log(`   ⚠️  File not found, skipping`);
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
  
  return records;
}

function transformToSupabase(
  records: CSVRow[],
  defaultSkill: string,
  defaultLevel: string
): SupabaseQuestion[] {
  const transformed: SupabaseQuestion[] = [];

  records.forEach((record) => {
    if (!record.question || !record.correct_answer) {
      return;
    }

    // Use skill from CSV or default
    const skill = record.skill?.trim() || defaultSkill;
    const level = normalizeLevel(record.level?.trim() || defaultLevel);

    // Transform type
    let type = record.type?.toLowerCase().trim() || 'mcq';
    if (type === 'multiple choice') {
      type = 'mcq';
    } else if (type === 'fill blank' || type === 'fill_blank') {
      type = 'fill_blank';
    }

    // Build options array (only for MCQ questions)
    const options: string[] = [];
    if (type === 'mcq') {
      if (record.option_a) options.push(record.option_a.trim());
      if (record.option_b) options.push(record.option_b.trim());
      if (record.option_c) options.push(record.option_c.trim());
      if (record.option_d) options.push(record.option_d.trim());
    }

    transformed.push({
      question_id: '', // Will be set later after deduplication
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
    // Create a unique key based on skill, level, and question text
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
  console.log('Upload Multiple CSV Files');
  console.log('========================================');

  const assetsDir = path.join(__dirname, '../client/dist/assets');

  // Define all CSV files to process
  const csvFiles = [
    { path: path.join(assetsDir, 'ogl_easy_questions.csv'), skill: 'OGL', level: 'BASIC' },
    { path: path.join(assetsDir, 'jquery_easy_questions.csv'), skill: 'jQuery', level: 'BASIC' },
    { path: path.join(assetsDir, 'js_easy_questions.csv'), skill: 'JavaScript', level: 'BASIC' },
    { path: path.join(assetsDir, 'css_easy_questions.csv'), skill: 'CSS', level: 'BASIC' },
    { path: path.join(assetsDir, 'html_basic_new_batch_1_unique.csv'), skill: 'HTML', level: 'BASIC' },
    { path: path.join(assetsDir, 'html_fillblank_questions.csv'), skill: 'HTML', level: 'BASIC' },
  ];

  let allQuestions: SupabaseQuestion[] = [];
  const fileStats: { [key: string]: number } = {};

  // Read and transform all CSV files
  console.log('\n📚 Reading CSV files...');
  for (const file of csvFiles) {
    const records = readCSVFile(file.path);
    if (records.length > 0) {
      const transformed = transformToSupabase(records, file.skill, file.level);
      allQuestions = allQuestions.concat(transformed);
      fileStats[path.basename(file.path)] = transformed.length;
    }
  }

  console.log(`\n📊 Total questions read: ${allQuestions.length}`);

  // Remove duplicates
  console.log('\n🔍 Removing duplicates...');
  const beforeCount = allQuestions.length;
  allQuestions = removeDuplicates(allQuestions);
  const afterCount = allQuestions.length;
  const duplicatesRemoved = beforeCount - afterCount;
  console.log(`   Removed ${duplicatesRemoved} duplicates`);
  console.log(`   Unique questions: ${afterCount}`);

  // Assign unique question IDs
  allQuestions = assignQuestionIds(allQuestions);

  // Group by skill for summary
  const bySkill: { [key: string]: number } = {};
  allQuestions.forEach(q => {
    bySkill[q.skill] = (bySkill[q.skill] || 0) + 1;
  });

  console.log('\n📋 Questions by skill:');
  Object.entries(bySkill).forEach(([skill, count]) => {
    console.log(`   ${skill}: ${count} questions`);
  });

  // Save transformed data
  const outputPath = path.join(assetsDir, 'all_questions_merged_transformed.json');
  fs.writeFileSync(outputPath, JSON.stringify(allQuestions, null, 2));
  console.log(`\n💾 Saved transformed data: ${outputPath}`);

  // Confirm upload
  console.log(`\n⚠️  Ready to upload ${allQuestions.length} questions to Supabase`);
  console.log(`   Press Ctrl+C to cancel, or wait 3 seconds...`);
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Upload to Supabase
  const result = await uploadToSupabase(allQuestions);

  // Summary
  console.log('\n========================================');
  console.log('📊 Upload Summary');
  console.log('========================================');
  console.log(`   Total processed: ${allQuestions.length}`);
  console.log(`   ✅ Success: ${result.success}`);
  console.log(`   ❌ Errors: ${result.errors}`);
  console.log(`   🗑️  Duplicates removed: ${duplicatesRemoved}`);
  console.log('\n📋 By Skill:');
  Object.entries(bySkill).forEach(([skill, count]) => {
    console.log(`   ${skill}: ${count} questions`);
  });
  
  if (result.errorMessages.length > 0) {
    console.log('\n⚠️  Error Details:');
    result.errorMessages.forEach(msg => console.log(`   ${msg}`));
  }
  
  console.log('========================================\n');
}

main();
