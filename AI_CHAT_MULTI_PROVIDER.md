# AI Chat - Multi-Provider Support

## Overview
The AI Assistant now supports **multiple AI providers** with automatic fallback:
- 🚀 **Groq** (Fast & Free) - Primary
- 🤖 **OpenAI** (GPT-4) - Fallback #1
- 💡 **DeepSeek** (Affordable) - Fallback #2

If one provider fails, it automatically tries the next one!

## How It Works

### Provider Priority
1. **Groq** - Tried first (fastest, free tier available)
2. **OpenAI** - Tried if Groq fails
3. **DeepSeek** - Tried if both above fail

### Automatic Fallback
```
User sends message
    ↓
Try Groq → Success? ✅ Return response
    ↓ Failed
Try OpenAI → Success? ✅ Return response
    ↓ Failed
Try DeepSeek → Success? ✅ Return response
    ↓ All failed
Return error message
```

## Configuration

### Option 1: Use Groq (Recommended - Free!)

Add to your `.env` file:
```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-70b-versatile
```

Get your free key: https://console.groq.com/keys

### Option 2: Use OpenAI

Add to your `.env` file:
```env
OPENAI_API_KEY=sk-proj-your-key-here
OPENAI_MODEL=gpt-4-turbo-preview
```

Get your key: https://platform.openai.com/api-keys

### Option 3: Use DeepSeek

Add to your `.env` file:
```env
DEEPSEEK_API_KEY=sk-your-key-here
DEEPSEEK_MODEL=deepseek-chat
```

Get your key: https://platform.deepseek.com/api_keys

### Option 4: Use All Three (Best Reliability!)

Add all three to your `.env` file for maximum reliability:
```env
# Primary (Free & Fast)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-70b-versatile

# Fallback 1 (Most Capable)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-turbo-preview

# Fallback 2 (Most Affordable)
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_MODEL=deepseek-chat
```

## Testing

### Check Available Providers
```bash
curl http://localhost:5001/api/ai-chat/test
```

Response:
```json
{
  "status": "ok",
  "availableProviders": [
    { "name": "groq", "displayName": "Groq", "configured": true },
    { "name": "openai", "displayName": "OpenAI", "configured": true },
    { "name": "deepseek", "displayName": "DeepSeek", "configured": true }
  ],
  "totalConfigured": 3
}
```

### Test Chat
```bash
curl -X POST http://localhost:5001/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","userId":"test"}'
```

Response:
```json
{
  "response": "Hello! How can I help you today?",
  "provider": "Groq",
  "timestamp": "2024-01-23T10:30:00.000Z"
}
```

## Features

### 1. Automatic Fallback
If Groq is down or rate-limited, it automatically tries OpenAI, then DeepSeek.

### 2. Provider Badge
Each AI response shows which provider was used (visible in the chat UI).

### 3. Smart Logging
Server logs show which provider is being tried:
```
🤖 Trying Groq...
✅ Groq responded successfully
```

Or if it fails:
```
🤖 Trying Groq...
❌ Groq failed: Rate limit exceeded
🤖 Trying OpenAI...
✅ OpenAI responded successfully
```

### 4. No Configuration Required
You only need **ONE** provider configured. The system will use whichever is available.

## Cost Comparison

| Provider | Input Cost | Output Cost | Speed | Free Tier |
|----------|-----------|-------------|-------|-----------|
| **Groq** | Free | Free | ⚡ Fastest | ✅ Yes |
| **OpenAI** | $10/1M tokens | $30/1M tokens | 🐢 Slower | ❌ No |
| **DeepSeek** | $0.14/1M tokens | $0.28/1M tokens | 🚀 Fast | ❌ No |

**Recommendation:** Use Groq as primary (it's free and fast!)

## Troubleshooting

### "No AI providers configured"
**Solution:** Add at least one API key to your `.env` file

### "All AI providers failed"
**Possible causes:**
1. All API keys are invalid
2. All providers are rate-limited
3. Network issues

**Solution:** 
- Check API keys are valid
- Wait a few minutes if rate-limited
- Check server logs for specific errors

### Provider keeps failing
**Solution:** 
- Check that specific provider's API key
- Verify you have credits/quota
- Try a different provider

## Server Logs

When working correctly, you'll see:
```
💬 AI Chat Request: { message: 'Hello...', userId: 'xxx', timestamp: '...' }
🤖 Trying Groq...
✅ Groq responded successfully
```

When falling back:
```
💬 AI Chat Request: { message: 'Hello...', userId: 'xxx', timestamp: '...' }
🤖 Trying Groq...
❌ Groq failed: Rate limit exceeded
🤖 Trying OpenAI...
✅ OpenAI responded successfully
```

## UI Features

### Provider Badge
Each AI response shows a badge with the provider name:
- Purple badge: "Groq", "OpenAI", or "DeepSeek"
- Helps you know which AI is responding

### Header
Shows "Multi-Provider (OpenAI, Groq, DeepSeek)" instead of single provider

## Benefits

✅ **Reliability** - If one fails, another takes over
✅ **Cost Optimization** - Use free Groq first, paid as fallback
✅ **Speed** - Groq is extremely fast
✅ **Flexibility** - Use any combination of providers
✅ **No Downtime** - System keeps working even if one provider is down

## Quick Start

1. **Add Groq API key** (free and fast):
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

2. **Restart server**:
   ```bash
   cd server
   npm run dev
   ```

3. **Test**:
   ```bash
   curl http://localhost:5001/api/ai-chat/test
   ```

4. **Use AI Assistant**:
   Go to http://localhost:3000/ai-assistant

That's it! 🎉

## Advanced: Custom Provider Order

Want to change the priority? Edit `server/src/routes/aiChat.ts`:

```typescript
const providerOrder = ['openai', 'groq', 'deepseek']; // Try OpenAI first
```

## Support

If you have issues:
1. Check `/api/ai-chat/test` to see configured providers
2. Check server logs for detailed error messages
3. Verify at least one API key is set correctly
4. Try each provider individually to isolate issues
