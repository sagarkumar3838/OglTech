import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ksjgsgebjnpwyycnptom.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzamdzZ2Viam5wd3l5Y25wdG9tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTAzMzk0MSwiZXhwIjoyMDg0NjA5OTQxfQ.9Y2JuAmAXSU7vXZB-UaLQkCw5iddITkJcVTRi6bTfd0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDuplicates() {
  console.log('🔍 Checking for Duplicate Questions in Database...\n');

  const skills = ['html', 'css', 'javascript', 'ogl', 'jquery'];
  const levels = ['easy', 'medium', 'hard'];

  let totalDuplicates = 0;
  let duplicateDetails: any[] = [];

  for (const skill of skills) {
    for (const level of levels) {
      console.log(`\n📊 Checking ${skill.toUpperCase()} - ${level.toUpperCase()}...`);

      // Fetch all questions for this skill/level
      const { data: questions, error } = await supabase
        .from('questions')
        .select('id, question, skill, level')
        .eq('skill', skill)
        .eq('level', level);

      if (error) {
        console.error(`  ❌ Error fetching ${skill} ${level}:`, error.message);
        continue;
      }

      if (!questions || questions.length === 0) {
        console.log(`  ℹ️  No questions found`);
        continue;
      }

      // Check for duplicates by question text
      const questionMap = new Map<string, any[]>();
      
      for (const q of questions) {
        const normalizedQuestion = q.question.trim().toLowerCase();
        if (!questionMap.has(normalizedQuestion)) {
          questionMap.set(normalizedQuestion, []);
        }
        questionMap.get(normalizedQuestion)!.push(q);
      }

      // Find duplicates
      const duplicates = Array.from(questionMap.entries())
        .filter(([_, items]) => items.length > 1);

      if (duplicates.length > 0) {
        console.log(`  ⚠️  Found ${duplicates.length} duplicate question(s)`);
        totalDuplicates += duplicates.length;

        for (const [question, items] of duplicates) {
          console.log(`     - "${question.substring(0, 60)}..." (${items.length} copies)`);
          duplicateDetails.push({
            skill,
            level,
            question: question.substring(0, 100),
            count: items.length,
            ids: items.map(i => i.id)
          });
        }
      } else {
        console.log(`  ✅ No duplicates found (${questions.length} unique questions)`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  if (totalDuplicates > 0) {
    console.log(`⚠️  TOTAL DUPLICATE QUESTIONS: ${totalDuplicates}`);
    console.log('='.repeat(60));
    
    console.log('\n📋 Duplicate Details:');
    for (const dup of duplicateDetails) {
      console.log(`\n${dup.skill.toUpperCase()} - ${dup.level.toUpperCase()}`);
      console.log(`Question: "${dup.question}..."`);
      console.log(`Copies: ${dup.count}`);
      console.log(`IDs: ${dup.ids.join(', ')}`);
    }

    console.log('\n💡 To remove duplicates, you can run:');
    console.log('   npx tsx remove-duplicates-from-db.ts');
  } else {
    console.log('✅ NO DUPLICATES FOUND - Database is clean!');
    console.log('='.repeat(60));
  }
}

checkDuplicates();
