import { HybridQuestionService } from '../server/src/services/hybridQuestionService';

const service = new HybridQuestionService();

async function testHybridSystem() {
  console.log('🧪 Testing Hybrid Question System\n');
  console.log('='.repeat(50));

  // Test 1: Try with AI (will likely fail due to quota)
  console.log('\n📝 Test 1: Generate with AI (will fallback if fails)');
  try {
    const questions1 = await service.generateQuestions('JavaScript', 'BASIC', 5, true);
    console.log(`✅ Got ${questions1.length} questions`);
    console.log(`First question: ${questions1[0]?.question}`);
  } catch (error: any) {
    console.log(`❌ Error: ${error.message}`);
  }

  // Test 2: Database only (no AI)
  console.log('\n📝 Test 2: Fetch from database only');
  try {
    const questions2 = await service.generateQuestions('HTML', 'BASIC', 5, false);
    console.log(`✅ Got ${questions2.length} questions`);
    console.log(`First question: ${questions2[0]?.question}`);
  } catch (error: any) {
    console.log(`❌ Error: ${error.message}`);
  }

  // Test 3: JSON fallback
  console.log('\n📝 Test 3: JSON fallback (for skill not in DB)');
  try {
    const questions3 = await service.generateQuestions('CSS', 'INTERMEDIATE', 5, false);
    console.log(`✅ Got ${questions3.length} questions`);
    console.log(`First question: ${questions3[0]?.question}`);
  } catch (error: any) {
    console.log(`❌ Error: ${error.message}`);
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ Hybrid system test complete!\n');
}

testHybridSystem().catch(console.error);
