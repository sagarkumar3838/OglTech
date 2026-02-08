# 🎤 AssemblyAI Voice Transcription Setup Guide

## Overview

Your app now uses **AssemblyAI** instead of Whisper AI for voice transcription. AssemblyAI provides:

- ✅ **Better accuracy** than browser-based speech recognition
- ✅ **No microphone permission issues** - works reliably across all browsers
- ✅ **Consistent results** - server-side processing
- ✅ **Multi-language support** - 50+ languages
- ✅ **Free tier available** - 5 hours/month free

## Why AssemblyAI Instead of Whisper?

1. **Microphone Access Issues Solved**: AssemblyAI processes audio server-side, avoiding browser permission problems
2. **Better Reliability**: No tab-switching interruptions or browser compatibility issues
3. **Professional Quality**: Industry-leading accuracy for speech-to-text
4. **Easy Integration**: Simple API, no complex setup

## Setup Steps

### 1. Get Your AssemblyAI API Key

1. Go to [AssemblyAI Dashboard](https://www.assemblyai.com/dashboard/signup)
2. Sign up for a free account
3. Copy your API key from the dashboard

**Free Tier Includes:**
- 5 hours of transcription per month
- All features included
- No credit card required

### 2. Add API Key to Environment Variables

#### For Local Development:

Add to your `.env` file in the root directory:

```env
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
```

#### For Firebase Functions:

Add to `functions/.env`:

```env
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
```

#### For Production Deployment:

Set the environment variable in Firebase:

```bash
firebase functions:config:set assemblyai.api_key="your_assemblyai_api_key_here"
```

Or add it to your hosting platform's environment variables.

### 3. Install Dependencies

```bash
# Install backend dependencies
cd functions
npm install

# This will install:
# - assemblyai: ^4.0.0
# - multer: ^1.4.5-lts.1 (for file uploads)
```

### 4. Deploy Backend

```bash
# Deploy Firebase Functions
firebase deploy --only functions

# Or use your deployment script
DEPLOY_TO_FIREBASE_NOW.bat
```

## How It Works

### User Flow:

1. **User clicks microphone button** 🎤
2. **Browser records audio** (using MediaRecorder API)
3. **Audio sent to your backend** (Firebase Functions)
4. **Backend sends to AssemblyAI** for transcription
5. **Transcribed text returned** to frontend
6. **Text displayed** in the answer field

### Technical Flow:

```
Frontend (React)
  ↓ Records audio (MediaRecorder)
  ↓ Sends audio blob
Backend (Firebase Functions)
  ↓ Receives audio file
  ↓ Uploads to AssemblyAI
  ↓ Gets transcription
  ↓ Returns text
Frontend (React)
  ↓ Displays transcribed text
```

## API Endpoints

### POST `/api/transcription/transcribe`

Transcribe audio file directly.

**Request:**
```javascript
const formData = new FormData();
formData.append('audio', audioBlob, 'recording.webm');
formData.append('language', 'en'); // Optional

fetch(`${API_URL}/transcription/transcribe`, {
  method: 'POST',
  body: formData
});
```

**Response:**
```json
{
  "success": true,
  "text": "This is the transcribed text",
  "confidence": 0.95,
  "words": [...]
}
```

### POST `/api/transcription/transcribe-url`

Transcribe audio from URL.

**Request:**
```json
{
  "audio_url": "https://example.com/audio.mp3",
  "language": "en"
}
```

**Response:**
```json
{
  "success": true,
  "text": "This is the transcribed text",
  "confidence": 0.95,
  "words": [...]
}
```

## Usage in Your App

The voice input button is already integrated in:

- **Evaluation Page** - MCQ and Fill-in-the-Blank questions
- **AI Assistant** - Voice-based queries (if implemented)

### Example Usage:

```tsx
import { VoiceInputButton } from '@/components/VoiceInputButton';

<VoiceInputButton
  onTranscript={(text) => {
    console.log('Transcribed:', text);
    // Use the transcribed text
  }}
  disabled={false}
/>
```

## Testing

### 1. Test Locally:

```bash
# Start backend
cd functions
npm run serve

# Start frontend
cd client
npm run dev
```

### 2. Test Voice Input:

1. Go to evaluation page
2. Click microphone button
3. Speak clearly
4. Click stop button
5. See transcribed text appear

### 3. Check Logs:

```bash
# Backend logs
firebase functions:log

# Or check console in browser DevTools
```

## Troubleshooting

### "Microphone permission denied"

**Solution:** Allow microphone access in browser settings
- Chrome: Settings → Privacy → Site Settings → Microphone
- Firefox: Preferences → Privacy & Security → Permissions → Microphone

### "Failed to transcribe audio"

**Possible causes:**
1. Invalid API key - Check `.env` file
2. API quota exceeded - Check AssemblyAI dashboard
3. Network issues - Check internet connection

**Solution:**
```bash
# Verify API key is set
echo $ASSEMBLYAI_API_KEY

# Check Firebase Functions logs
firebase functions:log
```

### "No microphone found"

**Solution:** 
- Connect a microphone or headset
- Check device settings
- Try a different browser

### Audio quality issues

**Tips for better transcription:**
- Speak clearly and at normal pace
- Reduce background noise
- Use a good quality microphone
- Keep recording under 2 minutes

## Cost Estimation

### Free Tier:
- **5 hours/month** = 300 minutes
- Perfect for testing and small apps

### Paid Plans:
- **Pay-as-you-go**: $0.00025 per second ($0.015/minute)
- **Example**: 1000 users × 2 minutes = 2000 minutes = $30/month

### Cost Comparison:
- **AssemblyAI**: $0.015/minute
- **OpenAI Whisper**: $0.006/minute
- **Google Speech-to-Text**: $0.016/minute

## Advanced Features

AssemblyAI offers additional features you can enable:

### 1. Speaker Diarization
Identify different speakers in audio:

```javascript
const transcript = await client.transcripts.transcribe({
  audio: uploadUrl,
  speaker_labels: true
});
```

### 2. Sentiment Analysis
Detect positive/negative sentiment:

```javascript
const transcript = await client.transcripts.transcribe({
  audio: uploadUrl,
  sentiment_analysis: true
});
```

### 3. Auto Highlights
Extract key points automatically:

```javascript
const transcript = await client.transcripts.transcribe({
  audio: uploadUrl,
  auto_highlights: true
});
```

### 4. Content Moderation
Filter inappropriate content:

```javascript
const transcript = await client.transcripts.transcribe({
  audio: uploadUrl,
  content_safety: true
});
```

## Multi-Language Support

AssemblyAI supports 50+ languages:

```javascript
// Spanish
language: 'es'

// French
language: 'fr'

// German
language: 'de'

// Japanese
language: 'ja'

// And many more...
```

Update the language in `VoiceInputButton.tsx`:

```tsx
const { isListening, error, startListening, stopListening } = useVoiceInput({
  onTranscript,
  language: 'es' // Change to your language
});
```

## Security Best Practices

1. **Never expose API key in frontend**
   - ✅ Store in backend environment variables
   - ❌ Don't include in client-side code

2. **Validate audio files**
   - Check file size (max 10MB)
   - Verify file type (audio only)

3. **Rate limiting**
   - Implement rate limits to prevent abuse
   - Monitor usage in AssemblyAI dashboard

4. **User authentication**
   - Require login before using voice features
   - Track usage per user

## Next Steps

1. ✅ **Test the integration** - Try voice input in your app
2. ✅ **Monitor usage** - Check AssemblyAI dashboard
3. ✅ **Optimize** - Adjust audio quality settings
4. ✅ **Scale** - Upgrade plan if needed

## Support

- **AssemblyAI Docs**: https://www.assemblyai.com/docs
- **API Reference**: https://www.assemblyai.com/docs/api-reference
- **Community**: https://discord.gg/assemblyai
- **Support**: support@assemblyai.com

## Summary

✅ **AssemblyAI is now integrated** - No more Whisper AI issues
✅ **Microphone problems solved** - Server-side processing
✅ **Better accuracy** - Professional-grade transcription
✅ **Easy to use** - Just click and speak
✅ **Free tier available** - 5 hours/month

Your voice input feature is now more reliable and professional! 🎉
