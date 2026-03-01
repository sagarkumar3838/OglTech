// Test script to check if Practice page query works
// Run this in browser console on http://localhost:3001/practice

console.log('=== Testing Practice Page Query ===');

// Test 1: Check if supabase is available
console.log('1. Supabase client:', typeof supabase !== 'undefined' ? 'Available' : 'NOT AVAILABLE');

// Test 2: Try the exact query from Practice.tsx
async function testQuery() {
  try {
    const skill = 'javascript';
    const level = 'beginner';
    const dbLevel = level === 'beginner' ? 'easy' : 
                    level === 'intermediate' ? 'medium' : 
                    level === 'advanced' ? 'hard' : level;
    
    console.log('2. Testing query with:', { skill, level, dbLevel });
    
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('skill', skill)
      .eq('level', dbLevel)
      .eq('type', 'mcq')
      .limit(10);
    
    if (error) {
      console.error('3. Query ERROR:', error);
      console.error('   Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
    } else {
      console.log('3. Query SUCCESS!');
      console.log('   Questions found:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('   First question:', data[0]);
      } else {
        console.log('   No questions returned - checking why...');
        
        // Check if any questions exist at all
        const { data: allQuestions, error: allError } = await supabase
          .from('questions')
          .select('skill, level, type, count')
          .limit(5);
        
        console.log('   Sample questions in DB:', allQuestions);
      }
    }
  } catch (err) {
    console.error('4. Unexpected error:', err);
  }
}

// Run the test
testQuery();

console.log('\n=== Check Network Tab ===');
console.log('Open DevTools > Network tab and look for:');
console.log('- Failed requests (red)');
console.log('- 401/403 errors (authentication/permission issues)');
console.log('- CORS errors');
console.log('- The actual Supabase query request');
