import * as fs from 'fs';
import * as path from 'path';

const questionsDir = path.join(process.cwd(), 'questions');

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(currentField.trim());
      currentField = '';
    } else {
      currentField += char;
    }
  }
  fields.push(currentField.trim());
  return fields;
}

console.log('🔍 DIAGNOSING UPLOAD ISSUE\n');
console.log('='.repeat(80));

// Check devtools-beginner.csv specifically
const devtoolsFile = path.join(questionsDir, 'devtools-beginner.csv');
const content = fs.readFileSync(devtoolsFile, 'utf-8');
const lines = content.split('\n').filter(line => line.trim());

console.log('\n📄 devtools-beginner.csv Analysis:\n');
console.log(`Total lines: ${lines.length}`);
console.log(`Header: ${lines[0].substring(0, 80)}...`);

if (lines.length > 1) {
  console.log('\n🔍 First 3 data lines:\n');
  
  for (let i = 1; i <= Math.min(3, lines.length - 1); i++) {
    const line = lines[i];
    const fields = parseCSVLine(line);
    
    console.log(`Line ${i + 1}:`);
    console.log(`  Raw: ${line.substring(0, 100)}...`);
    console.log(`  Field count: ${fields.length}`);
    console.log(`  Skill: "${fields[0]}"`);
    console.log(`  Level: "${fields[1]}"`);
    console.log(`  Question: "${fields[2]?.substring(0, 50)}..."`);
    console.log(`  Correct Answer: "${fields[7]}"`);
    
    // Check if essential fields are empty
    const hasSkill = fields[0] && fields[0].trim().length > 0;
    const hasQuestion = fields[2] && fields[2].trim().length > 0;
    const hasAnswer = fields[7] && fields[7].trim().length > 0;
    
    console.log(`  ✓ Has skill: ${hasSkill}`);
    console.log(`  ✓ Has question: ${hasQuestion}`);
    console.log(`  ✓ Has answer: ${hasAnswer}`);
    console.log(`  ✓ Valid: ${fields.length === 16 && hasSkill && hasQuestion && hasAnswer}`);
    console.log('');
  }
}

// Count valid questions
let validCount = 0;
let invalidCount = 0;
const issues: string[] = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  
  // Skip duplicate headers
  if (line.startsWith('skill,level,question_text')) {
    issues.push(`Line ${i + 1}: Duplicate header`);
    invalidCount++;
    continue;
  }
  
  const fields = parseCSVLine(line);
  
  if (fields.length !== 16) {
    issues.push(`Line ${i + 1}: ${fields.length} fields (expected 16)`);
    invalidCount++;
    continue;
  }
  
  if (!fields[0] || !fields[2] || !fields[7]) {
    issues.push(`Line ${i + 1}: Missing essential fields`);
    invalidCount++;
    continue;
  }
  
  validCount++;
}

console.log('='.repeat(80));
console.log('\n📊 SUMMARY:\n');
console.log(`✅ Valid questions: ${validCount}`);
console.log(`❌ Invalid questions: ${invalidCount}`);

if (issues.length > 0) {
  console.log(`\n⚠️  Issues found (first 10):\n`);
  issues.slice(0, 10).forEach(issue => console.log(`   ${issue}`));
}

console.log('\n' + '='.repeat(80));
console.log('\n💡 DIAGNOSIS:\n');

if (validCount === 0) {
  console.log('❌ NO VALID QUESTIONS FOUND!');
  console.log('   This is why upload skipped the file.');
  console.log('   Check the CSV format and field count.');
} else if (invalidCount > 0) {
  console.log(`⚠️  ${invalidCount} invalid lines will be skipped during upload.`);
  console.log(`   ${validCount} valid questions should upload.`);
} else {
  console.log(`✅ All ${validCount} questions are valid!`);
  console.log('   If upload failed, check:');
  console.log('   1. RLS is disabled in Supabase');
  console.log('   2. Supabase credentials in .env are correct');
  console.log('   3. Network connection is working');
}
