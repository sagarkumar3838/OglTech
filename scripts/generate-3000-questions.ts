import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ksjgsgebjnpwyycnptom.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzamdzZ2Viam5wd3l5Y25wdG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMzM5NDEsImV4cCI6MjA4NDYwOTk0MX0.R4w_7BJ7AgzegkpCaJZji154NFlmzjjnOs3VkH4eYjU';

const supabase = createClient(supabaseUrl, supabaseKey);

const skills = ['html', 'css', 'javascript', 'jquery', 'devtools'];
const levels = ['easy', 'medium', 'hard', 'advanced'];

// 3000 questions = 5 skills × 4 levels × 150 questions each
const questionsPerSkillLevel = 150;

async function generate3000Questions() {
  console.log('🚀 Generating 3000 questions...\n');
  
  let totalGenerated = 0;
  const batchSize = 50; // Insert 50 at a time

  for (const skill of skills) {
    for (const level of levels) {
      console.log(`\n📚 Generating ${skill} - ${level}...`);
      
      const questions: any[] = [];
      
      for (let i = 1; i <= questionsPerSkillLevel; i++) {
        questions.push({
          question_id: `${skill}-${level}-${Date.now()}-${i}`,
          skill: skill,
          level: level,
          type: 'mcq',
          question: `${skill.toUpperCase()} ${level} Question ${i}: What is the correct answer?`,
          options: JSON.stringify([
            `Option A for ${skill} ${level}`,
            `Option B for ${skill} ${level}`,
            `Option C for ${skill} ${level}`,
            `Option D for ${skill} ${level}`
          ]),
          correct_answer: JSON.stringify(`Option A for ${skill} ${level}`),
          explanation: `This is the explanation for ${skill} ${level} question ${i}.`,
          verified: true,
          usage_count: 0
        });
      }

      // Insert in batches
      for (let j = 0; j < questions.length; j += batchSize) {
        const batch = questions.slice(j, j + batchSize);
        
        const { error } = await supabase
          .from('questions')
          .insert(batch);

        if (error) {
          console.error(`  ❌ Error inserting batch: ${error.message}`);
        } else {
          totalGenerated += batch.length;
          console.log(`  ✅ Inserted ${batch.length} questions (Total: ${totalGenerated})`);
        }

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Generation Complete!`);
  console.log(`   Total generated: ${totalGenerated} questions`);
  console.log('='.repeat(50));
}

generate3000Questions().catch(console.error);
