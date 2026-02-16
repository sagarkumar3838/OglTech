import * as fs from 'fs';
import * as path from 'path';

const questionsDir = path.join(process.cwd(), 'questions');

// Sample files to verify
const sampleFiles = [
  'devtools-beginner.csv',
  'react-intermediate.csv',
  'python-advanced.csv',
  'docker-beginner.csv',
  'kubernetes-intermediate.csv'
];

console.log('Verifying CSV Format for Sample Files\n');
console.log('='.repeat(80));

for (const file of sampleFiles) {
  const filePath = path.join(questionsDir, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`\n❌ ${file} - NOT FOUND`);
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());

  console.log(`\n📄 ${file}`);
  console.log('-'.repeat(80));

  // Check header
  const header = lines[0];
  const headerFields = header.split(',');
  console.log(`   Header fields: ${headerFields.length}`);

  if (headerFields.length === 16) {
    console.log(`   ✅ Header is correct (16 fields)`);
  } else {
    console.log(`   ❌ Header has ${headerFields.length} fields (expected 16)`);
  }

  // Check first 5 data rows
  let correctRows = 0;
  let incorrectRows = 0;

  for (let i = 1; i < Math.min(6, lines.length); i++) {
    const line = lines[i];
    
    // Count fields (accounting for quoted commas)
    let fieldCount = 0;
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      if (line[j] === '"') {
        inQuotes = !inQuotes;
      } else if (line[j] === ',' && !inQuotes) {
        fieldCount++;
      }
    }
    fieldCount++; // Add 1 for the last field

    if (fieldCount === 16) {
      correctRows++;
    } else {
      incorrectRows++;
      console.log(`   ⚠️  Row ${i + 1}: ${fieldCount} fields`);
    }
  }

  console.log(`   Total rows: ${lines.length - 1}`);
  console.log(`   Sample checked: ${correctRows + incorrectRows} rows`);
  console.log(`   ✅ Correct: ${correctRows}`);
  if (incorrectRows > 0) {
    console.log(`   ❌ Incorrect: ${incorrectRows}`);
  }

  // Show a sample row
  if (lines.length > 1) {
    const sampleRow = lines[1];
    const fields = [];
    let currentField = '';
    let inQuotes = false;

    for (let j = 0; j < sampleRow.length; j++) {
      const char = sampleRow[j];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(currentField);
        currentField = '';
      } else {
        currentField += char;
      }
    }
    fields.push(currentField);

    console.log(`\n   Sample row (first 3 fields):`);
    console.log(`   - Skill: ${fields[0]}`);
    console.log(`   - Level: ${fields[1]}`);
    console.log(`   - Question: ${fields[2].substring(0, 60)}...`);
  }
}

console.log('\n' + '='.repeat(80));
console.log('\n✅ Verification complete!');
console.log('\nIf all files show "✅ Header is correct (16 fields)", you\'re ready to upload!');
