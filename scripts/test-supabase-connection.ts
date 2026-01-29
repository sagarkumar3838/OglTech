import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ksjgsgebjnpwyycnptom.supabase.co';

// You need to get the correct anon key from Supabase dashboard
// Go to: https://supabase.com/dashboard/project/ksjgsgebjnpwyycnptom/settings/api
// Copy the "anon" "public" key (not the service_role key)

console.log('Please provide your Supabase anon key:');
console.log('1. Go to: https://supabase.com/dashboard/project/ksjgsgebjnpwyycnptom/settings/api');
console.log('2. Copy the "anon" "public" key');
console.log('3. Update the VITE_SUPABASE_ANON_KEY in your .env files\n');

// For now, let's test with what we have
const testKey = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY_HERE';

const supabase = createClient(supabaseUrl, testKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');
  
  try {
    const { data, error } = await supabase
      .from('careers')
      .select('*')
      .limit(5);

    if (error) {
      console.error('❌ Error connecting to Supabase:', error.message);
      console.log('\nPlease check:');
      console.log('1. Your Supabase anon key is correct');
      console.log('2. The SQL schema was executed successfully');
      console.log('3. Row Level Security policies are set up correctly');
      return;
    }

    console.log(`✅ Successfully connected to Supabase!`);
    console.log(`Found ${data?.length || 0} careers:\n`);
    
    data?.forEach((career: any) => {
      console.log(`  - ${career.name} (${career.experience_level})`);
    });

    console.log('\n✅ Supabase is working correctly!');
    console.log('Your frontend should now be able to fetch data from Supabase.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testConnection();
