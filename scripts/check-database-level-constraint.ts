import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 CHECKING DATABASE LEVEL CONSTRAINT\n');
console.log('='.repeat(80));

async function checkConstraint() {
  // Check existing level values
  console.log('\n1️⃣ Existing level values in database:\n');
  
  const { data: levels, error: levelsError } = await supabase
    .from('practice_questions')
    .select('level')
    .limit(1000);

  if (levelsError) {
    console.log(`   Error: ${levelsError.message}`);
  } else if (levels && levels.length > 0) {
    const uniqueLevels = [...new Set(levels.map(q => q.level))];
    console.log(`   Found ${uniqueLevels.length} unique level values:`);
    uniqueLevels.forEach(level => {
      console.log(`   - "${level}"`);
    });
  } else {
    console.log('   No questions in database yet.');
  }

  // Test different level values
  console.log('\n2️⃣ Testing which level values are allowed:\n');
  
  const testLevels = ['Beginner', 'Intermediate', 'Advanced', 'Basic', 'easy', 'medium', 'hard', 'beginner', 'intermediate', 'advanced'];
  
  for (const testLevel of testLevels) {
    const testQuestion = {
      skill: 'TEST',
      level: testLevel,
      question_text: 'Test',
      option_a: 'A',
      option_b: 'B',
      option_c: 'C',
      option_d: 'D',
      correct_answer: 'A',
      explanation: 'Test',
      topic: 'Test',
      mdn_link: '',
      youtube_english: '',
      youtube_hindi: '',
      youtube_kannada: '',
      youtube_tamil: '',
      youtube_telugu: ''
    };

    const { data, error } = await supabase
      .from('practice_questions')
      .insert([testQuestion])
      .select();

    if (error) {
      console.log(`   ❌ "${testLevel}" - REJECTED: ${error.message.substring(0, 80)}`);
    } else {
      console.log(`   ✅ "${testLevel}" - ACCEPTED`);
      // Clean up
      if (data && data.length > 0) {
        await supabase
          .from('practice_questions')
          .delete()
          .eq('skill', 'TEST')
          .eq('level', testLevel);
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n💡 SOLUTION:\n');
  console.log('Once we know which level values are accepted,');
  console.log('we will fix ALL CSV files to use those exact values.');
}

checkConstraint().catch(console.error);
