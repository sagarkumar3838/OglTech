import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
// Use service role key for bulk uploads (bypasses RLS)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Missing Supabase credentials!');
  console.error('Please check your .env file has:');
  console.error('  VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  process.exit(1);
}

console.log('✅ Using Supabase URL:', supabaseUrl);
console.log('✅ Using key type:', supabaseKey.includes('service_role') ? 'SERVICE_ROLE' : 'ANON');

const supabase = createClient(supabaseUrl, supabaseKey);

interface Question {
  skill: string;
  level: string;
  question_text: string;
  option_a?: string;  // Category/Topic field, not MCQ option
  option_b?: string;  // Category/Topic field, not MCQ option
  option_c?: string;  // Category/Topic field, not MCQ option
  option_d?: string;  // Additional info field
  correct_answer: string;
  explanation?: string;
  topic?: string;
  mdn_link?: string;
  youtube_english?: string;
  youtube_hindi?: string;
  youtube_kannada?: string;
  youtube_tamil?: string;
  youtube_telugu?: string;
  question_type?: string;
}

async function uploadQuestionsFromCSV(filePath: string): Promise<number> {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,  // Allow inconsistent column counts
      quote: '"',                 // Handle quoted fields
      escape: '"',                // Handle escaped quotes
      relax_quotes: true,         // Be lenient with quotes
    });

    if (records.length === 0) {
      console.log(`⚠️  No questions found in ${path.basename(filePath)}`);
      return 0;
    }

    // Transform records to match database schema
    const questions: Question[] = records.map((record: any) => ({
      skill: record.skill || extractSkillFromFilename(filePath),
      level: record.level || extractLevelFromFilename(filePath),
      question_text: record.question_text || record.question,
      option_a: record.option_a || null,
      option_b: record.option_b || null,
      option_c: record.option_c || null,
      option_d: record.option_d || null,
      correct_answer: record.correct_answer,
      explanation: record.explanation || null,
      topic: record.topic || null,
      mdn_link: record.mdn_link || null,
      youtube_english: record.youtube_english || null,
      youtube_hindi: record.youtube_hindi || null,
      youtube_kannada: record.youtube_kannada || null,
      youtube_tamil: record.youtube_tamil || null,
      youtube_telugu: record.youtube_telugu || null,
      question_type: 'descriptive',
    }));

    // Upload in batches of 100
    const batchSize = 100;
    let uploadedCount = 0;

    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('practice_questions')
        .insert(batch);

      if (error) {
        console.error(`❌ Error uploading batch from ${path.basename(filePath)}:`, error.message);
        continue;
      }

      uploadedCount += batch.length;
      console.log(`✅ Uploaded ${uploadedCount}/${questions.length} questions from ${path.basename(filePath)}`);
    }

    return uploadedCount;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error);
    return 0;
  }
}

function extractSkillFromFilename(filePath: string): string {
  const filename = path.basename(filePath, '.csv');
  const parts = filename.split('-');
  return parts[0] || 'unknown';
}

function extractLevelFromFilename(filePath: string): string {
  const filename = path.basename(filePath, '.csv');
  if (filename.includes('beginner')) return 'Basic';
  if (filename.includes('intermediate')) return 'Intermediate';
  if (filename.includes('advanced')) return 'Advanced';
  return 'Basic';
}

async function uploadAllQuestions() {
  console.log('🚀 Starting upload of all practice questions...\n');

  const questionsDir = path.join(__dirname, '..', 'questions');
  
  if (!fs.existsSync(questionsDir)) {
    console.error('❌ Questions directory not found!');
    return;
  }

  const files = fs.readdirSync(questionsDir)
    .filter(file => file.endsWith('.csv'))
    .sort();

  console.log(`📁 Found ${files.length} CSV files\n`);

  let totalUploaded = 0;
  const results: { file: string; count: number }[] = [];

  for (const file of files) {
    const filePath = path.join(questionsDir, file);
    console.log(`\n📄 Processing: ${file}`);
    
    const count = await uploadQuestionsFromCSV(filePath);
    totalUploaded += count;
    results.push({ file, count });
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 UPLOAD SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total files processed: ${files.length}`);
  console.log(`Total questions uploaded: ${totalUploaded}`);
  console.log('\n📋 Breakdown by file:');
  
  results.forEach(({ file, count }) => {
    console.log(`  ${file}: ${count} questions`);
  });

  console.log('\n✅ Upload complete!');
}

// Run the upload
uploadAllQuestions().catch(console.error);
