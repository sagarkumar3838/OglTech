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

function countValidQuestions(filePath: string): number {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());

  if (lines.length <= 1) return 0;

  const headerLine = lines[0];
  let count = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip duplicate headers
    if (line === headerLine || line.startsWith('skill,level,question_text')) {
      continue;
    }

    const fields = parseCSVLine(line);
    
    // Count only if exactly 16 fields and essential fields are not empty
    if (fields.length === 16 && fields[0] && fields[2] && fields[7]) {
      count++;
    }
  }

  return count;
}

console.log('📊 Preview: What Will Be Uploaded\n');
console.log('='.repeat(80));

const csvFiles = fs.readdirSync(questionsDir)
  .filter(file => file.endsWith('.csv'))
  .sort();

const filesToUpload: Array<{ file: string; count: number }> = [];
const filesToSkip: string[] = [];
let totalQuestions = 0;

for (const file of csvFiles) {
  const filePath = path.join(questionsDir, file);
  const count = countValidQuestions(filePath);

  if (count > 0) {
    filesToUpload.push({ file, count });
    totalQuestions += count;
  } else {
    filesToSkip.push(file);
  }
}

console.log('\n✅ FILES TO UPLOAD (' + filesToUpload.length + ' files):\n');
filesToUpload.forEach(({ file, count }) => {
  console.log(`   ${file.padEnd(40)} ${count.toString().padStart(4)} questions`);
});

console.log('\n⏭️  FILES TO SKIP (' + filesToSkip.length + ' files - no valid data):\n');
filesToSkip.forEach(file => {
  console.log(`   ${file}`);
});

console.log('\n' + '='.repeat(80));
console.log('\n📊 SUMMARY:');
console.log(`Total CSV files: ${csvFiles.length}`);
console.log(`Files with data: ${filesToUpload.length}`);
console.log(`Files to skip: ${filesToSkip.length}`);
console.log(`Total questions to upload: ${totalQuestions}`);

console.log('\n✅ Ready to upload!');
console.log('\nTo upload, run:');
console.log('   UPLOAD_VALID_QUESTIONS.bat');
console.log('   or');
console.log('   npx tsx scripts/upload-valid-questions-only.ts');
