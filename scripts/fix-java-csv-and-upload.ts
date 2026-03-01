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

async function fixAndUploadJava() {
  console.log('🚀 Starting Java Beginner CSV fix and upload...\n');

  // Read the CSV file as raw text
  const csvPath = path.join(__dirname, '..', 'questions', 'java-beginner.csv');
  console.log('📄 Reading:', csvPath);
  
  let content = fs.readFileSync(csvPath, 'utf-8');
  
  // Fix 1: Remove empty lines
  const lines = content.split('\n').filter(line => line.trim() !== '');
  
  console.log(`📊 Found ${lines.length - 1} data rows (excluding header)\n`);
  
  // Parse manually to handle issues
  const header = lines[0].split(',');
  const questions: any[] = [];
  
  let currentLine = '';
  let inQuotes = false;
  let fieldCount = 0;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    
    // Simple CSV parsing - split by comma but respect quotes
    const fields: string[] = [];
    let currentField = '';
    let insideQuote = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const nextChar = line[j + 1];
      
      if (char === '"') {
        if (insideQuote && nextChar === '"') {
          // Escaped quote
          currentField += '"';
          j++; // Skip next quote
        } else {
          // Toggle quote state
          insideQuote = !insideQuote;
        }
      } else if (char === ',' && !insideQuote) {
        // Field separator
        fields.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    
    // Add last field
    fields.push(currentField.trim());
    
    // Skip if not enough fields (malformed row)
    if (fields.length < 15) {
      console.log(`⚠️  Skipping row ${i + 1}: only ${fields.length} fields`);
      continue;
    }
    
    // Take only first 15 fields (ignore extra YouTube links)
    const validFields = fields.slice(0, 15);
    
    questions.push({
      skill: validFields[0] || 'Java',
      level: validFields[1] || 'Basic',
      question_text: validFields[2],
      option_a: validFields[3],
      option_b: validFields[4],
      option_c: validFields[5],
      option_d: validFields[6],
      correct_answer: validFields[7],
      explanation: validFields[8] || null,
      mdn_link: validFields[9] || null,
      youtube_english: validFields[10] || null,
      youtube_hindi: validFields[11] || null,
      youtube_kannada: validFields[12] || null,
      youtube_tamil: validFields[13] || null,
      youtube_telugu: validFields[14] || null,
    });
  }
  
  console.log(`✅ Parsed ${questions.length} valid questions\n`);
  
  // Delete existing Java Basic questions
  console.log('🗑️  Deleting existing Java Basic questions...');
  const { error: deleteError } = await supabase
    .from('practice_questions')
    .delete()
    .eq('skill', 'Java')
    .eq('level', 'Basic');

  if (deleteError) {
    console.error('❌ Error deleting:', deleteError.message);
  } else {
    console.log('✅ Deleted old questions\n');
  }
  
  // Upload in batches
  const batchSize = 50;
  let uploaded = 0;

  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    
    console.log(`📤 Uploading batch ${Math.floor(i / batchSize) + 1}...`);
    
    const { error } = await supabase
      .from('practice_questions')
      .insert(batch);

    if (error) {
      console.error(`❌ Error:`, error.message);
      console.error('First question in failed batch:', batch[0]);
    } else {
      uploaded += batch.length;
      console.log(`✅ Uploaded ${uploaded}/${questions.length}`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ COMPLETE: ${uploaded} questions uploaded!`);
  console.log('='.repeat(50));
}

fixAndUploadJava().catch(console.error);
