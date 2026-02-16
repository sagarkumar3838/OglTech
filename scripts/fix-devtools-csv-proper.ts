import * as fs from 'fs';
import * as path from 'path';

const inputFile = path.join(process.cwd(), 'questions', 'devtools-beginner.csv');
const outputFile = path.join(process.cwd(), 'questions', 'devtools-beginner-fixed.csv');

// Read the file
const content = fs.readFileSync(inputFile, 'utf-8');
const lines = content.split('\n').filter(line => line.trim());

// Expected headers
const headers = [
  'skill', 'level', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d',
  'correct_answer', 'explanation', 'topic', 'mdn_link', 'youtube_english',
  'youtube_hindi', 'youtube_kannada', 'youtube_tamil', 'youtube_telugu'
];

const fixedLines: string[] = [];
fixedLines.push(headers.join(','));

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  // Split by comma
  const parts = line.split(',');
  
  if (parts.length === 16) {
    // Perfect - just add it
    fixedLines.push(line);
    continue;
  }
  
  // If we have more than 16 parts, we need to fix it
  // The issue is usually in the explanation field (index 8) which may contain commas
  // Strategy: Take first 8 fields, then merge middle fields until we have the right count for the last 7 fields
  
  const skill = parts[0];
  const level = parts[1];
  const question_text = parts[2];
  const option_a = parts[3];
  const option_b = parts[4];
  const option_c = parts[5];
  const option_d = parts[6];
  const correct_answer = parts[7];
  
  // The last 7 fields are always URLs and topic - they don't contain commas
  // So we can safely take them from the end
  const youtube_telugu = parts[parts.length - 1];
  const youtube_tamil = parts[parts.length - 2];
  const youtube_kannada = parts[parts.length - 3];
  const youtube_hindi = parts[parts.length - 4];
  const youtube_english = parts[parts.length - 5];
  const mdn_link = parts[parts.length - 6];
  const topic = parts[parts.length - 7];
  
  // Everything in between is the explanation
  const explanationParts = parts.slice(8, parts.length - 7);
  const explanation = explanationParts.join(',');
  
  // Build the row with proper quoting for fields with commas
  const row = [
    skill,
    level,
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    explanation.includes(',') ? `"${explanation}"` : explanation,
    topic,
    mdn_link,
    youtube_english,
    youtube_hindi,
    youtube_kannada,
    youtube_tamil,
    youtube_telugu
  ];
  
  fixedLines.push(row.join(','));
  
  if (parts.length !== 16) {
    console.log(`Row ${i + 1}: Fixed ${parts.length} fields -> 16 fields`);
  }
}

// Write the fixed content
fs.writeFileSync(outputFile, fixedLines.join('\n'), 'utf-8');

console.log(`\n✅ Fixed CSV saved to: ${outputFile}`);
console.log(`Total rows: ${fixedLines.length - 1} (excluding header)`);
console.log(`\nYou can now upload this file to Supabase!`);
