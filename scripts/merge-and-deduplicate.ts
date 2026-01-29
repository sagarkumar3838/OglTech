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
 * Merge new questions into existing file and remove duplicates
 * Keeps only unique questions based on question text
 * 
 * Usage:
 * npx tsx scripts/merge-and-deduplicate.ts <master-file.csv> <new-questions.csv>
 * 
 * Example:
 * npx tsx scripts/merge-and-deduplicate.ts html_easy_questions_unique.csv new_batch_500.csv
 */
async function mergeAndDeduplicate(masterFile: string, newFile: string) {
  console.log('🔄 Merging and Deduplicating Questions\n');
  console.log('='.repeat(60));

  try {
    // Read master file
    console.log(`\n📖 Reading master file: ${masterFile}`);
    const masterContent = fs.readFileSync(masterFile, 'utf-8');
    const masterParse = Papa.parse<CSVRow>(masterContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, '_')
    });
    const masterRows = masterParse.data;
    console.log(`   Found ${masterRows.length} existing questions`);

    // Read new file
    console.log(`\n📖 Reading new file: ${newFile}`);
    const newContent = fs.readFileSync(newFile, 'utf-8');
    const newParse = Papa.parse<CSVRow>(newContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, '_')
    });
    const newRows = newParse.data;
    console.log(`   Found ${newRows.length} new questions`);

    // Track unique questions
    const seen = new Set<string>();
    const uniqueRows: CSVRow[] = [];
    
    // First, add all existing questions
    console.log('\n🔍 Processing existing questions...');
    masterRows.forEach((row) => {
      const questionKey = row.question.trim().toLowerCase();
      if (!seen.has(questionKey)) {
        seen.add(questionKey);
        uniqueRows.push(row);
      }
    });
    console.log(`   Kept ${uniqueRows.length} unique questions from master file`);

    // Then, add new questions (only if not duplicate)
    console.log('\n🔍 Processing new questions...');
    let addedCount = 0;
    let duplicateCount = 0;

    newRows.forEach((row, index) => {
      const questionKey = row.question.trim().toLowerCase();
      
      if (!seen.has(questionKey)) {
        seen.add(questionKey);
        uniqueRows.push(row);
        addedCount++;
        console.log(`  ✅ Added #${addedCount}: "${row.question.substring(0, 60)}..."`);
      } else {
        duplicateCount++;
        console.log(`  ❌ Duplicate #${duplicateCount}: "${row.question.substring(0, 60)}..."`);
      }
    });

    // Statistics
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESULTS:');
    console.log('='.repeat(60));
    console.log(`   Master file questions: ${masterRows.length}`);
    console.log(`   New questions provided: ${newRows.length}`);
    console.log(`   New questions added: ${addedCount}`);
    console.log(`   Duplicates rejected: ${duplicateCount}`);
    console.log(`   Total unique questions: ${uniqueRows.length}`);
    console.log('='.repeat(60));

    // Create backup of master file
    const backupFile = masterFile.replace('.csv', `_backup_${Date.now()}.csv`);
    fs.copyFileSync(masterFile, backupFile);
    console.log(`\n💾 Backup created: ${backupFile}`);

    // Convert back to CSV
    const csv = Papa.unparse(uniqueRows, {
      header: true,
      columns: ['skill', 'level', 'type', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer', 'explanation']
    });

    // Write to master file
    fs.writeFileSync(masterFile, csv, 'utf-8');
    console.log(`\n✅ Updated master file: ${masterFile}`);
    console.log(`   Total questions now: ${uniqueRows.length}`);

    // Show sample of newly added questions
    if (addedCount > 0) {
      console.log('\n📝 Sample of newly added questions:');
      const newlyAdded = uniqueRows.slice(masterRows.length, masterRows.length + Math.min(5, addedCount));
      newlyAdded.forEach((row, idx) => {
        console.log(`   ${idx + 1}. ${row.question.substring(0, 70)}...`);
      });
    }

    console.log('\n✨ Done! Your master file has been updated with unique questions.\n');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Get file paths from command line arguments
const masterFile = process.argv[2];
const newFile = process.argv[3];

if (!masterFile || !newFile) {
  console.error('❌ Please provide both master file and new questions file');
  console.log('\nUsage:');
  console.log('  npx tsx scripts/merge-and-deduplicate.ts <master-file.csv> <new-questions.csv>');
  console.log('\nExample:');
  console.log('  npx tsx scripts/merge-and-deduplicate.ts client/dist/assets/html_easy_questions_unique.csv new_batch_500.csv');
  console.log('\nWorkflow:');
  console.log('  1. Copy 500 questions from DeepSeek');
  console.log('  2. Paste into a new CSV file (e.g., new_batch_500.csv)');
  console.log('  3. Run this script to merge and remove duplicates');
  console.log('  4. Your master file will be updated with only unique questions');
  console.log('\nNote: A backup of your master file will be created automatically');
  process.exit(1);
}

if (!fs.existsSync(masterFile)) {
  console.error(`❌ Master file not found: ${masterFile}`);
  process.exit(1);
}

if (!fs.existsSync(newFile)) {
  console.error(`❌ New questions file not found: ${newFile}`);
  process.exit(1);
}

mergeAndDeduplicate(masterFile, newFile);
