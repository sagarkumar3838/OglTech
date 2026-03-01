import * as fs from 'fs';
import * as path from 'path';

interface Question {
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
  mdn_link: string;
  youtube_english: string;
  youtube_hindi: string;
  youtube_kannada: string;
  youtube_tamil: string;
  youtube_telugu: string;
}

// Escape CSV field - wrap in quotes if contains comma, quote, or newline
function escapeCSVField(field: string): string {
  if (!field) return '';
  
  // Convert to string and trim
  const str = String(field).trim();
  
  // If field contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  
  return str;
}

// Parse a CSV line with proper quote handling
function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let currentField = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      fields.push(currentField.trim());
      currentField = '';
    } else {
      currentField += char;
    }
  }
  
  // Add last field
  fields.push(currentField.trim());
  
  return fields;
}

async function fixAngularAdvancedCSV() {
  const inputFile = path.join(process.cwd(), 'questions', 'angular-advanced.csv');
  const outputFile = path.join(process.cwd(), 'questions', 'angular-advanced-fixed.csv');
  const backupFile = path.join(process.cwd(), 'questions', 'angular-advanced.csv.backup');
  
  console.log('Reading angular-advanced.csv...');
  const content = fs.readFileSync(inputFile, 'utf-8');
  const lines = content.split(/\r?\n/);
  
  console.log(`Total lines: ${lines.length}`);
  
  // Parse header
  const header = parseCSVLine(lines[0]);
  console.log(`Header fields: ${header.length}`);
  console.log(`Expected: skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu`);
  
  const fixedLines: string[] = [];
  const headerLine = 'skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu';
  fixedLines.push(headerLine);
  
  let validQuestions = 0;
  let fixedQuestions = 0;
  let skippedLines = 0;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) {
      skippedLines++;
      continue;
    }
    
    try {
      const fields = parseCSVLine(line);
      
      // Skip lines with wrong field count
      if (fields.length < 16) {
        console.log(`Line ${i + 1}: Skipping - only ${fields.length} fields`);
        skippedLines++;
        continue;
      }
      
      // Take first 16 fields (in case there are extra)
      const question: Question = {
        skill: fields[0] || 'Angular',
        level: fields[1] || 'Advanced',
        question_text: fields[2] || '',
        option_a: fields[3] || '',
        option_b: fields[4] || '',
        option_c: fields[5] || '',
        option_d: fields[6] || '',
        correct_answer: fields[7] || '',
        explanation: fields[8] || '',
        topic: fields[9] || '',
        mdn_link: fields[10] || '',
        youtube_english: fields[11] || '',
        youtube_hindi: fields[12] || '',
        youtube_kannada: fields[13] || '',
        youtube_tamil: fields[14] || '',
        youtube_telugu: fields[15] || ''
      };
      
      // Validate required fields
      if (!question.question_text || !question.correct_answer) {
        console.log(`Line ${i + 1}: Skipping - missing required fields`);
        skippedLines++;
        continue;
      }
      
      // Build properly escaped CSV line
      const escapedLine = [
        escapeCSVField(question.skill),
        escapeCSVField(question.level),
        escapeCSVField(question.question_text),
        escapeCSVField(question.option_a),
        escapeCSVField(question.option_b),
        escapeCSVField(question.option_c),
        escapeCSVField(question.option_d),
        escapeCSVField(question.correct_answer),
        escapeCSVField(question.explanation),
        escapeCSVField(question.topic),
        escapeCSVField(question.mdn_link),
        escapeCSVField(question.youtube_english),
        escapeCSVField(question.youtube_hindi),
        escapeCSVField(question.youtube_kannada),
        escapeCSVField(question.youtube_tamil),
        escapeCSVField(question.youtube_telugu)
      ].join(',');
      
      fixedLines.push(escapedLine);
      validQuestions++;
      
      if (fields.length !== 16) {
        fixedQuestions++;
      }
      
    } catch (error) {
      console.log(`Line ${i + 1}: Error parsing - ${error}`);
      skippedLines++;
    }
  }
  
  // Create backup
  console.log('\nCreating backup...');
  fs.copyFileSync(inputFile, backupFile);
  
  // Write fixed file
  console.log('Writing fixed CSV...');
  fs.writeFileSync(outputFile, fixedLines.join('\n'), 'utf-8');
  
  console.log('\n=== FIX SUMMARY ===');
  console.log(`Total lines processed: ${lines.length - 1}`);
  console.log(`Valid questions: ${validQuestions}`);
  console.log(`Fixed questions: ${fixedQuestions}`);
  console.log(`Skipped lines: ${skippedLines}`);
  console.log(`\nBackup saved to: ${backupFile}`);
  console.log(`Fixed file saved to: ${outputFile}`);
  console.log('\nTo replace original file, run:');
  console.log(`  Copy-Item "${outputFile}" "${inputFile}" -Force`);
}

fixAngularAdvancedCSV().catch(console.error);
