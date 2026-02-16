import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function parseCSVContent(content: string): any[] {
  // Split by newlines, but handle cases where data might be on same line as header
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  
  if (lines.length === 0) return [];
  
  // First line is header
  const headers = parseCSVLine(lines[0]);
  
  // Rest are data rows
  const records: any[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    if (values.length === headers.length) {
      const record: any = {};
      headers.forEach((header, index) => {
        record[header] = values[index];
      });
      records.push(record);
    }
  }
  
  return records;
}

async function uploadFile(filePath: string, skill: string, level: string): Promise<number> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const records = parseCSVContent(content);
    
    if (records.length === 0) {
      console.log(`   ⚠️  No records found`);
      return 0;
    }
    
    // Transform to database format
    const questions = records.map(record => ({
      skill: skill,
      level: level,
      question_text: record.question_text || record.Question || '',
      option_a: record.option_a || record.Concept1 || '',
      option_b: record.option_b || record.Concept2 || '',
      option_c: record.option_c || record.Concept3 || '',
      option_d: record.option_d || record.Concept4 || '',
      correct_answer: record.correct_answer || record.AnswerType || 'A',
      explanation: record.explanation || record.Answer || '',
      topic: record.topic || record.Category || '',
      mdn_link: record.mdn_link || record.DocLink || '',
      youtube_english: record.youtube_english || record.YoutubeSearchEN || '',
      youtube_hindi: record.youtube_hindi || record.YoutubeSearchHindi || '',
      youtube_kannada: record.youtube_kannada || record.YoutubeSearchKannada || '',
      youtube_tamil: record.youtube_tamil || record.YoutubeSearchTamil || '',
      youtube_telugu: record.youtube_telugu || record.YoutubeSearchTelugu || '',
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
  console.log('🚀 Uploading All CSV Files\n');
  console.log('='.repeat(60));
  
  const questionsDir = path.join(__dirname, '..', 'questions');
  const files = fs.readdirSync(questionsDir)
    .filter(f => f.endsWith('.csv'))
    .sort();
  
  console.log(`📁 Found ${files.length} CSV files\n`);
  
  let totalUploaded = 0;
  const results: Array<{ file: string; count: number }> = [];
  
  for (const file of files) {
    // Parse filename: "python-beginner.csv"
    const match = file.match(/^(.+)-(beginner|intermediate|advanced)\.csv$/);
    if (!match) continue;
    
    const skill = match[1];
    const levelFile = match[2];
    const levelDB = levelFile === 'beginner' ? 'Basic' :
                    levelFile === 'intermediate' ? 'Intermediate' : 'Advanced';
    
    console.log(`📄 ${file}`);
    
    const filePath = path.join(questionsDir, file);
    const count = await uploadFile(filePath, skill, levelDB);
    
    totalUploaded += count;
    results.push({ file, count });
    
    if (count > 0) {
      console.log(`   ✅ Uploaded ${count} questions\n`);
    } else {
      console.log(`   ⚠️  No questions uploaded\n`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('='.repeat(60));
  console.log(`📊 Total uploaded: ${totalUploaded} questions`);
  console.log('\n✅ Upload complete!');
  console.log('\n📌 Next: Run CHECK_AND_FIX_QUESTIONS.sql in Supabase');
}

main().catch(console.error);
