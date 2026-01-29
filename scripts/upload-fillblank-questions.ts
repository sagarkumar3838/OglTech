import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

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

async function uploadFillBlankQuestions() {
  console.log('🚀 Uploading fill-in-the-blank questions...\n');
  
  const csvPath = path.resolve(__dirname, '../client/dist/assets/html_fillblank_questions.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found:', csvPath);
    process.exit(1);
  }
  
  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);
  
  console.log(`📊 Found ${rows.length} fill-blank questions\n`);
  
  const questions = rows.map((row, index) => ({
    question_id: `html_fillblank_${Date.now()}_${index}`,
    skill: row.skill.toLowerCase().trim(),
    level: row.level.toLowerCase() === 'basic' ? 'easy' : 
           row.level.toLowerCase() === 'intermediate' ? 'medium' : 
           row.level.toLowerCase() === 'advanced' ? 'hard' : 
           'easy',
    type: 'fill_blank',
    question: row.question,
    options: [], // No options for fill-blank
    correct_answer: [row.correct_answer.trim()], // Store as array for consistency
    explanation: row.explanation || '',
    blanks: [{ position: 0, answer: row.correct_answer.trim() }] // Store blank info
  }));
  
  console.log('📝 Sample question:');
  console.log(JSON.stringify(questions[0], null, 2));
  console.log('\n');
  
  const { data, error } = await supabase
    .from('questions')
    .insert(questions);
  
  if (error) {
    console.error('❌ Error uploading:', error.message);
  } else {
    console.log(`✅ Uploaded ${questions.length} fill-blank questions`);
  }
  
  // Verify
  const { count } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('type', 'fill_blank');
  
  console.log(`\n📊 Total fill-blank questions in database: ${count}`);
}

uploadFillBlankQuestions().catch(console.error);
