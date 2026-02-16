import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 TESTING UPLOAD CONNECTION\n');
console.log('='.repeat(80));

// Check credentials
console.log('\n1️⃣ Checking Credentials:\n');
console.log(`   VITE_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
console.log(`   VITE_SUPABASE_ANON_KEY: ${supabaseKey ? '✅ Set' : '❌ Missing'}`);

if (!supabaseUrl || !supabaseKey) {
  console.log('\n❌ Missing credentials! Check .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
console.log('\n2️⃣ Testing Database Connection:\n');

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('practice_questions')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.log(`   ❌ Connection failed: ${error.message}`);
      console.log(`   Error code: ${error.code}`);
      console.log(`   Error details: ${error.details}`);
      return false;
    }

    console.log('   ✅ Connection successful!');
    return true;
  } catch (err) {
    console.log(`   ❌ Connection error: ${err instanceof Error ? err.message : 'Unknown'}`);
    return false;
  }
}

// Test RLS status
async function testRLS() {
  console.log('\n3️⃣ Testing RLS Status:\n');
  
  try {
    // Try to insert a test question
    const testQuestion = {
      skill: 'TEST',
      level: 'Basic',
      question_text: 'Test question',
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
      if (error.message.includes('row-level security')) {
        console.log('   ❌ RLS IS ENABLED - This is blocking uploads!');
        console.log('   You must disable RLS in Supabase SQL Editor:');
        console.log('   ALTER TABLE practice_questions DISABLE ROW LEVEL SECURITY;');
        return false;
      } else {
        console.log(`   ❌ Insert failed: ${error.message}`);
        return false;
      }
    }

    console.log('   ✅ RLS is disabled - inserts are allowed!');
    
    // Clean up test question
    if (data && data.length > 0) {
      await supabase
        .from('practice_questions')
        .delete()
        .eq('skill', 'TEST');
      console.log('   ✅ Test question cleaned up');
    }
    
    return true;
  } catch (err) {
    console.log(`   ❌ Test failed: ${err instanceof Error ? err.message : 'Unknown'}`);
    return false;
  }
}

// Test CSV parsing
function testCSVParsing() {
  console.log('\n4️⃣ Testing CSV File:\n');
  
  const devtoolsFile = path.join(process.cwd(), 'questions', 'devtools-beginner.csv');
  
  if (!fs.existsSync(devtoolsFile)) {
    console.log('   ❌ devtools-beginner.csv not found!');
    return false;
  }
  
  const content = fs.readFileSync(devtoolsFile, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  
  console.log(`   ✅ File found: ${lines.length} lines`);
  console.log(`   ✅ Expected questions: ${lines.length - 1}`);
  
  return true;
}

async function main() {
  const connectionOk = await testConnection();
  
  if (!connectionOk) {
    console.log('\n❌ Cannot proceed - fix connection first!');
    process.exit(1);
  }
  
  const rlsOk = await testRLS();
  
  if (!rlsOk) {
    console.log('\n❌ Cannot proceed - disable RLS first!');
    console.log('\nRun this SQL in Supabase:');
    console.log('ALTER TABLE practice_questions DISABLE ROW LEVEL SECURITY;');
    process.exit(1);
  }
  
  const csvOk = testCSVParsing();
  
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 DIAGNOSIS COMPLETE:\n');
  
  if (connectionOk && rlsOk && csvOk) {
    console.log('✅ Everything looks good!');
    console.log('✅ You can now run: UPLOAD_VALID_QUESTIONS.bat');
  } else {
    console.log('❌ Issues found - fix them before uploading.');
  }
}

main().catch(console.error);
