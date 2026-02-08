# 🚀 AssemblyAI Quick Start

## 3-Step Setup

### 1. Get API Key
Go to: https://www.assemblyai.com/dashboard/signup
- Sign up (free)
- Copy your API key

### 2. Add to Environment
```bash
# Root .env file
ASSEMBLYAI_API_KEY=your_key_here

# functions/.env file
ASSEMBLYAI_API_KEY=your_key_here
```

### 3. Install & Deploy
```bash
# Install dependencies
cd functions
npm install

# Deploy
firebase deploy --only functions
```

## Test It

1. Go to evaluation page
2. Click microphone button 🎤
3. Speak your answer
4. Click stop
5. See transcribed text!

## What Changed?

### Before (Whisper/Web Speech API):
- ❌ Microphone permission issues
- ❌ Browser compatibility problems
- ❌ Tab switching breaks recording
- ❌ Inconsistent results

### After (AssemblyAI):
- ✅ Works reliably everywhere
- ✅ Better accuracy
- ✅ No browser issues
- ✅ Professional quality

## Files Modified

1. **Backend:**
   - `functions/routes/transcription.js` - New route
   - `functions/index.js` - Added route
   - `functions/package.json` - Added dependencies

2. **Frontend:**
   - `client/src/hooks/useVoiceInput.ts` - Updated to use AssemblyAI
   - `client/src/components/VoiceInputButton.tsx` - Minor updates

3. **Config:**
   - `.env.example` - Added ASSEMBLYAI_API_KEY
   - `functions/.env.example` - Added ASSEMBLYAI_API_KEY

## How It Works

```
User clicks mic → Records audio → Sends to backend
                                      ↓
Backend receives → Sends to AssemblyAI → Gets text
                                      ↓
Text returned → Displayed in UI ← User sees result
```

## Free Tier

- **5 hours/month** free
- No credit card required
- All features included

Perfect for testing and small apps!

## Need Help?

See full guide: `ASSEMBLYAI_SETUP_GUIDE.md`

## That's It! 🎉

Your voice input now works better than ever!
