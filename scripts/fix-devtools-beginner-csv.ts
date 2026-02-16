import * as fs from 'fs';
import * as path from 'path';

const inputFile = path.join(process.cwd(), 'questions', 'devtools-beginner.csv');
const outputFile = path.join(process.cwd(), 'questions', 'devtools-beginner-fixed.csv');

// Read the file
const content = fs.readFileSync(inputFile, 'utf-8');
const lines = content.split('\n');

// Process each line
const fixedLines: string[] = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  if (!line) continue; // Skip empty lines
  
  if (i === 0) {
    // Header line - keep as is
    fixedLines.push(line);
    continue;
  }
  
  // Split by comma, but be careful with URLs
  const fields: string[] = [];
  let currentField = '';
  let inQuotes = false;
  
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    
    if (char === '"') {
      inQuotes = !inQuotes;
      currentField += char;
    } else if (char === ',' && !inQuotes) {
      fields.push(currentField);
      currentField = '';
    } else {
      currentField += char;
    }
  }
  
  // Add the last field
  if (currentField) {
    fields.push(currentField);
  }
  
  // Expected: 16 fields
  // skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu
  
  if (fields.length !== 16) {
    console.log(`Row ${i + 1}: Found ${fields.length} fields (expected 16)`);
    
    // If we have more than 16 fields, try to merge the extra ones into the last field
    if (fields.length > 16) {
      const extraFields = fields.slice(16);
      fields[15] = fields[15] + ',' + extraFields.join(',');
      fields.splice(16);
    }
  }
  
  // Ensure all fields are properly escaped if they contain commas
  const escapedFields = fields.map(field => {
    field = field.trim();
    // Remove existing quotes
    if (field.startsWith('"') && field.endsWith('"')) {
      field = field.slice(1, -1);
    }
    // Add quotes if field contains comma
    if (field.includes(',')) {
      return `"${field}"`;
    }
    return field;
  });
  
  fixedLines.push(escapedFields.join(','));
}

// Write the fixed content
fs.writeFileSync(outputFile, fixedLines.join('\n'), 'utf-8');

console.log(`✅ Fixed CSV saved to: ${outputFile}`);
console.log(`Total rows: ${fixedLines.length - 1} (excluding header)`);
