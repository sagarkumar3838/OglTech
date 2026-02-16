# 🎤 Voice Input Feature - Status & Setup

## Current Status: DISABLED (Backend Required)

The voice input feature is currently **disabled** because it requires a backend server that is not deployed.

### Why Voice Feature Doesn't Work

The voice transcription feature uses AssemblyAI API, which requires:
1. A backend server to handle audio processing
2. AssemblyAI API key
3. Server endpoint at `/api/transcription/transcribe`

**Current Setup:**
- ✅ Frontend deployed to Firebase (https://skillevaluate.web.app)
- ❌ Backend NOT deployed (was configured for Render.com)
- ❌ Voice feature unavailable

### Errors You Were Seeing

```
404 - skilleval-api.onrender.com/api/transcription/transcribe
429 - Too many requests (rate limiting)
```

**Cause**: The frontend was trying to call a backend API that doesn't exist or is down.

**Fix Applied**: Voice button now hidden when backend is unavailable.

---

## Option 1: Disable Voice Feature (Current)

Voice input button will not appear in the Practice page.

**Pros:**
- No backend needed
- No additional costs
- Simpler deployment

**Cons:**
- Users can't use voice to answer questions
- Must type answers manually

---

## Option 2: Enable Voice Feature (Requires Backend)

To enable voice input, you need to deploy the backend server.

### Step 1: Deploy Backend to Render.com

1. Go to: https://render.com
2. Sign up / Log in
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   ```
   Name: skilleval-api
   Environment: Node
   Build Command: cd server && npm install && npm run build
   Start Command: cd server && npm start
   ```

6. Add Environment Variables:
   ```
   SUPABASE_URL=https://ksjgsgebjnpwyycnptom.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ASSEMBLYAI_API_KEY=b89fc23a649842fd809cdb19724079bc
   PORT=5001
   ```

7. Click "Create Web Service"

### Step 2: Update Frontend Environment Variable

1. Update `client/.env`:
   ```
   VITE_API_URL=https://skilleval-api.onrender.com/api
   ```

2. Rebuild and redeploy:
   ```bash
   cd client
   npm run build
   firebase deploy --only hosting
   ```

### Step 3: Test Voice Feature

1. Go to Practice page
2. Voice button should now appear
3. Click microphone icon
4. Speak your answer
5. Answer should be transcribed

---

## Option 3: Use Browser Speech Recognition (No Backend)

Alternative: Use browser's built-in speech recognition (no backend needed).

### Pros:
- No backend required
- No API costs
- Works offline

### Cons:
- Only works in Chrome/Edge
- Less accurate than AssemblyAI
- Requires internet for some browsers

### Implementation:

Replace `useVoiceInput.ts` with browser SpeechRecognition API:

```typescript
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  onTranscript(transcript);
};

recognition.start();
```

---

## Recommended Approach

### For MVP / Testing:
**Option 1** - Disable voice feature (current setup)
- Simplest
- No additional costs
- Focus on core features

### For Production:
**Option 2** - Deploy backend to Render
- Professional voice transcription
- Better user experience
- Supports multiple languages

### For Budget-Conscious:
**Option 3** - Browser speech recognition
- Free
- No backend needed
- Good enough for basic use

---

## Cost Comparison

### Option 1: No Voice (Current)
- Cost: $0/month
- Deployment: Firebase only

### Option 2: Backend + AssemblyAI
- Backend: $7/month (Render.com starter)
- AssemblyAI: $0.00025/second (~$0.015 per minute)
- Total: ~$7-10/month

### Option 3: Browser Speech
- Cost: $0/month
- Deployment: Firebase only

---

## Current Deployment Status

✅ **Frontend**: Deployed to Firebase
- URL: https://skillevaluate.web.app
- Voice feature: Disabled (button hidden)

❌ **Backend**: Not deployed
- Voice transcription: Unavailable
- AI question generation: Unavailable

---

## Next Steps

### If you want voice feature:

1. **Deploy backend** (see DEPLOY_SERVER_TO_RENDER.md)
2. **Update VITE_API_URL** in client/.env
3. **Rebuild and redeploy** frontend

### If you don't need voice:

✅ **Nothing to do!** Current setup works fine without voice.

---

## Testing Without Voice

Users can still use the Practice page by:
1. Reading the question
2. Clicking the answer option directly
3. No voice input needed

The voice feature was just a convenience - not required for core functionality.

---

## Summary

**Current Status**: Voice feature disabled, app works fine without it.

**To Enable**: Deploy backend server to Render.com ($7/month).

**Alternative**: Use browser speech recognition (free, less accurate).

**Recommendation**: Keep voice disabled for now, enable later if needed.
