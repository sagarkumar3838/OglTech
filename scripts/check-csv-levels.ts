import * as fs from 'fs';
import * as path from 'path';

const questionsDir = path.join(process.cwd(), 'questions');

console.log('🔍 Checking level values in CSV files\n');
console.log('='.repeat(80));

const csvFiles = fs.readdirSync(questionsDir)
  .filter(file => file.endsWith('.csv'))
  .sort();

const levelCounts: Record<string, number> = {};

for (const file of csvFiles) {
  const filePath = path.join(questionsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());

  if (lines.length <= 1) continue;

  // Check first data line
  const firstDataLine = lines[1];
  const fields = firstDataLine.split(',');
  
  if (fields.length >= 2) {
    const level = fields[1].trim();
    levelCounts[level] = (levelCounts[level] || 0) + 1;
  }
}

console.log('\n📊 Level values found in CSV files:\n');
Object.entries(levelCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([level, count]) => {
    console.log(`   ${level.padEnd(20)} ${count} files`);
  });

console.log('\n' + '='.repeat(80));
console.log('\n💡 Your CSV files use these level names.');
console.log('Make sure your Supabase table expects the same names!');
console.log('\nTo check your database, run this SQL:');
console.log('SELECT DISTINCT level FROM practice_questions;');
