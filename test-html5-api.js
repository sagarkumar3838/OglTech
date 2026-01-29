// Test the HTML5 question generation API
const API_URL = 'http://localhost:5000/api'; // Adjust if different

async function testHTML5API() {
  console.log('🧪 Testing HTML5 Question Generation API...\n');

  const features = [
    "Web Workers API",
    "WebSockets",
    "Canvas 2D Context"
  ];

  try {
    const response = await fetch(`${API_URL}/questions/generate-html5`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        features: features,
        level: 'BASIC',
        questionsPerFeature: 2,
        useAI: true
      })
    });

    const data = await response.json();

    if (data.success) {
      console.log('✅ Success!');
      console.log(`📊 Generated ${data.data.totalQuestions} questions for ${data.data.totalFeatures} features\n`);
      
      data.data.questionsByFeature.forEach((featureData) => {
        console.log(`\n🎯 ${featureData.feature}`);
        featureData.questions.forEach((q, idx) => {
          console.log(`\n  Q${idx + 1}: ${q.question}`);
          if (q.options) {
            q.options.forEach(opt => console.log(`    - ${opt}`));
          }
          console.log(`  ✓ Answer: ${q.correct_answer}`);
        });
      });
    } else {
      console.error('❌ Error:', data.error);
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    console.log('\n💡 Make sure your server is running: cd server && npm run dev');
  }
}

testHTML5API();
