# DeepSeek API Integration Guide

## What is DeepSeek?

DeepSeek is a Chinese AI company that provides high-quality language models with **generous free tiers** and competitive pricing.

## Why DeepSeek?

### ✅ **FREE TIER Available**
- **Free credits** for new users
- **High-quality** responses
- **Fast** inference
- **Good for testing** and development

### ✅ **Excellent Value**
- **Lower cost** than OpenAI/Anthropic
- **High quality** output
- **Reliable** API
- **Good for production** use

### ✅ **Easy Integration**
- **OpenAI-compatible** API
- **Simple setup**
- **JSON response** support

## How to Get DeepSeek API Key (FREE)

### Step 1: Sign Up
1. Go to https://platform.deepseek.com/
2. Click "Sign Up"
3. Create account with email
4. Verify your email

### Step 2: Get API Key
1. Go to https://platform.deepseek.com/api_keys
2. Click "Create API Key"
3. Copy the key (starts with `sk-`)
4. Save it securely

### Step 3: Check Free Credits
1. Go to "Usage" or "Billing" section
2. Check your free credit balance
3. New users typically get free credits

## Add to Your .env File

```env
# DeepSeek (FREE TIER - EXCELLENT VALUE)
DEEPSEEK_API_KEY=sk-your_actual_deepseek_key_here
DEEPSEEK_MODEL=deepseek-chat

# Set DeepSeek as priority (it's free!)
AI_PROVIDER_PRIORITY=deepseek,google,groq,openai,anthropic,xai
```

## DeepSeek Models Available

| Model | Description | Use Case |
|-------|-------------|----------|
| **deepseek-chat** | General chat model | Recommended for questions |
| **deepseek-coder** | Code-focused model | Good for programming questions |
| **deepseek-math** | Math-focused model | Good for logic questions |

## Cost Comparison

| Provider | Cost per 1K tokens | Free Tier | Quality |
|----------|-------------------|-----------|---------|
| **DeepSeek** | ~$0.0001 | ✅ Yes | Excellent |
| **Google Gemini** | FREE | ✅ 1500/day | Very Good |
| **Groq** | FREE | ✅ 14,400/day | Good |
| **OpenAI** | ~$0.01 | ❌ No | Excellent |
| **Anthropic** | ~$0.008 | ❌ No | Excellent |

## Integration Status

✅ **DeepSeek Provider Added** - `server/src/services/aiProviders/DeepSeekProvider.ts`
✅ **Configuration Updated** - Added to `server/src/config/env.ts`
✅ **Provider Manager Updated** - Added to AI provider list
✅ **Environment Variables** - Added to `.env`

## How It Works

```
User Request
    ↓
AI Provider Manager
    ↓
Try DeepSeek (Priority 1)
    ↓ [SUCCESS]
Return Questions
```

If DeepSeek fails, system automatically tries next provider (Google, Groq, etc.)

## Testing DeepSeek

### Step 1: Add API Key
```env
DEEPSEEK_API_KEY=sk-your_actual_key_here
```

### Step 2: Run the App
```bash
npm run dev:server
```

You should see:
```
🤖 AI Provider Manager initialized with X provider(s):
   Priority order: deepseek → google → groq
```

### Step 3: Generate Questions
1. Go to http://localhost:3000
2. Select a career and skill
3. Watch DeepSeek generate questions!

## DeepSeek Advantages

### **For Testing/Development**
- ✅ **Free credits** for new users
- ✅ **High quality** responses
- ✅ **Fast** generation
- ✅ **Reliable** API

### **For Production**
- ✅ **Very low cost** (~10x cheaper than OpenAI)
- ✅ **Excellent quality**
- ✅ **Good rate limits**
- ✅ **Stable service**

### **For This App**
- ✅ **Perfect for question generation**
- ✅ **Good at technical content**
- ✅ **Supports JSON responses**
- ✅ **Works with existing code**

## Sample DeepSeek Response

DeepSeek generates high-quality technical questions:

```json
{
  "evaluation_id": "uuid",
  "evaluation_level": "INTERMEDIATE",
  "skill": "JavaScript",
  "questions": [
    {
      "question_id": "uuid",
      "question": "What is the difference between `let`, `const`, and `var` in JavaScript?",
      "options": [
        "They are all the same",
        "`let` and `const` are block-scoped, `var` is function-scoped",
        "`var` is the newest syntax",
        "Only `var` can be reassigned"
      ],
      "correct_answer": "`let` and `const` are block-scoped, `var` is function-scoped",
      "type": "mcq",
      "expected_skills": ["Variable declarations", "Scope"],
      "difficulty_weight": 7
    }
  ]
}
```

## Recommended Configuration

### For FREE Usage (Recommended)
```env
# Primary: DeepSeek (free credits)
DEEPSEEK_API_KEY=sk-your_key_here

# Fallback 1: Google Gemini (free tier)
GOOGLE_API_KEY=your_google_key_here

# Fallback 2: Groq (free tier)
GROQ_API_KEY=gsk_your_groq_key_here

# Priority: Try free providers first
AI_PROVIDER_PRIORITY=deepseek,google,groq
```

### For Production (Best Quality + Cost)
```env
# Primary: DeepSeek (excellent value)
DEEPSEEK_API_KEY=sk-your_key_here

# Fallback 1: Anthropic (high quality)
ANTHROPIC_API_KEY=sk-ant-your_key_here

# Fallback 2: OpenAI (highest quality)
OPENAI_API_KEY=sk-your_key_here

# Priority: Best value first
AI_PROVIDER_PRIORITY=deepseek,anthropic,openai
```

## Free Tier Limits

### DeepSeek Free Tier
- ✅ **Free credits** for new users (varies)
- ✅ **Good rate limits**
- ✅ **No credit card** required initially
- ✅ **High quality** responses

### Combined Free Options
With DeepSeek + Google + Groq, you get:
- **DeepSeek**: Free credits
- **Google**: 1,500 requests/day
- **Groq**: 14,400 requests/day
- **Total**: Excellent free coverage!

## Troubleshooting

### "DeepSeek API key invalid"
**Solution**: 
1. Check key format (should start with `sk-`)
2. Verify key is active in DeepSeek console
3. Check if you have remaining credits

### "DeepSeek rate limit exceeded"
**Solution**:
1. Wait for rate limit reset
2. System will automatically try next provider
3. Consider upgrading DeepSeek plan

### "DeepSeek service unavailable"
**Solution**:
1. System automatically tries next provider
2. Check DeepSeek status page
3. Verify internet connection

## Benefits Summary

### **Cost Savings**
- Use DeepSeek's free credits
- ~10x cheaper than OpenAI when paying
- Excellent value for money

### **Quality**
- High-quality technical questions
- Good understanding of programming concepts
- Reliable JSON responses

### **Reliability**
- Multiple provider fallback
- Automatic retry on failure
- Good uptime and performance

## Next Steps

1. **Get DeepSeek API Key** (FREE)
   - Sign up at https://platform.deepseek.com/
   - Get API key from https://platform.deepseek.com/api_keys

2. **Add to .env**
   ```env
   DEEPSEEK_API_KEY=sk-your_actual_key_here
   AI_PROVIDER_PRIORITY=deepseek,google,groq
   ```

3. **Test the Integration**
   ```bash
   npm run dev:server
   npm run dev:client
   ```

4. **Generate Questions**
   - Go to http://localhost:3000
   - Complete an evaluation
   - See DeepSeek in action!

## Conclusion

DeepSeek is an **excellent addition** to your AI provider lineup:

✅ **FREE tier** for testing
✅ **Excellent value** for production
✅ **High quality** responses
✅ **Easy integration**
✅ **Reliable fallback** option

**Perfect for cost-effective, high-quality question generation! 🚀**

---

**Get your FREE DeepSeek API key and start generating questions!**