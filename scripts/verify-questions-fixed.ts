import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ksjgsgebjnpwyycnptom.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzamdzZ2Viam5wd3l5Y25wdG9tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTAzMzk0MSwiZXhwIjoyMDg0NjA5OTQxfQ.9Y2JuAmAXSU7vXZB-UaLQkCw5iddITkJcVTRi6bTfd0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyQuestions() {
  console.log('🔍 Verifying Questions Database\n');
  console.log('='.repeat(60));

  try {
    // Test the exact query that was failing
    const { data, error, count } = await supabase
      .from('questions')
      .select('*', { count: 'exact' })
      .eq('skill', 'html')
      .eq('level', 'easy')
      .limit(5);

    if (error) {
      console.error('❌ Error querying questions:', error.message);
      return;
    }

    console.log(`\n✅ Found ${count} HTML easy questions\n`);

    if (data && data.length > 0) {
      console.log('Sample questions:');
      data.forEach((q, i) => {
        console.log(`\n${i + 1}. ${q.question}`);
        console.log(`   Type: ${q.type}`);
        console.log(`   Options: ${q.options?.length || 0}`);
        console.log(`   Answer: ${q.correct_answer}`);
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Questions are ready to use!');
    console.log('='.repeat(60));

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

verifyQuestions();
