import * as fs from 'fs';
import * as path from 'path';

/**
 * Fix CSV files with malformed quotes
 * This script handles:
 * - Unescaped quotes within fields
 * - Quotes that aren't properly closed
 * - Non-trimable bytes after quotes
 */

function fixCSVQuotes(content: string): string {
  const lines = content.split('\n');
  const fixedLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Skip empty lines
    if (!line.trim()) {
      fixedLines.push(line);
      continue;
    }
    
    // Fix common quote issues:
    // 1. Replace unescaped quotes within fields with escaped quotes
    // 2. Handle quotes followed by non-comma characters
    
    let fixed = line;
    let inQuotes = false;
    let result = '';
    
    for (let j = 0; j < fixed.length; j++) {
      const char = fixed[j];
      const nextChar = fixed[j + 1];
      
      if (char === '"') {
        if (!inQuotes) {
          // Starting a quoted field
          inQuotes = true;
          result += char;
        } else {
          // Could be ending quote or escaped quote
          if (nextChar === '"') {
            // Escaped quote - keep both
            result += '""';
            j++; // Skip next quote
          } else if (nextChar === ',' || nextChar === '\r' || nextChar === '\n' || nextChar === undefined) {
            // Proper closing quote
            inQuotes = false;
            result += char;
          } else {
            // Quote followed by non-comma/non-newline - escape it
            result += '""';
          }
        }
      } else {
        result += char;
      }
    }
    
    fixedLines.push(result);
  }
  
  return fixedLines.join('\n');
}

async function fixAllCSVFiles() {
  console.log('🔧 Starting CSV quote fix...\n');
  
  const questionsDir = path.join(__dirname, '..', 'questions');
  
  if (!fs.existsSync(questionsDir)) {
    console.error('❌ Questions directory not found!');
    return;
  }
  
  // List of files that had errors
  const problematicFiles = [
    'docker-advanced.csv',
    'docker-intermediate.csv',
    'git-advanced.csv',
    'java-beginner.csv',
    'java-intermediate.csv',
    'kubernetes-advanced.csv',
    'nodejs-advanced.csv',
    'oracle-advanced.csv',
    'oracle-intermediate.csv',
    'redis-intermediate.csv',
    'selenium-intermediate.csv',
    'terraform-advanced.csv',
    'terraform-intermediate.csv',
    'unity-intermediate.csv',
    'unreal-advanced.csv',
    'unreal-intermediate.csv',
  ];
  
  let fixedCount = 0;
  
  for (const file of problematicFiles) {
    const filePath = path.join(questionsDir, file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⏭️  Skipping ${file} (not found)`);
      continue;
    }
    
    try {
      console.log(`📄 Fixing: ${file}`);
      
      // Read original content
      const originalContent = fs.readFileSync(filePath, 'utf-8');
      
      // Create backup
      const backupPath = filePath + '.backup';
      fs.writeFileSync(backupPath, originalContent);
      console.log(`  💾 Backup created: ${file}.backup`);
      
      // Fix quotes
      const fixedContent = fixCSVQuotes(originalContent);
      
      // Write fixed content
      fs.writeFileSync(filePath, fixedContent);
      console.log(`  ✅ Fixed: ${file}\n`);
      
      fixedCount++;
    } catch (error) {
      console.error(`  ❌ Error fixing ${file}:`, error);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 FIX SUMMARY');
  console.log('='.repeat(60));
  console.log(`Files fixed: ${fixedCount}/${problematicFiles.length}`);
  console.log('\n✅ CSV fix complete!');
  console.log('\n💡 Next step: Run UPLOAD_ALL.bat to upload the fixed files');
}

// Run the fix
fixAllCSVFiles().catch(console.error);
