import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('   Make sure .env has VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
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
      console.log(`   💡 Check: File might be empty or have invalid format`);
      return { uploaded: 0, skipped: 0, errors: 1 };
    }
    
    console.log(`   📊 Found ${records.length} questions in CSV`);
    
    // Transform to database format and validate
    const questions: QuestionRecord[] = [];
    const issues: string[] = [];
    
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const rowNum = i + 2; // +2 because row 1 is header, array is 0-indexed
      
      const question: QuestionRecord = {
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
      if (!question.correct_answer || !['A', 'B', 'C', 'D'].includes(question.correct_answer.toUpperCase())) {
        issues.push(`Row ${rowNum}: Invalid correct_answer (must be A, B, C, or D)`);
      }
      
      questions.push(question);
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
    
    // Provide helpful error messages
    if (error.code === 'ENOENT') {
      console.log(`   💡 File not found. Check the file path.`);
    } else if (error.message.includes('UTF-8')) {
      console.log(`   💡 File encoding issue. Save file as UTF-8.`);
    } else if (error.message.includes('parse') || error.message.includes('CSV')) {
      console.log(`   💡 CSV format issue. Check for:`);
      console.log(`      - Proper comma separation`);
      console.log(`      - Quotes around text with commas`);
      console.log(`      - Matching column count in all rows`);
    }
    
    return { uploaded: 0, skipped: 0, errors: 1 };
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  console.log('🚀 CSV Upload Tool (No Duplicates)\n');
  console.log('='.repeat(70));
  
  let filesToProcess: string[] = [];
  
  if (args.length > 0) {
    // Upload specific file(s)
    filesToProcess = args;
    console.log(`📁 Processing ${filesToProcess.length} specified file(s)\n`);
  } else {
    // Upload all CSV files in questions directory
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
  const results: Array<{ file: string; uploaded: number; skipped: number; errors: number }> = [];
  const problemFiles: Array<{ file: string; issue: string }> = [];
  
  for (const filePath of filesToProcess) {
    const fileName = path.basename(filePath);
    
    // Parse filename: "python-beginner.csv"
    const match = fileName.match(/^(.+)-(beginner|intermediate|advanced)\.csv$/i);
    if (!match) {
      console.log(`\n❌ ${fileName}`);
      console.log(`   ERROR: Invalid filename format`);
      console.log(`   💡 Expected format: skill-level.csv`);
      console.log(`   💡 Examples: python-beginner.csv, react-advanced.csv`);
      problemFiles.push({ file: fileName, issue: 'Invalid filename format' });
      totalErrors++;
      continue;
    }
    
    const skill = match[1].toLowerCase();
    const levelFile = match[2].toLowerCase();
    const levelDB = levelFile === 'beginner' ? 'beginner' :
                    levelFile === 'intermediate' ? 'intermediate' : 'advanced';
    
    console.log(`\n📄 ${fileName}`);
    console.log(`   Skill: ${skill} | Level: ${levelDB}`);
    
    const result = await uploadFile(filePath, skill, levelDB);
    
    totalUploaded += result.uploaded;
    totalSkipped += result.skipped;
    totalErrors += result.errors;
    results.push({ file: fileName, ...result });
    
    if (result.errors > 0) {
      problemFiles.push({ file: fileName, issue: 'Upload failed - check file format and content' });
    }
    
    if (result.uploaded > 0) {
      console.log(`   ✅ Successfully uploaded ${result.uploaded} questions`);
    }
    
    // Small delay between files
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
  
  // Show problem files if any
  if (problemFiles.length > 0) {
    console.log('\n⚠️  FILES WITH ISSUES:');
    console.log('='.repeat(70));
    problemFiles.forEach(({ file, issue }) => {
      console.log(`❌ ${file}`);
      console.log(`   Issue: ${issue}`);
    });
    console.log('='.repeat(70));
    console.log('\n💡 Fix these files and run the command again.');
  }
  
  if (totalUploaded > 0) {
    console.log('\n✨ Upload complete! New questions added to database.');
  } else if (totalSkipped > 0 && totalErrors === 0) {
    console.log('\n✨ All questions already exist in database.');
  } else if (totalErrors > 0) {
    console.log('\n⚠️  Upload completed with errors. Check the issues above.');
  }
}

main().catch(console.error);
