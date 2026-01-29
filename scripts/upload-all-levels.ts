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

function transformCSVToSupabase(csvPath: string, skill: string, level: string): SupabaseQuestion[] {
  console.log(`\n📖 Reading: ${csvPath}`);
  
  if (!fs.existsSync(csvPath)) {
    console.log(`⚠️  File not found, skipping: ${csvPath}`);
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

  // Remove duplicates
  const uniqueQuestions = new Map<string, CSVRow>();
  records.forEach(record => {
    const key = record.question?.trim().toLowerCase();
    if (key && !uniqueQuestions.has(key)) {
      uniqueQuestions.set(key, record);
    }
  });

  console.log(`   Unique: ${uniqueQuestions.size} questions`);

  const transformed: SupabaseQuestion[] = [];
  let index = 0;

  uniqueQuestions.forEach((record) => {
    if (!record.question || !record.correct_answer) {
      return;
    }

    let type = record.type?.toLowerCase().trim() || 'mcq';
    if (type === 'multiple choice') {
      type = 'mcq';
    } else if (type === 'fill blank' || type === 'fill_blank') {
      type = 'fill_blank';
    }

    const options: string[] = [];
    // Only add options for MCQ questions
    if (type === 'mcq') {
      if (record.option_a) options.push(record.option_a.trim());
      if (record.option_b) options.push(record.option_b.trim());
      if (record.option_c) options.push(record.option_c.trim());
      if (record.option_d) options.push(record.option_d.trim());
    }

    transformed.push({
      question_id: generateQuestionId(skill, level, index++),
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

async function uploadToSupabase(questions: SupabaseQuestion[], label: string) {
  if (questions.length === 0) {
    console.log(`⚠️  No questions to upload for ${label}`);
    return { success: 0, errors: 0 };
  }

  console.log(`\n🚀 Uploading ${questions.length} ${label} questions...`);

  let successCount = 0;
  let errorCount = 0;

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
    } else {
      successCount += batch.length;
      console.log(`   ✅ Batch ${i / batchSize + 1}: ${batch.length} questions`);
    }
  }

  return { success: successCount, errors: errorCount };
}

async function main() {
  console.log('========================================');
  console.log('Upload Questions - All Levels');
  console.log('========================================');

  const skill = process.argv[2] || 'CSS';
  const assetsDir = path.join(__dirname, '../client/dist/assets');

  // Define file patterns
  const files = [
    { path: path.join(assetsDir, `${skill.toLowerCase()}_basic_questions.csv`), level: 'BASIC' },
    { path: path.join(assetsDir, `${skill.toLowerCase()}_medium_questions.csv`), level: 'MEDIUM' },
    { path: path.join(assetsDir, `${skill.toLowerCase()}_advanced_questions.csv`), level: 'ADVANCED' },
    // Also check for "easy" instead of "basic"
    { path: path.join(assetsDir, `${skill.toLowerCase()}_easy_questions.csv`), level: 'BASIC' },
  ];

  let allQuestions: SupabaseQuestion[] = [];
  const stats: { [key: string]: { success: number; errors: number } } = {};

  // Transform all files
  for (const file of files) {
    const questions = transformCSVToSupabase(file.path, skill, file.level);
    if (questions.length > 0) {
      allQuestions = allQuestions.concat(questions);
    }
  }

  if (allQuestions.length === 0) {
    console.log('\n❌ No questions found to upload!');
    console.log('\nExpected files:');
    console.log(`   - ${skill.toLowerCase()}_basic_questions.csv`);
    console.log(`   - ${skill.toLowerCase()}_medium_questions.csv`);
    console.log(`   - ${skill.toLowerCase()}_advanced_questions.csv`);
    console.log(`\nOr:`);
    console.log(`   - ${skill.toLowerCase()}_easy_questions.csv`);
    process.exit(1);
  }

  // Save transformed data
  const outputPath = path.join(assetsDir, `${skill.toLowerCase()}_all_levels_transformed.json`);
  fs.writeFileSync(outputPath, JSON.stringify(allQuestions, null, 2));
  console.log(`\n💾 Saved transformed data: ${outputPath}`);

  // Confirm upload
  console.log(`\n⚠️  Ready to upload ${allQuestions.length} questions to Supabase`);
  console.log(`   Press Ctrl+C to cancel, or wait 3 seconds...`);
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Upload all questions
  const result = await uploadToSupabase(allQuestions, skill);

  // Summary
  console.log('\n========================================');
  console.log('📊 Upload Summary');
  console.log('========================================');
  console.log(`   Skill: ${skill}`);
  console.log(`   ✅ Success: ${result.success}`);
  console.log(`   ❌ Errors: ${result.errors}`);
  console.log(`   📝 Total: ${allQuestions.length}`);
  console.log('========================================\n');
}

main();
