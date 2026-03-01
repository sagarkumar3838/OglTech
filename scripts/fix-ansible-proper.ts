import * as fs from 'fs';
import * as path from 'path';

async function fixAnsibleProper() {
  const inputFile = path.join(process.cwd(), 'questions', 'ansible-advanced.csv');
  const outputFile = path.join(process.cwd(), 'questions', 'ansible-advanced-fixed.csv');
  
  console.log('Fixing Ansible Advanced CSV...\n');
  
  // Read file without BOM
  let content = fs.readFileSync(inputFile, 'utf-8');
  
  // Remove BOM if present
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  
  const lines = content.split(/\r?\n/);
  const expectedHeader = 'skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu';
  
  const fixedLines: string[] = [];
  fixedLines.push(expectedHeader); // Add header once
  
  let skippedHeaders = 0;
  let validQuestions = 0;
  let emptyLines = 0;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) {
      emptyLines++;
      continue;
    }
    
    // Skip duplicate header lines
    if (line.startsWith('skill,level,question_text')) {
      console.log(`Skipping duplicate header at line ${i + 1}`);
      skippedHeaders++;
      continue;
    }
    
    // Add valid question lines
    fixedLines.push(line);
    validQuestions++;
  }
  
  // Write fixed file
  fs.writeFileSync(outputFile, fixedLines.join('\n'), 'utf-8');
  
  console.log('\n=== FIX SUMMARY ===');
  console.log(`Valid questions: ${validQuestions}`);
  console.log(`Duplicate headers removed: ${skippedHeaders}`);
  console.log(`Empty lines removed: ${emptyLines}`);
  console.log(`\nFixed file: ${outputFile}`);
  console.log('\nTo replace original:');
  console.log(`  Copy-Item "${outputFile}" "${inputFile}" -Force`);
}

fixAnsibleProper().catch(console.error);
