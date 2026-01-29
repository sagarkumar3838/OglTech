import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuestions() {
  console.log('🧪 Testing question loading...\n');
  
  const tests = [
    { skill: 'html', level: 'easy' },
    { skill: 'css', level: 'easy' },
    { skill: 'javascript', level: 'easy' },
    { skill: 'jquery', level: 'easy' },
    { skill: 'oglknowledge', level: 'easy' }
  ];
  
  for (const { skill, level } of tests) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('skill', skill)
      .eq('level', level)
      .limit(5);
    
    if (error) {
      console.log(`❌ ${skill} (${level}): ${error.message}`);
    } else {
      console.log(`✅ ${skill} (${level}): ${data?.length || 0} questions found`);
      if (data && data.length > 0) {
        console.log(`   Sample: ${data[0].question.substring(0, 60)}...`);
      }
    }
  }
  
  console.log('\n📊 Total questions by skill:');
  const { data: summary } = await supabase
    .from('questions')
    .select('skill, level');
  
  if (summary) {
    const counts: Record<string, Record<string, number>> = {};
    summary.forEach(q => {
      if (!counts[q.skill]) counts[q.skill] = {};
      counts[q.skill][q.level] = (counts[q.skill][q.level] || 0) + 1;
    });
    
    Object.entries(counts).forEach(([skill, levels]) => {
      const total = Object.values(levels).reduce((a, b) => a + b, 0);
      console.log(`   ${skill}: ${total} total (${JSON.stringify(levels)})`);
    });
  }
}

testQuestions().catch(console.error);
