import * as fs from 'fs';
import * as path from 'path';

const csvPath = path.join(process.cwd(), 'questions', 'java-intermediate.csv');

// Read the file
const content = fs.readFileSync(csvPath, 'utf-8');

// Fix common issues:
// 1. Remove line breaks within quoted fields
// 2. Properly escape quotes
let fixed = content
  // Replace newlines within quoted fields with spaces
  .replace(/("(?:[^"]|"")*?)\n(?=[^"]*")/g, '$1 ')
  // Fix improperly escaped quotes
  .replace(/""/g, '""')
  // Remove any trailing spaces before closing quotes
  .replace(/ +"/g, '"')
  // Ensure proper line endings
  .replace(/\r\n/g, '\n')
  .replace(/\r/g, '\n');

// Split into lines and validate
const lines = fixed.split('\n').filter(line => line.trim());

console.log(`Original lines: ${content.split('\n').length}`);
console.log(`Fixed lines: ${lines.length}`);

// Validate each line has correct number of fields (17 fields expected)
const header = lines[0];
const headerFields = header.split('","').length;
console.log(`Header fields: ${headerFields}`);

let invalidLines: number[] = [];
for (let i = 1; i < lines.length; i++) {
  const fieldCount = lines[i].split('","').length;
  if (fieldCount !== headerFields) {
    invalidLines.push(i + 1);
    console.log(`Line ${i + 1}: ${fieldCount} fields (expected ${headerFields})`);
  }
}

if (invalidLines.length > 0) {
  console.log(`\nFound ${invalidLines.length} invalid lines`);
  console.log('Manual fix required for these lines');
} else {
  // Write fixed content
  fs.writeFileSync(csvPath, lines.join('\n') + '\n', 'utf-8');
  console.log('\n✅ CSV file fixed successfully!');
}
