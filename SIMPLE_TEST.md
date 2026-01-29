# Simple 3-Step Test

## Step 1: Is the server running?

Open your browser and go to:
```
http://localhost:5001/api/health
```

**Expected:** You see JSON with `"status": "ok"`

**If not:** Start the server with `cd server && npm run dev`

---

## Step 2: Is DeepSeek configured?

Open your browser and go to:
```
http://localhost:5001/api/ai-chat/test
```

**Expected:** You see `"deepseekConfigured": true`

**If false:** 
1. Check `.env` file has `DEEPSEEK_API_KEY=sk-3671732db37f4c77bbe08a1fe7c08267`
2. Restart server

---

## Step 3: Does AI chat work?

Open Command Prompt and run:
```bash
curl -X POST http://localhost:5001/api/ai-chat -H "Content-Type: application/json" -d "{\"message\":\"Say hi\",\"userId\":\"test\"}"
```

**Expected:** You get an AI response

**If error:** Check the server terminal for error details

---

## All 3 passed?

Go to http://localhost:3000/ai-assistant and try chatting!

## One failed?

See `FIX_500_ERROR.md` for detailed troubleshooting.
