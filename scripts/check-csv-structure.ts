import * as fs from 'fs';
import * as path from 'path';

const questionsDir = path.join(__dirname, '..', 'questions');
const files = fs.readdirSync(questionsDir).filter(f => f.endsWith('.csv'));

console.log('Checking CSV structure for all files...\n');
console.log('=' .repeat(80));

const wrongStructure: string[] = [];
const correctStructure: string[] = [];

for (const file of files) {
  const filePath = path.join(questionsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim());
  
  if (lines.length < 2) {
    console.log(`⚠️  ${file}: Empty or only header`);
    continue;
  }
  
  const header = lines[0];
  const firstDataLine = lines[1];
  
  // Simple check: split by comma (not perfect but good enough)
  const fields = firstDataLine.split(',');
  
  // Check if field 8 (index 7) is 'A', 'B', 'C', or 'D'
  const field8 = fields[7]?.trim();
  
  // Check if field 4-7 look like options (not topic names)
  const field4 = fields[3]?.trim();
  const field5 = fields[4]?.trim();
  const field6 = fields[5]?.trim();
  const field7 = fields[6]?.trim();
  
  // If field8 is A/B/C/D and fields 4-7 are short, it's correct
  if (['A', 'B', 'C', 'D'].includes(field8)) {
    // Check if options look like topic names (wrong structure)
    const looksLikeTopics = 
      field4.length < 30 && 
      field5.length < 30 && 
      field6.length < 30 && 
      field7.length < 30 &&
      !field4.includes('?') &&
      !field5.includes('?');
    
    if (looksLikeTopics) {
      wrongStructure.push(file);
      console.log(`❌ ${file}: WRONG STRUCTURE`);
      console.log(`   Field4: ${field4.substring(0, 40)}`);
      console.log(`   Field5: ${field5.substring(0, 40)}`);
      console.log(`   Field8 (correct_answer): ${field8}`);
    } else {
      correctStructure.push(file);
      console.log(`✅ ${file}: Correct structure`);
    }
  } else {
    correctStructure.push(file);
    console.log(`✅ ${file}: Correct structure (answer: ${field8})`);
  }
}

console.log('\n' + '='.repeat(80));
console.log(`\n📊 SUMMARY:`);
console.log(`   ✅ Correct structure: ${correctStructure.length} files`);
console.log(`   ❌ Wrong structure: ${wrongStructure.length} files`);

if (wrongStructure.length > 0) {
  console.log(`\n❌ FILES WITH WRONG STRUCTURE:`);
  wrongStructure.forEach(f => console.log(`   - ${f}`));
  console.log(`\nThese files have topic names in option fields instead of actual MCQ options.`);
}
