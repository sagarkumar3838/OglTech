import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as Papa from 'papaparse';

const supabaseUrl = 'https://ksjgsgebjnpwyycnptom.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzamdzZ2Viam5wd3l5Y25wdG9tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTAzMzk0MSwiZXhwIjoyMDg0NjA5OTQxfQ.9Y2JuAmAXSU7vXZB-UaLQkCw5iddITkJcVTRi6bTfd0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function uploadHtmlMediumQuestions() {
  console.log('🚀 Processing HTML Medium Questions\n');

  const fileContent = fs.readFileSync('client/dist/assets/html_medium.csv', 'utf-8');
  
  const parseResult = Papa.parse(fileContent, {
    skipEmptyLines: true
  });

  const rows = parseResult.data as string[][];
  console.log(`📊 Found ${rows.length} questions in CSV\n`);

  // Remove duplicates based on question text
  const uniqueQuestions = new Map<string, any>();
  let duplicateCount = 0;

  for (const row of rows) {
    if (row.length < 10) continue; // Skip invalid rows
    
    const [skill, level, type, question, optionA, optionB, optionC, optionD, correctAnswer, explanation] = row;
    
    if (!question || question.trim() === '') continue;
    
    const questionKey = question.trim().toLowerCase();
    
    if (uniqueQuestions.has(questionKey)) {
      duplicateCount++;
      console.log(`  ❌ Duplicate: "${question.substring(0, 60)}..."`);
      continue;
    }

    // Normalize type
    let normalizedType = 'mcq';
    if (type && type.toLowerCase().includes('fill')) {
      normalizedType = 'fill_blank';
    }

    uniqueQuestions.set(questionKey, {
      question_id: `html-medium-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      skill: 'html',
      level: 'medium',
      type: normalizedType,
      question: question.trim(),
      options: [
        optionA?.trim() || '',
        optionB?.trim() || '',
        optionC?.trim() || '',
        optionD?.trim() || ''
      ].filter(opt => opt !== ''),
      correct_answer: correctAnswer?.trim() || '',
      explanation: explanation?.trim() || '',
      verified: true,
      usage_count: 0
    });
  }

  const questionsToUpload = Array.from(uniqueQuestions.values());
  
  console.log('\n' + '='.repeat(60));
  console.log(`📊 Results:`);
  console.log(`   Total questions: ${rows.length}`);
  console.log(`   Duplicates removed: ${duplicateCount}`);
  console.log(`   Unique questions: ${questionsToUpload.length}`);
  console.log('='.repeat(60) + '\n');

  // Upload in batches
  const BATCH_SIZE = 100;
  let totalUploaded = 0;

  for (let i = 0; i < questionsToUpload.length; i += BATCH_SIZE) {
    const batch = questionsToUpload.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(questionsToUpload.length / BATCH_SIZE);

    console.log(`📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} questions)`);

    const { error } = await supabase
      .from('questions')
      .insert(batch);

    if (error) {
      console.error(`  ❌ Error: ${error.message}`);
    } else {
      totalUploaded += batch.length;
      console.log(`  ✅ Uploaded ${batch.length} questions`);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Upload Complete!`);
  console.log(`   Total uploaded: ${totalUploaded}`);
  console.log(`   Success rate: ${Math.round((totalUploaded / questionsToUpload.length) * 100)}%`);
  console.log('='.repeat(60));
}

uploadHtmlMediumQuestions().catch(console.error);
