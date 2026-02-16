import * as fs from 'fs';
import * as path from 'path';

const questionsDir = path.join(process.cwd(), 'questions');

// Map of what level names should be based on filename
const getLevelFromFilename = (filename: string): string => {
  if (filename.includes('-beginner')) return 'Beginner';
  if (filename.includes('-intermediate')) return 'Intermediate';
  if (filename.includes('-advanced')) return 'Advanced';
  return 'Unknown';
};

// Map of skill names from filename
const getSkillFromFilename = (filename: string): string => {
  const name = filename.replace('-beginner', '').replace('-intermediate', '').replace('-advanced', '').replace('.csv', '');
  // Capitalize first letter
  return name.charAt(0).toUpperCase() + name.slice(1);
};

console.log('🔧 Fixing level values in ALL CSV files\n');
console.log('='.repeat(80));

const csvFiles = fs.readdirSync(questionsDir)
  .filter(file => file.endsWith('.csv'))
  .sort();

let fixedCount = 0;
let skippedCount = 0;

for (const file of csvFiles) {
  const filePath = path.join(questionsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  if (lines.length <= 1) {
    console.log(`⏭️  ${file} - Empty file`);
    skippedCount++;
    continue;
  }

  const expectedLevel = getLevelFromFilename(file);
  const expectedSkill = getSkillFromFilename(file);

  if (expectedLevel === 'Unknown') {
    console.log(`⚠️  ${file} - Cannot determine level from filename`);
    skippedCount++;
    continue;
  }

  // Check if first line is header
  const header = lines[0].trim();
  if (!header.startsWith('skill,level,question_text')) {
    console.log(`⚠️  ${file} - Invalid header`);
    skippedCount++;
    continue;
  }

  // Fix all data lines
  const fixedLines = [header]; // Keep header as is
  let lineFixed = false;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Skip if it's a duplicate header
    if (line.startsWith('skill,level,question_text')) {
      lineFixed = true;
      continue;
    }

    // Parse the line
    const fields: string[] = [];
    let currentField = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
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

    // Fix skill and level if needed
    if (fields.length >= 2) {
      const oldSkill = fields[0];
      const oldLevel = fields[1];

      // Remove quotes from level if present
      fields[1] = fields[1].replace(/^"(.*)"$/, '$1');

      // Fix level if it's wrong
      if (fields[1] !== expectedLevel) {
        fields[1] = expectedLevel;
        lineFixed = true;
      }

      // Fix skill capitalization if needed
      if (fields[0].toLowerCase() === expectedSkill.toLowerCase() && fields[0] !== expectedSkill) {
        fields[0] = expectedSkill;
        lineFixed = true;
      }
    }

    // Reconstruct the line
    const newLine = fields.map((field, idx) => {
      // Quote fields that contain commas
      if (field.includes(',') && !field.startsWith('"')) {
        return `"${field}"`;
      }
      return field;
    }).join(',');

    fixedLines.push(newLine);
  }

  if (lineFixed) {
    fs.writeFileSync(filePath, fixedLines.join('\n') + '\n', 'utf-8');
    console.log(`✅ ${file} - Fixed to use "${expectedLevel}"`);
    fixedCount++;
  } else {
    console.log(`✓  ${file} - Already correct`);
  }
}

console.log('\n' + '='.repeat(80));
console.log(`\n📊 SUMMARY:`);
console.log(`✅ Fixed: ${fixedCount} files`);
console.log(`✓  Already correct: ${csvFiles.length - fixedCount - skippedCount} files`);
console.log(`⏭️  Skipped: ${skippedCount} files`);
console.log(`\n✅ All CSV files now use consistent level names!`);
console.log(`\nLevel names used:`);
console.log(`   - Beginner`);
console.log(`   - Intermediate`);
console.log(`   - Advanced`);
