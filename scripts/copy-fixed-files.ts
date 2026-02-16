import * as fs from 'fs';
import * as path from 'path';

const fixedDir = path.join(process.cwd(), 'questions-fixed');
const questionsDir = path.join(process.cwd(), 'questions');

// Get all CSV files from fixed directory
const csvFiles = fs.readdirSync(fixedDir)
  .filter(file => file.endsWith('.csv'))
  .sort();

console.log(`Copying ${csvFiles.length} fixed CSV files back to questions folder...\n`);

let copied = 0;
let skipped = 0;

for (const file of csvFiles) {
  // Skip the duplicate devtools-beginner-fixed.csv
  if (file === 'devtools-beginner-fixed.csv') {
    skipped++;
    continue;
  }

  const sourcePath = path.join(fixedDir, file);
  const destPath = path.join(questionsDir, file);

  try {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ Copied: ${file}`);
    copied++;
  } catch (err) {
    console.log(`❌ Failed to copy ${file}: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}

console.log(`\n${'='.repeat(80)}`);
console.log(`\nSummary:`);
console.log(`✅ Copied: ${copied} files`);
console.log(`⏭️  Skipped: ${skipped} files`);
console.log(`\n✅ All fixed CSV files are now in the questions folder!`);
console.log(`\nYou can now upload them to Supabase.`);
