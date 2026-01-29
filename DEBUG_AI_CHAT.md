# Debug AI Chat 500 Error

## Quick Diagnosis

Run these commands to diagnose the issue:

### Step 1: Check if server is running
```bash
curl http://localhost:5001/api/health
```

Expected: JSON response with `"status": "ok"`

### Step 2: Check AI Chat configuration
```bash
curl http://localhost:5001/api/ai-chat/test
```

Expected: 
```json
{
  "status": "ok",
  "deepseekConfigured": true,
  "deepseekKeyLength": 40,
  "deepseekModel": "deepseek-chat"
}
```

If `deepseekConfigured` is `false`, your API key is not loading.

### Step 3: Test AI Chat endpoint
```bash
curl -X POST http://localhost:5001/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","userId":"test"}'
```

Expected: JSON response with AI message

### Step 4: Run automated test
```bash
node test-ai-chat.js
```

## Common Issues & Fixes

### Issue 1: "DeepSeek API key not configured"

**Cause:** Environment variable not loading

**Fix:**
1. Check `.env` file in root directory has:
   ```
   DEEPSEEK_API_KEY=sk-3671732db37f4c77bbe08a1fe7c08267
   DEEPSEEK_MODEL=deepseek-chat
   ```

2. Restart the server:
   ```bash
   cd server
   # Stop with Ctrl+C
   npm run dev
   ```

3. Verify the key is loading:
   ```bash
   curl http://localhost:5001/api/ai-chat/test
   ```

### Issue 2: "Request failed with status code 401"

**Cause:** Invalid DeepSeek API key

**Fix:**
1. Get a new API key from: https://platform.deepseek.com/api_keys
2. Update `.env` file with new key
3. Restart server

### Issue 3: "Request failed with status code 429"

**Cause:** Rate limit exceeded

**Fix:**
- Wait a few minutes
- Check your DeepSeek account usage
- Consider upgrading your plan

### Issue 4: "Cannot read property 'choices' of undefined"

**Cause:** Unexpected API response format

**Fix:**
Check server logs for the actual response from DeepSeek API

### Issue 5: Server logs show "Cannot find module"

**Cause:** Missing dependencies

**Fix:**
```bash
cd server
npm install axios dotenv
npm run dev
```

## Detailed Debugging Steps

### 1. Check Server Logs

When you send a message, check the server terminal for:

```
AI Chat Request: { message: 'Hello', userId: 'test-user' }
Calling DeepSeek API...
DeepSeek API response received
```

If you see an error, it will show detailed information.

### 2. Check Browser Console

Open DevTools (F12) → Console tab

Look for:
- The request URL (should be `http://localhost:5001/api/ai-chat`)
- The request payload
- The error response

### 3. Check Network Tab

Open DevTools (F12) → Network tab

1. Send a message in AI Assistant
2. Find the `ai-chat` request
3. Click on it
4. Check:
   - **Headers**: Request URL, Method (POST)
   - **Payload**: Your message
   - **Response**: Error details

### 4. Verify Environment Variables

Create a test file `server/test-env.js`:

```javascript
require('dotenv').config({ path: '../.env' });

console.log('Environment Variables:');
console.log('DEEPSEEK_API_KEY:', process.env.DEEPSEEK_API_KEY ? 'SET' : 'NOT SET');
console.log('DEEPSEEK_MODEL:', process.env.DEEPSEEK_MODEL);
console.log('PORT:', process.env.PORT);
```

Run it:
```bash
cd server
node test-env.js
```

### 5. Test DeepSeek API Directly

Create `test-deepseek.js`:

```javascript
const axios = require('axios');

async function testDeepSeek() {
  try {
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          { role: 'user', content: 'Say hello' }
        ]
      },
      {
        headers: {
          'Authorization': 'Bearer sk-3671732db37f4c77bbe08a1fe7c08267',
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ DeepSeek API works!');
    console.log('Response:', response.data.choices[0].message.content);
  } catch (error) {
    console.error('❌ DeepSeek API error:', error.response?.data || error.message);
  }
}

testDeepSeek();
```

Run it:
```bash
node test-deepseek.js
```

## Server Restart Checklist

When you make changes, always:

1. ✅ Stop the server (Ctrl+C)
2. ✅ Clear any cached builds: `rm -rf dist` (if exists)
3. ✅ Restart: `npm run dev`
4. ✅ Wait for "Ready to accept requests!"
5. ✅ Test the endpoint

## Environment File Checklist

Your `.env` file should have:

```env
# DeepSeek Configuration
DEEPSEEK_API_KEY=sk-3671732db37f4c77bbe08a1fe7c08267
DEEPSEEK_MODEL=deepseek-chat

# Server Configuration
PORT=5001
NODE_ENV=development

# Other required variables
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key
```

## Still Not Working?

### Last Resort: Complete Reset

```bash
# 1. Stop everything
# Press Ctrl+C in all terminals

# 2. Clean server
cd server
rm -rf node_modules dist
npm install

# 3. Clean client
cd ../client
rm -rf node_modules dist
npm install

# 4. Verify .env file
cd ..
cat .env | grep DEEPSEEK

# 5. Start server
cd server
npm run dev

# 6. In new terminal, start client
cd client
npm run dev

# 7. Test
curl http://localhost:5001/api/ai-chat/test
```

## Get Help

If still not working, provide:
1. Server logs (copy the terminal output)
2. Browser console errors
3. Network tab response
4. Output of: `curl http://localhost:5001/api/ai-chat/test`

## Success Indicators

When working correctly, you should see:

**Server logs:**
```
AI Chat Request: { message: 'Hello...', userId: 'xxx' }
Calling DeepSeek API...
DeepSeek API response received
```

**Browser console:**
```
No errors
```

**Network tab:**
```
Status: 200 OK
Response: { "response": "...", "timestamp": "..." }
```
