import * as fs from 'fs';
import * as path from 'path';

async function fixAnsibleCSV() {
  const inputFile = path.join(process.cwd(), 'questions', 'ansible-advanced.csv');
  const outputFile = path.join(process.cwd(), 'questions', 'ansible-advanced-fixed.csv');
  const backupFile = path.join(process.cwd(), 'questions', 'ansible-advanced.csv.backup');
  
  console.log('Reading ansible-advanced.csv...');
  
  // Read file as buffer to detect BOM
  const buffer = fs.readFileSync(inputFile);
  
  // Check for UTF-8 BOM (EF BB BF)
  let content: string;
  if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
    console.log('✗ UTF-8 BOM detected! This causes CSV parsing failures.');
    // Remove BOM by reading from byte 3 onwards
    content = buffer.toString('utf-8', 3);
  } else {
    console.log('✓ No BOM detected');
    content = buffer.toString('utf-8');
  }
  
  const lines = content.split(/\r?\n/);
  console.log(`Total lines: ${lines.length}`);
  
  // Validate header
  const header = lines[0].trim();
  const expectedHeader = 'skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu';
  
  if (header !== expectedHeader) {
    console.log('✗ Header mismatch!');
    console.log('Expected:', expectedHeader);
    console.log('Got:', header);
  } else {
    console.log('✓ Header is correct');
  }
  
  // Count valid questions
  let validQuestions = 0;
  let emptyLines = 0;
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      emptyLines++;
      continue;
    }
    validQuestions++;
  }
  
  console.log(`\nValid questions: ${validQuestions}`);
  console.log(`Empty lines: ${emptyLines}`);
  
  // Create backup
  console.log('\nCreating backup...');
  fs.copyFileSync(inputFile, backupFile);
  
  // Write fixed file WITHOUT BOM
  console.log('Writing fixed CSV without BOM...');
  fs.writeFileSync(outputFile, content, { encoding: 'utf-8' });
  
  // Verify the fixed file has no BOM
  const fixedBuffer = fs.readFileSync(outputFile);
  const hasBOM = fixedBuffer[0] === 0xEF && fixedBuffer[1] === 0xBB && fixedBuffer[2] === 0xBF;
  
  console.log('\n=== FIX SUMMARY ===');
  console.log(`Original file: ${inputFile}`);
  console.log(`BOM removed: ${!hasBOM ? 'YES ✓' : 'NO ✗'}`);
  console.log(`Valid questions: ${validQuestions}`);
  console.log(`Backup saved to: ${backupFile}`);
  console.log(`Fixed file saved to: ${outputFile}`);
  
  if (!hasBOM) {
    console.log('\n✓ SUCCESS: File is now ready for upload!');
    console.log('\nTo replace original file, run:');
    console.log(`  Copy-Item "${outputFile}" "${inputFile}" -Force`);
  } else {
    console.log('\n✗ WARNING: BOM still present in fixed file');
  }
}

fixAnsibleCSV().catch(console.error);
