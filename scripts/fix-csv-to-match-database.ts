import * as fs from 'fs';
import * as path from 'path';

const questionsDir = path.join(process.cwd(), 'questions');

// Map filename level to database level
const getLevelFromFilename = (filename: string): string => {
  if (filename.includes('-beginner')) return 'Basic';  // Use "Basic" not "Beginner"
  if (filename.includes('-intermediate')) return 'Intermediate';
  if (filename.includes('-advanced')) return 'Advanced';
  return 'Unknown';
};

const getSkillFromFilename = (filename: string): string => {
  const name = filename
    .replace('-beginner', '')
    .replace('-intermediate', '')
    .replace('-advanced', '')
    .replace('.csv', '');
  return name.charAt(0).toUpperCase() + name.slice(1);
};

console.log('🔧 Fixing CSV files to match database constraint\n');
console.log('Database accepts: Basic, Intermediate, Advanced');
console.log('='.repeat(80));

const csvFiles = fs.readdirSync(questionsDir)
  .filter(file => file.endsWith('.csv'))
  .sort();

let fixedCount = 0;

for (const file of csvFiles) {
  const filePath = path.join(questionsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  if (lines.length <= 1) {
    continue;
  }

  const expectedLevel = getLevelFromFilename(file);
  const expectedSkill = getSkillFromFilename(file);

  if (expectedLevel === 'Unknown') {
    continue;
  }

  const header = lines[0].trim();
  if (!header.startsWith('skill,level,question_text')) {
    continue;
  }

  const fixedLines = [header];
  let lineFixed = false;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith('skill,level,question_text')) {
      lineFixed = true;
      continue;
    }

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

    if (fields.length >= 2) {
      fields[1] = fields[1].replace(/^"(.*)"$/, '$1');

      if (fields[1] !== expectedLevel) {
        fields[1] = expectedLevel;
        lineFixed = true;
      }

      if (fields[0].toLowerCase() === expectedSkill.toLowerCase() && fields[0] !== expectedSkill) {
        fields[0] = expectedSkill;
        lineFixed = true;
      }
    }

    const newLine = fields.map((field, idx) => {
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
  }
}

console.log('\n' + '='.repeat(80));
console.log(`\n✅ Fixed ${fixedCount} files`);
console.log('\nLevel names now used:');
console.log('   - Basic (for -beginner.csv files)');
console.log('   - Intermediate (for -intermediate.csv files)');
console.log('   - Advanced (for -advanced.csv files)');
console.log('\n✅ Ready to upload!');
