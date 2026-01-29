import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Parse CSV manually (simple parser)
function parseCSV(content: string) {
  const lines = content.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
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
    
    const obj: any = {};
    headers.forEach((header, i) => {
      obj[header.trim()] = values[i]?.replace(/^"|"$/g, '') || '';
    });
    return obj;
  });
}

async function uploadQuestions() {
  console.log('🚀 Starting HTML questions upload...\n');
  
  const csvPath = path.resolve(__dirname, '../client/dist/assets/html_easy_questions.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found:', csvPath);
    process.exit(1);
  }
  
  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);
  
  console.log(`📊 Found ${rows.length} questions in CSV\n`);
  
  // Transform and upload
  const questions = rows.map((row, index) => ({
    question_id: `html_easy_${index + 1}`,
    skill: row.skill.toLowerCase().trim(),
    level: row.level.toLowerCase() === 'basic' ? 'easy' : 
           row.level.toLowerCase() === 'intermediate' ? 'medium' : 
           row.level.toLowerCase() === 'advanced' ? 'hard' : 
           row.level.toLowerCase(),
    type: 'mcq',
    question: row.question,
    options: [row.option_a, row.option_b, row.option_c, row.option_d].filter(Boolean),
    correct_answer: [row.correct_answer],
    explanation: row.explanation
  }));
  
  console.log('📝 Sample question:');
  console.log(JSON.stringify(questions[0], null, 2));
  console.log('\n');
  
  // Upload in batches
  const batchSize = 100;
  let uploaded = 0;
  
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    
    const { data, error } = await supabase
      .from('questions')
      .insert(batch);
    
    if (error) {
      console.error(`❌ Error uploading batch ${i / batchSize + 1}:`, error.message);
    } else {
      uploaded += batch.length;
      console.log(`✅ Uploaded batch ${i / batchSize + 1}: ${batch.length} questions (Total: ${uploaded})`);
    }
  }
  
  console.log(`\n✅ Upload complete! ${uploaded} questions uploaded`);
  
  // Verify
  const { data: verify, error: verifyError } = await supabase
    .from('questions')
    .select('skill, level, count')
    .eq('skill', 'html')
    .eq('level', 'easy');
  
  if (!verifyError) {
    console.log('\n📊 Verification:');
    const { count } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('skill', 'html')
      .eq('level', 'easy');
    
    console.log(`   HTML Easy questions: ${count}`);
  }
}

uploadQuestions().catch(console.error);
