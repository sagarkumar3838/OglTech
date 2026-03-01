import * as fs from 'fs';
import * as path from 'path';

const csvPath = path.join(__dirname, '..', 'questions', 'java-beginner.csv');
const backupPath = csvPath + '.backup';

console.log('🔧 Fixing java-beginner.csv...\n');

// Read file
let content = fs.readFileSync(csvPath, 'utf-8');

// Backup
fs.writeFileSync(backupPath, content);
console.log('✅ Backup created\n');

// Fix: Remove line breaks within quoted fields
// This happens when a quoted field has a newline character
content = content.replace(/"\n/g, '" '); // Replace quote-newline with quote-space
content = content.replace(/\n"/g, ' "'); // Replace newline-quote with space-quote

// Ensure proper line endings
const lines = content.split('\n').filter(line => line.trim().length > 0);

// Rebuild with proper structure
const fixedLines: string[] = [];
let currentLine = '';

for (const line of lines) {
  currentLine += line;
  
  // Count quotes - if even, line is complete
  const quoteCount = (currentLine.match(/"/g) || []).length;
  
  if (quoteCount % 2 === 0) {
    fixedLines.push(currentLine);
    currentLine = '';
  } else {
    // Odd quotes means line continues
    currentLine += ' ';
  }
}

// Add any remaining line
if (currentLine.trim()) {
  fixedLines.push(currentLine);
}

// Write fixed content
fs.writeFileSync(csvPath, fixedLines.join('\n'));

console.log(`✅ Fixed! ${fixedLines.length} lines total`);
console.log('Original backed up to: java-beginner.csv.backup');
