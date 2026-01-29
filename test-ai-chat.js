// Quick test script for AI Chat endpoint
const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function testAIChat() {
  console.log('🧪 Testing AI Chat Endpoint...\n');

  // Test 1: Check configuration
  try {
    console.log('1️⃣ Testing configuration endpoint...');
    const configResponse = await axios.get(`${API_URL}/ai-chat/test`);
    console.log('✅ Configuration:', configResponse.data);
    
    if (!configResponse.data.deepseekConfigured) {
      console.error('❌ DeepSeek API key not configured!');
      console.log('💡 Make sure DEEPSEEK_API_KEY is set in your .env file');
      return;
    }
    console.log('');
  } catch (error) {
    console.error('❌ Configuration test failed:', error.message);
    console.log('💡 Make sure the server is running on port 5001');
    return;
  }

  // Test 2: Send a test message
  try {
    console.log('2️⃣ Sending test message...');
    const chatResponse = await axios.post(`${API_URL}/ai-chat`, {
      message: 'Say hello in one sentence',
      userId: 'test-user'
    });
    console.log('✅ AI Response:', chatResponse.data.response);
    console.log('');
  } catch (error) {
    console.error('❌ Chat test failed:', error.response?.data || error.message);
    if (error.response?.data?.details) {
      console.log('💡 Details:', error.response.data.details);
    }
    return;
  }

  console.log('🎉 All tests passed! AI Chat is working correctly.');
}

// Run tests
testAIChat().catch(console.error);
