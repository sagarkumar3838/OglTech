# Fix 500 Error - Step by Step

## The Problem
You're getting a 500 error when sending messages in the AI Assistant. This means the server is receiving your request but something is failing on the server side.

## Quick Fix (Most Likely Solution)

### Step 1: Restart the Server Properly

1. **Stop the current server** (Press Ctrl+C in the server terminal)

2. **Navigate to server directory:**
   ```bash
   cd server
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```

4. **Wait for this message:**
   ```
   🚀 Server running on http://localhost:5001
   📊 Health check: http://localhost:5001/api/health
   ✅ Ready to accept requests!
   ```

### Step 2: Test the Configuration

Open a new terminal and run:

```bash
curl http://localhost:5001/api/ai-chat/test
```

You should see:
```json
{
  "status": "ok",
  "deepseekConfigured": true,
  "deepseekKeyLength": 40,
  "deepseekModel": "deepseek-chat"
}
```

If `deepseekConfigured` is `false`, continue to Step 3.

### Step 3: Verify Environment Variables

1. Open the `.env` file in the **root directory** (not in server folder)

2. Make sure these lines exist:
   ```env
   DEEPSEEK_API_KEY=sk-3671732db37f4c77bbe08a1fe7c08267
   DEEPSEEK_MODEL=deepseek-chat
   ```

3. Save the file

4. Restart the server (Step 1 again)

### Step 4: Test AI Chat

```bash
curl -X POST http://localhost:5001/api/ai-chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Hello\",\"userId\":\"test\"}"
```

You should get an AI response.

### Step 5: Test in Browser

1. Go to http://localhost:3000/ai-assistant
2. Type a message
3. Press Enter or click Send
4. You should get a response

## If Still Not Working

### Check Server Logs

When you send a message, look at the server terminal. You should see:

```
AI Chat Request: { message: 'Hello...', userId: 'xxx' }
Calling DeepSeek API...
DeepSeek API response received
```

If you see an error instead, read the error message carefully.

### Common Error Messages

#### "DeepSeek API key not configured"
**Solution:** Your .env file is not being read. Make sure:
- The .env file is in the root directory (not in server/)
- The file is named exactly `.env` (not `.env.txt`)
- You restarted the server after editing

#### "Request failed with status code 401"
**Solution:** Invalid API key
- Get a new key from https://platform.deepseek.com/api_keys
- Update the DEEPSEEK_API_KEY in .env
- Restart server

#### "Request failed with status code 429"
**Solution:** Rate limit exceeded
- Wait a few minutes
- Check your DeepSeek account usage

#### "Cannot read property 'choices' of undefined"
**Solution:** Unexpected API response
- Check server logs for the actual error
- The DeepSeek API might be down
- Try again in a few minutes

### Run Automated Test

I've created a test script. Run it:

```bash
node test-ai-chat.js
```

This will test:
1. Server configuration
2. API key setup
3. Actual AI chat functionality

## Nuclear Option: Complete Reset

If nothing works, do a complete reset:

```bash
# 1. Stop all servers (Ctrl+C)

# 2. Clean server
cd server
rm -rf node_modules
npm install

# 3. Verify .env
cd ..
type .env | findstr DEEPSEEK

# 4. Start server
cd server
npm run dev

# 5. Wait for "Ready to accept requests!"

# 6. Test
curl http://localhost:5001/api/ai-chat/test
```

## Check These Files

Make sure these files exist and have the correct content:

### 1. `.env` (root directory)
```env
DEEPSEEK_API_KEY=sk-3671732db37f4c77bbe08a1fe7c08267
DEEPSEEK_MODEL=deepseek-chat
PORT=5001
```

### 2. `server/src/routes/aiChat.ts`
Should exist and export a router

### 3. `server/src/index.ts` or `server/src/server.ts`
Should import and use the aiChat route:
```typescript
import aiChatRoutes from './routes/aiChat';
app.use('/api', aiChatRoutes);
```

## Verify Server is Using Correct File

The server should be running `server/src/server.ts` (for local dev).

Check `server/package.json`:
```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts"
  }
}
```

## Get Detailed Error Information

### In Browser:
1. Open DevTools (F12)
2. Go to Network tab
3. Send a message
4. Click on the `ai-chat` request
5. Look at the Response tab
6. Copy the error message

### In Server:
The server logs will show detailed error information including:
- Error message
- Response from DeepSeek API
- Status code
- Request details

## Success Checklist

When everything works, you should see:

- ✅ Server starts without errors
- ✅ `/api/health` returns status "ok"
- ✅ `/api/ai-chat/test` shows `deepseekConfigured: true`
- ✅ Can send messages in AI Assistant
- ✅ Get responses from DeepSeek
- ✅ No errors in browser console
- ✅ No errors in server logs

## Still Need Help?

Run these commands and share the output:

```bash
# 1. Check server health
curl http://localhost:5001/api/health

# 2. Check AI config
curl http://localhost:5001/api/ai-chat/test

# 3. Test AI chat
curl -X POST http://localhost:5001/api/ai-chat -H "Content-Type: application/json" -d "{\"message\":\"test\",\"userId\":\"test\"}"

# 4. Check environment
cd server
node -e "require('dotenv').config({path:'../.env'}); console.log('DEEPSEEK_API_KEY:', process.env.DEEPSEEK_API_KEY ? 'SET' : 'NOT SET')"
```

Share the output of all 4 commands.
