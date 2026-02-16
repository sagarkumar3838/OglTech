import * as fs from 'fs';
import * as path from 'path';

// Fix CSV files that have header and data on same line
function fixCSVFile(filePath: string): boolean {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Check if file needs fixing (header + data on same line)
    const lines = content.split('\n');
    
    if (lines.length < 2) {
      // File might have header and data on same line
      // Split by the skill name pattern
      const headerPattern = /^skill,level,question_text,/;
      
      if (headerPattern.test(content)) {
        // Find where actual data starts (after the header columns)
        const match = content.match(/skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu(.+)/);
        
        if (match && match[1]) {
          const header = 'skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu';
          const dataRows = match[1].trim();
          
          // Split data rows by skill name patterns (Angular, Python, etc.)
          const rows = dataRows.split(/(?=[A-Z][a-z]+,(?:Basic|Intermediate|Advanced),)/);
          
          const fixedContent = header + '\n' + rows.filter(r => r.trim()).join('\n');
          
          fs.writeFileSync(filePath, fixedContent, 'utf-8');
          return true;
        }
      }
    }
    
    return false;
  } catch (error: any) {
    console.error(`Error fixing ${filePath}:`, error.message);
    return false;
  }
}

async function main() {
  const questionsDir = path.join(__dirname, '..', 'questions');
  const files = fs.readdirSync(questionsDir).filter(f => f.endsWith('.csv'));
  
  console.log(`🔧 Fixing ${files.length} CSV files...\n`);
  
  let fixed = 0;
  let skipped = 0;
  
  for (const file of files) {
    const filePath = path.join(questionsDir, file);
    const wasFixed = fixCSVFile(filePath);
    
    if (wasFixed) {
      console.log(`✅ Fixed: ${file}`);
      fixed++;
    } else {
      skipped++;
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Fixed: ${fixed} files`);
  console.log(`   Skipped: ${skipped} files (already correct)`);
  console.log(`\n✅ Done! Now run: npx ts-node upload-missing-questions.ts`);
}

main().catch(console.error);
