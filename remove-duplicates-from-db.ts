import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ksjgsgebjnpwyycnptom.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzamdzZ2Viam5wd3l5Y25wdG9tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTAzMzk0MSwiZXhwIjoyMDg0NjA5OTQxfQ.9Y2JuAmAXSU7vXZB-UaLQkCw5iddITkJcVTRi6bTfd0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function removeDuplicates() {
  console.log('🧹 Removing Duplicate Questions from Database...\n');

  const skills = ['html', 'css', 'javascript', 'ogl', 'jquery'];
  const levels = ['easy', 'medium', 'hard'];

  let totalRemoved = 0;

  for (const skill of skills) {
    for (const level of levels) {
      console.log(`\n📊 Processing ${skill.toUpperCase()} - ${level.toUpperCase()}...`);

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

      // Group by question text
      const questionMap = new Map<string, any[]>();
      
      for (const q of questions) {
        const normalizedQuestion = q.question.trim().toLowerCase();
        if (!questionMap.has(normalizedQuestion)) {
          questionMap.set(normalizedQuestion, []);
        }
        questionMap.get(normalizedQuestion)!.push(q);
      }

      // Find and remove duplicates (keep first, delete rest)
      let removedInLevel = 0;
      for (const [question, items] of questionMap.entries()) {
        if (items.length > 1) {
          // Keep the first one, delete the rest
          const idsToDelete = items.slice(1).map(i => i.id);
          
          console.log(`  🗑️  Removing ${idsToDelete.length} duplicate(s) of: "${question.substring(0, 50)}..."`);
          
          const { error: deleteError } = await supabase
            .from('questions')
            .delete()
            .in('id', idsToDelete);

          if (deleteError) {
            console.error(`     ❌ Error deleting duplicates:`, deleteError.message);
          } else {
            removedInLevel += idsToDelete.length;
            totalRemoved += idsToDelete.length;
          }
        }
      }

      if (removedInLevel > 0) {
        console.log(`  ✅ Removed ${removedInLevel} duplicate(s)`);
      } else {
        console.log(`  ✅ No duplicates found`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Cleanup Complete!`);
  console.log(`   Total duplicates removed: ${totalRemoved}`);
  console.log('='.repeat(60));
}

removeDuplicates();
