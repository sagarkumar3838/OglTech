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

async function uploadCSV(csvFile: string, skillName: string) {
  console.log(`\n📂 Processing ${csvFile}...`);
  
  const csvPath = path.resolve(__dirname, '../client/dist/assets', csvFile);
  
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ File not found: ${csvPath}`);
    return 0;
  }
  
  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);
  
  console.log(`   Found ${rows.length} questions`);
  
  const questions = rows.map((row, index) => ({
    question_id: `${skillName}_easy_${Date.now()}_${index}`,
    skill: skillName,
    level: row.level?.toLowerCase() === 'basic' ? 'easy' : 
           row.level?.toLowerCase() === 'intermediate' ? 'medium' : 
           row.level?.toLowerCase() === 'advanced' ? 'hard' : 
           'easy',
    type: 'mcq',
    question: row.question,
    options: [row.option_a, row.option_b, row.option_c, row.option_d].filter(Boolean),
    correct_answer: [row.correct_answer],
    explanation: row.explanation || ''
  }));
  
  const batchSize = 100;
  let uploaded = 0;
  
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    
    const { error } = await supabase
      .from('questions')
      .insert(batch);
    
    if (error) {
      console.error(`   ❌ Error: ${error.message}`);
    } else {
      uploaded += batch.length;
    }
  }
  
  console.log(`   ✅ Uploaded ${uploaded} questions`);
  return uploaded;
}

async function main() {
  console.log('🚀 Starting bulk upload of easy questions...\n');
  
  const files = [
    { file: 'html_easy_questions.csv', skill: 'html' },
    { file: 'css_easy_questions.csv', skill: 'css' },
    { file: 'js_easy_questions.csv', skill: 'javascript' },
    { file: 'jquery_easy_questions.csv', skill: 'jquery' },
    { file: 'ogl_easy_questions.csv', skill: 'oglknowledge' }
  ];
  
  let totalUploaded = 0;
  
  for (const { file, skill } of files) {
    const count = await uploadCSV(file, skill);
    totalUploaded += count;
  }
  
  console.log(`\n✅ Total uploaded: ${totalUploaded} questions\n`);
  
  // Verify
  console.log('📊 Database summary:');
  const { data } = await supabase
    .from('questions')
    .select('skill, level')
    .eq('level', 'easy');
  
  if (data) {
    const summary: Record<string, number> = {};
    data.forEach(q => {
      summary[q.skill] = (summary[q.skill] || 0) + 1;
    });
    
    Object.entries(summary).forEach(([skill, count]) => {
      console.log(`   ${skill}: ${count} easy questions`);
    });
  }
}

main().catch(console.error);
