import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
// Use SERVICE_ROLE key to bypass RLS for admin operations
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.log('\n💡 Make sure you have either:');
  console.log('   - SUPABASE_SERVICE_ROLE_KEY (recommended for uploads)');
  console.log('   - VITE_SUPABASE_ANON_KEY (will need RLS policy adjustment)');
  process.exit(1);
}

console.log('🔑 Using Supabase key:', supabaseKey.substring(0, 20) + '...');
const supabase = createClient(supabaseUrl, supabaseKey);

// Parse CSV with option_a, option_b, option_c, option_d columns
function parseCSV(filePath: string): any[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }

  // Parse headers
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  console.log('📋 CSV Headers:', headers);

  const questions = [];

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    if (values.length !== headers.length) {
      console.warn(`⚠️  Row ${i + 1} has ${values.length} columns, expected ${headers.length}. Skipping.`);
      continue;
    }

    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });

    // Normalize type to match database constraint
    let questionType = (row.type || 'mcq').toLowerCase().trim();
    
    // Map common variations to valid types
    const typeMapping: { [key: string]: string } = {
      'mcq': 'mcq',
      'multiple_choice': 'mcq',
      'multiplechoice': 'mcq',
      'multi_select': 'multi_select',
      'multiselect': 'multi_select',
      'multiple_select': 'multi_select',
      'coding': 'coding',
      'code': 'coding',
      'fill_blank': 'fill_blank',
      'fillblank': 'fill_blank',
      'fill_in_blank': 'fill_blank',
      'matching': 'matching',
      'match': 'matching'
    };
    
    questionType = typeMapping[questionType] || 'mcq';

    // Transform to match Supabase schema
    const question = {
      question_id: row.question_id || `q_${Date.now()}_${i}`,
      skill: row.skill,
      level: row.level,
      type: questionType,
      question: row.question,
      // Combine option_a, option_b, option_c, option_d into options array
      options: [
        row.option_a,
        row.option_b,
        row.option_c,
        row.option_d
      ].filter(opt => opt && opt.trim() !== ''),
      correct_answer: row.correct_answer,
      explanation: row.explanation || '',
      code_snippet: row.code_snippet || null,
      verified: true
    };

    questions.push(question);
  }

  return questions;
}

// Helper to parse CSV line handling quoted values
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values.map(v => v.replace(/^"|"$/g, ''));
}

async function uploadQuestions(questions: any[]) {
  console.log(`\n📤 Uploading ${questions.length} questions to Supabase...`);

  let successCount = 0;
  let errorCount = 0;

  // Upload in batches of 10
  const batchSize = 10;
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    
    const { data, error } = await supabase
      .from('questions')
      .upsert(batch, { onConflict: 'question_id' });

    if (error) {
      console.error(`❌ Error uploading batch ${i / batchSize + 1}:`, error.message);
      errorCount += batch.length;
    } else {
      successCount += batch.length;
      console.log(`✅ Uploaded batch ${i / batchSize + 1} (${batch.length} questions)`);
    }
  }

  console.log(`\n📊 Upload Summary:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📝 Total: ${questions.length}`);
}

async function main() {
  try {
    console.log('🚀 Starting CSV upload with option transformation...\n');

    // Check if CSV file exists
    const csvPath = process.argv[2] || 'ogl_developer_questions_adjusted.csv';
    
    if (!fs.existsSync(csvPath)) {
      console.error(`❌ CSV file not found: ${csvPath}`);
      console.log('\n💡 Usage: npm run upload-csv-options <path-to-csv>');
      console.log('   Example: npm run upload-csv-options ogl_developer_questions_adjusted.csv');
      process.exit(1);
    }

    console.log(`📁 Reading CSV: ${csvPath}`);
    const questions = parseCSV(csvPath);

    console.log(`\n✅ Parsed ${questions.length} questions`);
    console.log(`\n📋 Sample question structure:`);
    console.log(JSON.stringify(questions[0], null, 2));

    // Upload to Supabase
    await uploadQuestions(questions);

    console.log('\n✅ Upload complete!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
