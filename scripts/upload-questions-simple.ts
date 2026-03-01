import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadCSV(filePath: string) {
  const filename = path.basename(filePath, '.csv');
  const [skill, level] = filename.split('-');
  
  // Map level names
  const dbLevel = level === 'beginner' ? 'easy' : 
                  level === 'intermediate' ? 'medium' : 
                  level === 'advanced' ? 'hard' : level;
  
  console.log(`\n📄 Processing: ${filename}`);
  console.log(`   Skill: ${skill}, Level: ${dbLevel}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    });
    
    if (records.length === 0) {
      console.log('   ⚠️  No records found');
      return 0;
    }
    
    // Transform to database format
    const questions = records.map((record: any) => {
      // Parse options - handle both array and object formats
      let options;
      try {
        // Try to parse as JSON first
        options = JSON.parse(record.options || '[]');
      } catch {
        // If not JSON, create array from option_a, option_b, etc.
        options = [
          record.option_a,
          record.option_b,
          record.option_c,
          record.option_d
        ].filter(Boolean);
      }
      
      return {
        skill: record.skill || skill,
        level: record.level || dbLevel,
        type: 'mcq',
        question: record.question || record.question_text,
        options: options,
        correct_answer: record.correct_answer,
        explanation: record.explanation || null,
        topic: record.topic || null,
        mdn_link: record.mdn_link || null,
        youtube_english: record.youtube_english || null,
        youtube_hindi: record.youtube_hindi || null,
        youtube_kannada: record.youtube_kannada || null,
        youtube_tamil: record.youtube_tamil || null,
        youtube_telugu: record.youtube_telugu || null,
      };
    });
    
    // Upload in batches
    const batchSize = 50;
    let uploaded = 0;
    
    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('questions')
        .insert(batch);
      
      if (error) {
        console.error(`   ❌ Error:`, error.message);
        continue;
      }
      
      uploaded += batch.length;
      console.log(`   ✅ Uploaded ${uploaded}/${questions.length}`);
    }
    
    return uploaded;
  } catch (error: any) {
    console.error(`   ❌ Error:`, error.message);
    return 0;
  }
}

async function main() {
  console.log('🚀 Uploading questions to Supabase...\n');
  
  const questionsDir = path.join(__dirname, '..', 'questions');
  
  if (!fs.existsSync(questionsDir)) {
    console.error('❌ questions/ directory not found');
    process.exit(1);
  }
  
  const files = fs.readdirSync(questionsDir)
    .filter(f => f.endsWith('.csv'))
    .sort();
  
  console.log(`📁 Found ${files.length} CSV files\n`);
  
  let total = 0;
  
  for (const file of files) {
    const count = await uploadCSV(path.join(questionsDir, file));
    total += count;
    await new Promise(r => setTimeout(r, 300)); // Rate limit
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Upload complete!`);
  console.log(`   Total uploaded: ${total} questions`);
  console.log('='.repeat(50));
  
  // Verify
  const { count } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true });
  
  console.log(`\n📊 Database now has: ${count} questions`);
}

main().catch(console.error);
