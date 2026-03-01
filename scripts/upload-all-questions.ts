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
  option_a: string;  // MCQ option A
  option_b: string;  // MCQ option B
  option_c: string;  // MCQ option C
  option_d: string;  // MCQ option D
  correct_answer: string;  // Letter: A, B, C, or D
  explanation?: string;
  topic?: string;
  mdn_link?: string;
  youtube_english?: string;
  youtube_hindi?: string;
  youtube_kannada?: string;
  youtube_tamil?: string;
  youtube_telugu?: string;
}

async function uploadQuestionsFromCSV(filePath: string): Promise<{ inserted: number; skipped: number; errors: number }> {
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

    console.log(`Found ${records.length} questions`);
    
    if (records.length === 0) {
      return { inserted: 0, skipped: 0, errors: 0 };
    }

    // Transform records to match database schema, filtering out invalid records
    const questions: Question[] = [];
    let skippedCount = 0;
    
    for (const record of records) {
      // Validate required fields
      if (!record.question_text && !record.question) {
        console.log(`       ⚠️  Skipping invalid record (missing required fields)`);
        skippedCount++;
        continue;
      }
      
      questions.push({
        skill: record.skill || extractSkillFromFilename(filePath),
        level: record.level || extractLevelFromFilename(filePath),
        question_text: record.question_text || record.question,
        option_a: record.option_a || '',
        option_b: record.option_b || '',
        option_c: record.option_c || '',
        option_d: record.option_d || '',
        correct_answer: record.correct_answer || 'A',
        explanation: record.explanation || null,
        topic: record.topic || 'Basics',
        mdn_link: record.mdn_link || null,
        youtube_english: record.youtube_english || null,
        youtube_hindi: record.youtube_hindi || null,
        youtube_kannada: record.youtube_kannada || null,
        youtube_tamil: record.youtube_tamil || null,
        youtube_telugu: record.youtube_telugu || null,
      });
    }

    // Upload in batches of 100
    const batchSize = 100;
    let insertedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('practice_questions')
        .insert(batch)
        .select('id');

      if (error) {
        // Check if it's a duplicate error
        if (error.message.includes('duplicate') || error.code === '23505') {
          skippedCount += batch.length;
        } else {
          console.error(`       ❌ Error uploading batch:`, error.message);
          errorCount += batch.length;
        }
        continue;
      }

      insertedCount += data?.length || batch.length;
    }

    console.log(`✅ Inserted: ${insertedCount} | ⏭️  Skipped: ${skippedCount} | ❌ Errors: ${errorCount}`);
    return { inserted: insertedCount, skipped: skippedCount, errors: errorCount };
  } catch (error: any) {
    console.error(`❌ Error processing file: ${error.message}`);
    return { inserted: 0, skipped: 0, errors: 1 };
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

  console.log(`📁 Files processed:     ${files.length}\n`);

  let totalInserted = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  let filesProcessed = 0;

  for (const file of files) {
    const filePath = path.join(questionsDir, file);
    console.log(`📄 Processing: ${file}`);
    
    const result = await uploadQuestionsFromCSV(filePath);
    totalInserted += result.inserted;
    totalSkipped += result.skipped;
    totalErrors += result.errors;
    filesProcessed++;
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  // Get total count from database
  const { count } = await supabase
    .from('practice_questions')
    .select('*', { count: 'exact', head: true });

  console.log('\n' + '='.repeat(60));
  console.log('📊 UPLOAD SUMMARY');
  console.log('='.repeat(60));
  console.log(`📁 Files processed:     ${filesProcessed}`);
  console.log(`📝 Questions processed: ${totalInserted + totalSkipped + totalErrors}`);
  console.log(`✅ Successfully inserted: ${totalInserted}`);
  console.log(`⏭️  Skipped (duplicates): ${totalSkipped}`);
  console.log(`❌ Errors:              ${totalErrors}`);
  console.log('='.repeat(60));
  console.log(`🎯 Total questions in database: ${count || 'unknown'}`);
  console.log('✨ Upload complete!');
}

// Run the upload
uploadAllQuestions().catch(console.error);
