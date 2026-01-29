# Quick Fix Guide - All Current Issues

## Issue 1: UUID Error ✅ FIXED

**Error:** `invalid input syntax for type uuid: "ZEtVWWro6TZn969BcJeYgWNu9jO2"`

**Fix:** Run this SQL in your Supabase SQL Editor:

```sql
-- Copy and paste this entire block into Supabase SQL Editor
ALTER TABLE user_progress ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE evaluations ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE submissions ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE scorecards ALTER COLUMN user_id TYPE TEXT;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_user_id ON evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_scorecards_user_id ON scorecards(user_id);

SELECT 'Migration completed successfully!' AS status;
```

## Issue 2: AdminLayout Reference Error ✅ FIXED

**Error:** `Uncaught ReferenceError: AdminLayout is not defined`

**Fix:** Already fixed in code - removed AdminLayout import from Dashboard.tsx

## Issue 3: AI Assistant Route Not Found ✅ FIXED

**Error:** `No routes matched location "/ai-assistant"`

**Fix:** Already added to App.tsx routing

## Issue 4: Server Not Receiving Requests

**Problem:** AI Assistant requests not reaching the server

**Fix Steps:**

### 1. Check Server is Running
```bash
cd server
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5001
📊 Health check: http://localhost:5001/api/health
```

### 2. Check Client Environment Variable

Open `client/.env` and verify:
```env
VITE_API_URL=http://localhost:5001/api
```

### 3. Test Server Health

Open browser and go to:
```
http://localhost:5001/api/health
```

You should see JSON response with status "ok"

### 4. Test AI Chat Endpoint

Use this curl command:
```bash
curl -X POST http://localhost:5001/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","userId":"test123"}'
```

### 5. Check Browser Console

Open DevTools (F12) → Network tab → Try sending a message in AI Assistant

Look for:
- Request URL should be: `http://localhost:5001/api/ai-chat`
- Status should be: 200 OK
- If 404: Server route not registered
- If 500: Check server logs for errors

## Complete Restart Procedure

If issues persist, do a complete restart:

### 1. Stop Everything
```bash
# Press Ctrl+C in both terminal windows
```

### 2. Clear Node Modules (if needed)
```bash
# In server directory
cd server
rm -rf node_modules
npm install

# In client directory
cd ../client
rm -rf node_modules
npm install
```

### 3. Start Server First
```bash
cd server
npm run dev
```

Wait for: `✅ Ready to accept requests!`

### 4. Start Client
```bash
cd client
npm run dev
```

### 5. Test in Browser
1. Go to http://localhost:3000
2. Login
3. Navigate to http://localhost:3000/ai-assistant
4. Send a test message

## Verification Checklist

- [ ] Supabase SQL migration completed
- [ ] Server running on port 5001
- [ ] Client running on port 3000
- [ ] Health endpoint responds: http://localhost:5001/api/health
- [ ] Dashboard loads without UUID error
- [ ] AI Assistant page loads
- [ ] Can send messages in AI Assistant
- [ ] Messages get responses from DeepSeek

## Common Issues & Solutions

### "Cannot connect to server"
- Check server is running
- Verify VITE_API_URL in client/.env
- Check firewall/antivirus blocking port 5001

### "DeepSeek API error"
- Verify DEEPSEEK_API_KEY in server/.env
- Check API key is valid at https://platform.deepseek.com
- Check you have API credits

### "Route not found"
- Clear browser cache (Ctrl+Shift+R)
- Restart Vite dev server
- Check App.tsx has AIAssistant route

### "CORS error"
- Server should have `cors({ origin: true })`
- Already configured in server/src/server.ts

## Environment Variables Checklist

### Server (.env)
```env
DEEPSEEK_API_KEY=sk-your-key-here
DEEPSEEK_MODEL=deepseek-chat
PORT=5001
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5001/api
VITE_FIREBASE_API_KEY=your-firebase-key
# ... other Firebase config
```

## Still Having Issues?

1. Check server logs for detailed errors
2. Check browser console (F12) for client errors
3. Check Network tab for failed requests
4. Verify all files are saved
5. Try hard refresh (Ctrl+Shift+R)

## Success Indicators

When everything works:
- ✅ Dashboard loads with career data
- ✅ No UUID errors in console
- ✅ AI Assistant page loads
- ✅ Can send messages and get responses
- ✅ No 404 or 500 errors
- ✅ Server logs show successful requests
