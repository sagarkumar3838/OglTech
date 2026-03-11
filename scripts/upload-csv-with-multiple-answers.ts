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

interface QuestionRecord {
  skill: string;
  level: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  correct_answers?: string[];
  question_type?: 'single' | 'multiple';
  explanation: string;
  topic: string;
  mdn_link?: string;
  youtube_english?: string;
  youtube_hindi?: string;
  youtube_kannada?: string;
  youtube_tamil?: string;
  youtube_telugu?: string;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim().replace(/^"|"$/g, ''));
  return result;
}

function parseCSVContent(content: string): any[] {
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  
  if (lines.length === 0) return [];
  
  const headers = parseCSVLine(lines[0]);
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

/**
 * Parse correct answer field to support multiple answers
 * Formats supported:
 * - Single: "A"
 * - Multiple (comma): "A,B,D"
 * - Multiple (pipe): "A|B|D"
 * - Multiple (space): "A B D"
 */
function parseCorrectAnswer(answerStr: string): { answers: string[]; type: 'single' | 'multiple' } {
  if (!answerStr) {
    return { answers: ['A'], type: 'single' };
  }
  
  // Clean the string
  const cleaned = answerStr.trim().toUpperCase();
  
  // Try different separators
  let answers: string[] = [];
  
  if (cleaned.includes(',')) {
    answers = cleaned.split(',').map(a => a.trim()).filter(a => a);
  } else if (cleaned.includes('|')) {
    answers = cleaned.split('|').map(a => a.trim()).filter(a => a);
  } else if (cleaned.includes(' ')) {
    answers = cleaned.split(/\s+/).map(a => a.trim()).filter(a => a);
  } else {
    answers = [cleaned];
  }
  
  // Validate answers are A, B, C, or D
  const validAnswers = answers.filter(a => ['A', 'B', 'C', 'D'].includes(a));
  
  if (validAnswers.length === 0) {
    return { answers: ['A'], type: 'single' };
  }
  
  return {
    answers: validAnswers,
    type: validAnswers.length > 1 ? 'multiple' : 'single'
  };
}

async function checkDuplicates(skill: string, level: string, questionTexts: string[]): Promise<Set<string>> {
  try {
    const { data, error } = await supabase
      .from('practice_questions')
      .select('question_text')
      .eq('skill', skill)
      .eq('level', level)
      .in('question_text', questionTexts);
    
    if (error) {
      console.error('   ⚠️  Error checking duplicates:', error.message);
      return new Set();
    }
    
    return new Set(data?.map(q => q.question_text) || []);
  } catch (error: any) {
    console.error('   ⚠️  Error checking duplicates:', error.message);
    return new Set();
  }
}

async function uploadFile(filePath: string, skill: string, level: string): Promise<{ uploaded: number; skipped: number; errors: number }> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const records = parseCSVContent(content);
    
    if (records.length === 0) {
      console.log(`   ❌ ERROR: No records found in file`);
      return { uploaded: 0, skipped: 0, errors: 1 };
    }
    
    console.log(`   📊 Found ${records.length} questions in CSV`);
    
    // Transform to database format
    const questions: QuestionRecord[] = [];
    const issues: string[] = [];
    let multipleAnswerCount = 0;
    
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const rowNum = i + 2;
      
      // Parse correct answer(s)
      const { answers, type } = parseCorrectAnswer(record.correct_answer || record.AnswerType || 'A');
      
      if (type === 'multiple') {
        multipleAnswerCount++;
      }
      
      const question: QuestionRecord = {
        skill: skill,
        level: level,
        question_text: record.question_text || record.Question || '',
        option_a: record.option_a || record.Concept1 || '',
        option_b: record.option_b || record.Concept2 || '',
        option_c: record.option_c || record.Concept3 || '',
        option_d: record.option_d || record.Concept4 || '',
        correct_answer: answers[0], // Keep for backward compatibility
        correct_answers: answers,
        question_type: type,
        explanation: record.explanation || record.Answer || '',
        topic: record.topic || record.Category || '',
        mdn_link: record.mdn_link || record.DocLink || '',
        youtube_english: record.youtube_english || record.YoutubeSearchEN || '',
        youtube_hindi: record.youtube_hindi || record.YoutubeSearchHindi || '',
        youtube_kannada: record.youtube_kannada || record.YoutubeSearchKannada || '',
        youtube_tamil: record.youtube_tamil || record.YoutubeSearchTamil || '',
        youtube_telugu: record.youtube_telugu || record.YoutubeSearchTelugu || '',
      };
      
      // Validate required fields
      if (!question.question_text || question.question_text.trim() === '') {
        issues.push(`Row ${rowNum}: Missing question_text`);
      }
      if (!question.option_a || question.option_a.trim() === '') {
        issues.push(`Row ${rowNum}: Missing option_a`);
      }
      if (!question.option_b || question.option_b.trim() === '') {
        issues.push(`Row ${rowNum}: Missing option_b`);
      }
      
      questions.push(question);
    }
    
    // Report statistics
    if (multipleAnswerCount > 0) {
      console.log(`   🎯 Found ${multipleAnswerCount} questions with multiple correct answers`);
    }
    
    // Report validation issues
    if (issues.length > 0) {
      console.log(`   ⚠️  Found ${issues.length} validation issue(s):`);
      issues.slice(0, 5).forEach(issue => console.log(`      - ${issue}`));
      if (issues.length > 5) {
        console.log(`      ... and ${issues.length - 5} more issues`);
      }
    }
    
    // Check for duplicates
    const questionTexts = questions.map(q => q.question_text);
    const existingQuestions = await checkDuplicates(skill, level, questionTexts);
    
    // Filter out duplicates
    const newQuestions = questions.filter(q => !existingQuestions.has(q.question_text));
    const skippedCount = questions.length - newQuestions.length;
    
    if (skippedCount > 0) {
      console.log(`   ⏭️  Skipping ${skippedCount} duplicate questions`);
    }
    
    if (newQuestions.length === 0) {
      console.log(`   ℹ️  All questions already exist in database`);
      return { uploaded: 0, skipped: skippedCount, errors: 0 };
    }
    
    console.log(`   ⬆️  Uploading ${newQuestions.length} new questions...`);
    
    // Upload in batches
    const batchSize = 50;
    let uploaded = 0;
    let errors = 0;
    
    for (let i = 0; i < newQuestions.length; i += batchSize) {
      const batch = newQuestions.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('practice_questions')
        .insert(batch);
      
      if (error) {
        console.error(`   ❌ Batch error:`, error.message);
        errors += batch.length;
        continue;
      }
      
      uploaded += batch.length;
    }
    
    return { uploaded, skipped: skippedCount, errors };
  } catch (error: any) {
    console.error(`   ❌ FILE ERROR:`, error.message);
    return { uploaded: 0, skipped: 0, errors: 1 };
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  console.log('🚀 CSV Upload Tool (Multiple Answers Support)\n');
  console.log('='.repeat(70));
  console.log('✨ Features:');
  console.log('   - Single answer: correct_answer = "A"');
  console.log('   - Multiple answers: correct_answer = "A,B,D" or "A|B|D"');
  console.log('='.repeat(70) + '\n');
  
  let filesToProcess: string[] = [];
  
  if (args.length > 0) {
    filesToProcess = args;
    console.log(`📁 Processing ${filesToProcess.length} specified file(s)\n`);
  } else {
    const questionsDir = path.join(__dirname, '..', 'questions');
    
    if (!fs.existsSync(questionsDir)) {
      console.error('❌ Questions directory not found!');
      process.exit(1);
    }
    
    filesToProcess = fs.readdirSync(questionsDir)
      .filter(f => f.endsWith('.csv'))
      .map(f => path.join(questionsDir, f))
      .sort();
    
    console.log(`📁 Found ${filesToProcess.length} CSV files in questions directory\n`);
  }
  
  let totalUploaded = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  
  for (const filePath of filesToProcess) {
    const fileName = path.basename(filePath);
    
    const match = fileName.match(/^(.+)-(beginner|intermediate|advanced)\.csv$/i);
    if (!match) {
      console.log(`\n❌ ${fileName}: Invalid filename format`);
      totalErrors++;
      continue;
    }
    
    const skill = match[1].toLowerCase();
    const levelDB = match[2].toLowerCase();
    
    console.log(`\n📄 ${fileName}`);
    console.log(`   Skill: ${skill} | Level: ${levelDB}`);
    
    const result = await uploadFile(filePath, skill, levelDB);
    
    totalUploaded += result.uploaded;
    totalSkipped += result.skipped;
    totalErrors += result.errors;
    
    if (result.uploaded > 0) {
      console.log(`   ✅ Successfully uploaded ${result.uploaded} questions`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('📊 SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Uploaded:  ${totalUploaded} new questions`);
  console.log(`⏭️  Skipped:   ${totalSkipped} duplicates`);
  if (totalErrors > 0) {
    console.log(`❌ Errors:    ${totalErrors} failed`);
  }
  console.log('='.repeat(70));
  
  if (totalUploaded > 0) {
    console.log('\n✨ Upload complete! Questions with multiple answers are now supported.');
  }
}

main().catch(console.error);
