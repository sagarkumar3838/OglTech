import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Get existing skill+level combinations from database
async function getExistingSkillLevels(): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('practice_questions')
    .select('skill, level');

  if (error) {
    console.error('❌ Error fetching existing data:', error.message);
    return new Set();
  }

  const existing = new Set<string>();
  data?.forEach(row => {
    const key = `${row.skill.toLowerCase()}-${row.level.toLowerCase()}`;
    existing.add(key);
  });

  return existing;
}

async function uploadCSV(filePath: string, skill: string, level: string): Promise<number> {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      from_line: 2, // Skip description row
    });

    if (records.length === 0) {
      return 0;
    }

    // Transform records
    const questions = records.map((record: any) => ({
      skill: skill,
      level: level,
      question_text: record.question_text || record.Question,
      option_a: record.option_a || record.Concept1,
      option_b: record.option_b || record.Concept2,
      option_c: record.option_c || record.Concept3,
      option_d: record.option_d || record.Concept4,
      correct_answer: record.correct_answer || record.AnswerType,
      explanation: record.explanation || record.Answer,
      topic: record.topic || record.Category,
      mdn_link: record.mdn_link || record.DocLink,
      youtube_english: record.youtube_english || record.YoutubeSearchEN,
      youtube_hindi: record.youtube_hindi || record.YoutubeSearchHindi,
      youtube_kannada: record.youtube_kannada || record.YoutubeSearchKannada,
      youtube_tamil: record.youtube_tamil || record.YoutubeSearchTamil,
      youtube_telugu: record.youtube_telugu || record.YoutubeSearchTelugu,
    }));

    // Upload in batches
    const batchSize = 50;
    let uploaded = 0;

    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('practice_questions')
        .insert(batch);

      if (error) {
        // Skip duplicate errors, report others
        if (!error.message.includes('duplicate') && !error.message.includes('unique')) {
          console.error(`   ⚠️  Error:`, error.message);
        }
        continue;
      }

      uploaded += batch.length;
    }

    return uploaded;
  } catch (error: any) {
    console.error(`   ❌ Error:`, error.message);
    return 0;
  }
}

async function main() {
  console.log('🚀 Smart Upload - Only Missing Questions\n');
  console.log('=' .repeat(60));

  // Step 1: Get existing data from database
  console.log('📊 Checking existing questions in database...\n');
  const existing = await getExistingSkillLevels();
  console.log(`✅ Found ${existing.size} skill+level combinations already in database\n`);

  // Step 2: Get all CSV files
  const questionsDir = path.join(__dirname, '..', 'questions');
  const allFiles = fs.readdirSync(questionsDir)
    .filter(file => file.endsWith('.csv'))
    .sort();

  console.log(`📁 Found ${allFiles.length} CSV files in questions/ folder\n`);

  // Step 3: Filter out files that are already uploaded
  const filesToUpload: Array<{ file: string; skill: string; level: string }> = [];
  const skippedFiles: string[] = [];

  for (const file of allFiles) {
    // Parse filename: "python-beginner.csv" -> skill="python", level="beginner"
    const match = file.match(/^(.+)-(beginner|intermediate|advanced)\.csv$/);
    if (!match) continue;

    const skill = match[1];
    const levelFile = match[2]; // beginner, intermediate, advanced
    
    // Map to database level names
    const levelDB = levelFile === 'beginner' ? 'Basic' :
                    levelFile === 'intermediate' ? 'Intermediate' :
                    levelFile === 'advanced' ? 'Advanced' : 'Basic';

    const key = `${skill.toLowerCase()}-${levelDB.toLowerCase()}`;

    if (existing.has(key)) {
      skippedFiles.push(file);
    } else {
      filesToUpload.push({ file, skill, level: levelDB });
    }
  }

  console.log('📋 Upload Plan:');
  console.log(`   ✅ Already uploaded: ${skippedFiles.length} files (will skip)`);
  console.log(`   📤 Need to upload: ${filesToUpload.length} files\n`);

  if (filesToUpload.length === 0) {
    console.log('🎉 All questions are already uploaded! Nothing to do.\n');
    return;
  }

  // Step 4: Upload missing files
  console.log('=' .repeat(60));
  console.log('Starting upload of missing files...\n');

  let totalUploaded = 0;
  const results: Array<{ skill: string; level: string; count: number }> = [];

  for (const { file, skill, level } of filesToUpload) {
    const filePath = path.join(questionsDir, file);
    console.log(`📄 Uploading: ${file}`);
    
    const count = await uploadCSV(filePath, skill, level);
    totalUploaded += count;
    results.push({ skill, level, count });
    
    if (count > 0) {
      console.log(`   ✅ Uploaded ${count} questions\n`);
    } else {
      console.log(`   ⚠️  No questions uploaded (may be duplicates)\n`);
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  // Step 5: Summary
  console.log('=' .repeat(60));
  console.log('📊 UPLOAD SUMMARY');
  console.log('=' .repeat(60));
  console.log(`Files skipped (already uploaded): ${skippedFiles.length}`);
  console.log(`Files processed: ${filesToUpload.length}`);
  console.log(`Total questions uploaded: ${totalUploaded}\n`);

  if (skippedFiles.length > 0) {
    console.log('⏭️  Skipped files (already in database):');
    skippedFiles.slice(0, 10).forEach(file => console.log(`   • ${file}`));
    if (skippedFiles.length > 10) {
      console.log(`   ... and ${skippedFiles.length - 10} more`);
    }
    console.log();
  }

  console.log('📋 Newly uploaded:');
  results.forEach(({ skill, level, count }) => {
    const status = count > 0 ? '✅' : '⚠️';
    console.log(`  ${status} ${skill} (${level}): ${count} questions`);
  });

  console.log('\n✅ Upload complete!');
  console.log('\n📌 Next step: Run CHECK_AND_FIX_QUESTIONS.sql to copy to questions table');
}

main().catch(console.error);
