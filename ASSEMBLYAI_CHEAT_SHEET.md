# 🎤 AssemblyAI Cheat Sheet

## Quick Commands

### Get API Key
```
https://www.assemblyai.com/dashboard/signup
```

### Install Dependencies
```bash
cd functions
npm install
```

### Configure Environment
```bash
# .env
ASSEMBLYAI_API_KEY=your_key_here

# functions/.env
ASSEMBLYAI_API_KEY=your_key_here
```

### Deploy
```bash
firebase deploy --only functions
```

### Test
```
1. Go to evaluation page
2. Click microphone 🎤
3. Speak
4. Stop
5. See text!
```

## API Endpoints

### Transcribe Audio File
```javascript
POST /api/transcription/transcribe

FormData:
- audio: Blob
- language: 'en'
```

### Transcribe from URL
```javascript
POST /api/transcription/transcribe-url

Body:
{
  "audio_url": "https://...",
  "language": "en"
}
```

## Frontend Usage

```tsx
import { VoiceInputButton } from '@/components/VoiceInputButton';

<VoiceInputButton
  onTranscript={(text) => console.log(text)}
  disabled={false}
/>
```

## Backend Code

```javascript
const { AssemblyAI } = require('assemblyai');

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY
});

const transcript = await client.transcripts.transcribe({
  audio: audioBuffer
});

console.log(transcript.text);
```

## Language Codes

```
en - English
es - Spanish
fr - French
de - German
ja - Japanese
zh - Chinese
... 50+ more
```

## Cost Calculator

```
Free: 5 hours/month
Paid: $0.015/minute

100 users × 2 min = $3/month
500 users × 2 min = $15/month
1000 users × 2 min = $30/month
```

## Error Handling

```javascript
try {
  const transcript = await transcribe(audio);
} catch (error) {
  if (error.message.includes('API key')) {
    // Invalid API key
  } else if (error.message.includes('quota')) {
    // Quota exceeded
  } else {
    // Other error
  }
}
```

## Troubleshooting

| Error | Solution |
|-------|----------|
| API key not configured | Add to .env files |
| Failed to transcribe | Check logs |
| Microphone denied | Allow in browser |
| No audio recorded | Check microphone |

## Files Modified

```
Backend:
✅ functions/routes/transcription.js
✅ functions/index.js
✅ functions/package.json

Frontend:
✅ client/src/hooks/useVoiceInput.ts
✅ client/src/components/VoiceInputButton.tsx

Config:
✅ .env.example
✅ functions/.env.example
```

## Testing Checklist

```
[ ] API key added
[ ] Backend deployed
[ ] Mic button shows
[ ] Recording works
[ ] Transcription works
[ ] Errors handled
[ ] Works in Chrome
[ ] Works in Firefox
[ ] Works on mobile
```

## Monitoring

```bash
# Check logs
firebase functions:log

# Check usage
https://www.assemblyai.com/dashboard
```

## Advanced Features

```javascript
// Speaker detection
speaker_labels: true

// Sentiment analysis
sentiment_analysis: true

// Auto highlights
auto_highlights: true

// Content moderation
content_safety: true
```

## Support

- Docs: https://www.assemblyai.com/docs
- API: https://www.assemblyai.com/docs/api-reference
- Discord: https://discord.gg/assemblyai

## Quick Links

- Setup: `ASSEMBLYAI_SETUP_GUIDE.md`
- Quick Start: `ASSEMBLYAI_QUICK_START.md`
- Migration: `WHISPER_TO_ASSEMBLYAI_MIGRATION.md`
- Complete: `ASSEMBLYAI_IMPLEMENTATION_COMPLETE.md`

---

**That's it! You're ready to go! 🚀**
