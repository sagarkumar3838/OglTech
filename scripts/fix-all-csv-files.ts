import * as fs from 'fs';
import * as path from 'path';

const questionsDir = path.join(process.cwd(), 'questions');
const fixedDir = path.join(process.cwd(), 'questions-fixed');

// Create fixed directory if it doesn't exist
if (!fs.existsSync(fixedDir)) {
  fs.mkdirSync(fixedDir);
}

// Expected headers
const headers = [
  'skill', 'level', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d',
  'correct_answer', 'explanation', 'topic', 'mdn_link', 'youtube_english',
  'youtube_hindi', 'youtube_kannada', 'youtube_tamil', 'youtube_telugu'
];

function fixCSVFile(inputPath: string, outputPath: string): { success: boolean; rowsFixed: number; totalRows: number; errors: string[] } {
  try {
    const content = fs.readFileSync(inputPath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());

    if (lines.length === 0) {
      return { success: false, rowsFixed: 0, totalRows: 0, errors: ['Empty file'] };
    }

    const fixedLines: string[] = [];
    fixedLines.push(headers.join(','));
    
    let rowsFixed = 0;
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      try {
        // Split by comma
        const parts = line.split(',');

        if (parts.length === 16) {
          // Perfect - just add it
          fixedLines.push(line);
          continue;
        }

        if (parts.length < 16) {
          errors.push(`Row ${i + 1}: Too few fields (${parts.length})`);
          continue;
        }

        // If we have more than 16 parts, fix it
        const skill = parts[0];
        const level = parts[1];
        const question_text = parts[2];
        const option_a = parts[3];
        const option_b = parts[4];
        const option_c = parts[5];
        const option_d = parts[6];
        const correct_answer = parts[7];

        // The last 7 fields are always URLs and topic - they don't contain commas
        const youtube_telugu = parts[parts.length - 1];
        const youtube_tamil = parts[parts.length - 2];
        const youtube_kannada = parts[parts.length - 3];
        const youtube_hindi = parts[parts.length - 4];
        const youtube_english = parts[parts.length - 5];
        const mdn_link = parts[parts.length - 6];
        const topic = parts[parts.length - 7];

        // Everything in between is the explanation
        const explanationParts = parts.slice(8, parts.length - 7);
        const explanation = explanationParts.join(',');

        // Build the row with proper quoting for fields with commas
        const row = [
          skill,
          level,
          question_text,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_answer,
          explanation.includes(',') ? `"${explanation}"` : explanation,
          topic,
          mdn_link,
          youtube_english,
          youtube_hindi,
          youtube_kannada,
          youtube_tamil,
          youtube_telugu
        ];

        fixedLines.push(row.join(','));
        rowsFixed++;
      } catch (err) {
        errors.push(`Row ${i + 1}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    // Write the fixed content
    fs.writeFileSync(outputPath, fixedLines.join('\n'), 'utf-8');

    return {
      success: true,
      rowsFixed,
      totalRows: fixedLines.length - 1,
      errors
    };
  } catch (err) {
    return {
      success: false,
      rowsFixed: 0,
      totalRows: 0,
      errors: [err instanceof Error ? err.message : 'Unknown error']
    };
  }
}

// Get all CSV files
const csvFiles = fs.readdirSync(questionsDir)
  .filter(file => file.endsWith('.csv'))
  .sort();

console.log(`Found ${csvFiles.length} CSV files to process\n`);
console.log('='.repeat(80));

let totalProcessed = 0;
let totalFixed = 0;
let totalFailed = 0;

const results: Array<{ file: string; status: string; details: string }> = [];

for (const file of csvFiles) {
  const inputPath = path.join(questionsDir, file);
  const outputPath = path.join(fixedDir, file);

  process.stdout.write(`Processing ${file}... `);

  const result = fixCSVFile(inputPath, outputPath);

  if (result.success) {
    totalProcessed++;
    if (result.rowsFixed > 0) {
      totalFixed++;
      console.log(`✅ Fixed ${result.rowsFixed} rows (${result.totalRows} total)`);
      results.push({
        file,
        status: '✅ FIXED',
        details: `${result.rowsFixed} rows fixed, ${result.totalRows} total rows`
      });
    } else {
      console.log(`✓ OK (${result.totalRows} rows)`);
      results.push({
        file,
        status: '✓ OK',
        details: `${result.totalRows} rows, no fixes needed`
      });
    }

    if (result.errors.length > 0) {
      console.log(`   ⚠️  Warnings: ${result.errors.length}`);
      result.errors.forEach(err => console.log(`      - ${err}`));
    }
  } else {
    totalFailed++;
    console.log(`❌ FAILED`);
    results.push({
      file,
      status: '❌ FAILED',
      details: result.errors.join('; ')
    });
    result.errors.forEach(err => console.log(`   - ${err}`));
  }
}

console.log('\n' + '='.repeat(80));
console.log('\nSUMMARY:');
console.log(`Total files: ${csvFiles.length}`);
console.log(`Successfully processed: ${totalProcessed}`);
console.log(`Files with fixes: ${totalFixed}`);
console.log(`Failed: ${totalFailed}`);

console.log('\n' + '='.repeat(80));
console.log('\nDETAILED RESULTS:');
results.forEach(r => {
  console.log(`${r.status} ${r.file}`);
  console.log(`   ${r.details}`);
});

console.log('\n' + '='.repeat(80));
console.log(`\n✅ All fixed files saved to: ${fixedDir}`);
console.log('\nNext steps:');
console.log('1. Review the fixed files in the "questions-fixed" folder');
console.log('2. If everything looks good, run: node scripts/copy-fixed-files.js');
console.log('3. Upload the CSV files to Supabase');
