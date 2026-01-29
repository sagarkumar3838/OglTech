import * as fs from 'fs';
import * as Papa from 'papaparse';

interface CSVRow {
  skill: string;
  level: string;
  type: string;
  question: string;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  correct_answer: string;
  explanation: string;
}

/**
 * Remove duplicate questions from CSV file
 * Keeps the first occurrence of each unique question
 * 
 * Usage:
 * npx tsx scripts/remove-duplicate-questions.ts <input-file.csv> [output-file.csv]
 */
async function removeDuplicates(inputFile: string, outputFile?: string) {
  console.log('🔍 Removing duplicate questions from CSV\n');
  console.log(`Reading file: ${inputFile}\n`);

  try {
    // Read CSV file
    const fileContent = fs.readFileSync(inputFile, 'utf-8');
    
    // Parse CSV
    const parseResult = Papa.parse<CSVRow>(fileContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, '_')
    });

    const rows = parseResult.data;
    console.log(`📊 Total questions in file: ${rows.length}\n`);

    // Track unique questions
    const seen = new Set<string>();
    const uniqueRows: CSVRow[] = [];
    let duplicateCount = 0;

    // Process each row
    rows.forEach((row, index) => {
      // Create a unique key based on question text (case-insensitive, trimmed)
      const questionKey = row.question.trim().toLowerCase();
      
      if (!seen.has(questionKey)) {
        // First occurrence - keep it
        seen.add(questionKey);
        uniqueRows.push(row);
      } else {
        // Duplicate - skip it
        duplicateCount++;
        console.log(`  ❌ Duplicate #${duplicateCount}: "${row.question.substring(0, 60)}..."`);
      }
    });

    console.log('\n' + '='.repeat(60));
    console.log(`📊 Results:`);
    console.log(`   Original questions: ${rows.length}`);
    console.log(`   Unique questions: ${uniqueRows.length}`);
    console.log(`   Duplicates removed: ${duplicateCount}`);
    console.log('='.repeat(60) + '\n');

    // Determine output file
    const output = outputFile || inputFile.replace('.csv', '_unique.csv');

    // Convert back to CSV
    const csv = Papa.unparse(uniqueRows, {
      header: true,
      columns: ['skill', 'level', 'type', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer', 'explanation']
    });

    // Write to file
    fs.writeFileSync(output, csv, 'utf-8');

    console.log(`✅ Unique questions saved to: ${output}\n`);

    // Show sample of unique questions
    console.log('📝 Sample of unique questions:');
    uniqueRows.slice(0, 5).forEach((row, idx) => {
      console.log(`   ${idx + 1}. ${row.question.substring(0, 70)}...`);
    });

    console.log('\n✨ Done! You can now upload the unique questions file.\n');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Get file path from command line argument
const inputFile = process.argv[2];
const outputFile = process.argv[3];

if (!inputFile) {
  console.error('❌ Please provide an input CSV file path');
  console.log('\nUsage:');
  console.log('  npx tsx scripts/remove-duplicate-questions.ts <input-file.csv> [output-file.csv]');
  console.log('\nExamples:');
  console.log('  npx tsx scripts/remove-duplicate-questions.ts client/dist/assets/html_easy_questions.csv');
  console.log('  npx tsx scripts/remove-duplicate-questions.ts input.csv output_unique.csv');
  process.exit(1);
}

if (!fs.existsSync(inputFile)) {
  console.error(`❌ File not found: ${inputFile}`);
  process.exit(1);
}

removeDuplicates(inputFile, outputFile);
