# API Keys Guide - Where to Get Them & Free Options

## ❌ Can This App Run Without API Keys?

**NO** - This app **requires at least ONE AI provider API key** to generate questions. However, there are **FREE options** available!

## 🆓 FREE API Key Options

### 1. Google Gemini (FREE TIER) ⭐ RECOMMENDED FOR TESTING

**Cost:** FREE up to 15 requests per minute, 1500 requests per day
**Perfect for:** Testing and small-scale use

**How to get:**
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API key"
4. Copy the key
5. Add to `.env`: `GOOGLE_API_KEY=your_key_here`

**Limits:**
- ✅ FREE tier available
- ✅ 15 requests/minute
- ✅ 1500 requests/day
- ✅ Good quality questions

### 2. Groq (FREE TIER) ⭐ ULTRA FAST

**Cost:** FREE up to 14,400 requests per day
**Perfect for:** Fast testing, high volume

**How to get:**
1. Go to https://console.groq.com/
2. Sign up with email
3. Go to "API Keys"
4. Click "Create API Key"
5. Copy the key (starts with `gsk_`)
6. Add to `.env`: `GROQ_API_KEY=gsk_your_key_here`

**Limits:**
- ✅ FREE tier: 14,400 requests/day
- ✅ ULTRA FAST inference (fastest of all providers)
- ✅ Good quality questions
- ✅ No credit card required

## 💰 PAID API Key Options (Higher Quality)

### 3. OpenAI (PAID) - Highest Quality

**Cost:** ~$0.01 per question (~$0.10 per evaluation)
**Perfect for:** Production use, highest quality

**How to get:**
1. Go to https://platform.openai.com/
2. Sign up and add payment method
3. Go to "API keys"
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)
6. Add to `.env`: `OPENAI_API_KEY=sk_your_key_here`

**Pricing:**
- GPT-4 Turbo: $0.01 per 1K input tokens
- ~$0.10 per complete evaluation (10 questions)

### 4. Anthropic Claude (PAID) - Excellent Quality

**Cost:** ~$0.008 per question (~$0.08 per evaluation)
**Perfect for:** Production use, excellent reasoning

**How to get:**
1. Go to https://console.anthropic.com/
2. Sign up and add payment method
3. Go to "API Keys"
4. Click "Create Key"
5. Copy the key (starts with `sk-ant-`)
6. Add to `.env`: `ANTHROPIC_API_KEY=sk-ant-your_key_here`

**Pricing:**
- Claude 3.5 Sonnet: $3 per 1M input tokens
- ~$0.08 per complete evaluation

### 5. X.AI Grok (PAID) - Alternative

**Cost:** Variable pricing
**Perfect for:** Alternative option

**How to get:**
1. Go to https://console.x.ai/
2. Sign up and configure billing
3. Create API key
4. Copy the key (starts with `xai-`)
5. Add to `.env`: `XAI_API_KEY=xai_your_key_here`

## 🎯 Recommended Setup for Different Use Cases

### For Testing/Learning (FREE)
```env
# Use Google Gemini (free tier)
GOOGLE_API_KEY=your_google_key_here
GOOGLE_MODEL=gemini-1.5-pro

# OR use Groq (free tier, ultra fast)
GROQ_API_KEY=gsk_your_groq_key_here
GROQ_MODEL=llama-3.1-70b-versatile

# AI Provider Priority
AI_PROVIDER_PRIORITY=google,groq
```

### For Production (PAID but Higher Quality)
```env
# Primary: Anthropic Claude (excellent quality)
ANTHROPIC_API_KEY=sk-ant-your_key_here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# Fallback 1: OpenAI (highest quality)
OPENAI_API_KEY=sk_your_key_here
OPENAI_MODEL=gpt-4-turbo-preview

# Fallback 2: Google Gemini (cost effective)
GOOGLE_API_KEY=your_google_key_here
GOOGLE_MODEL=gemini-1.5-pro

# AI Provider Priority
AI_PROVIDER_PRIORITY=anthropic,openai,google
```

### For High Volume Testing (FREE + FAST)
```env
# Primary: Groq (free, ultra fast)
GROQ_API_KEY=gsk_your_groq_key_here
GROQ_MODEL=llama-3.1-70b-versatile

# Fallback: Google Gemini (free)
GOOGLE_API_KEY=your_google_key_here
GOOGLE_MODEL=gemini-1.5-pro

# AI Provider Priority
AI_PROVIDER_PRIORITY=groq,google
```

## 📍 Where API Keys Go

### In Your `.env` File (Root Directory)

```env
# ============================================
# FIREBASE CONFIGURATION (Required)
# Get from: https://console.firebase.google.com/
# ============================================
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# ============================================
# API URL
# ============================================
VITE_API_URL=http://localhost:5001/your-project-id/us-central1/api

# ============================================
# AI PROVIDERS (Choose at least ONE)
# ============================================

# Google Gemini (FREE TIER)
GOOGLE_API_KEY=your_google_key_here
GOOGLE_MODEL=gemini-1.5-pro

# Groq (FREE TIER, ULTRA FAST)
GROQ_API_KEY=gsk_your_groq_key_here
GROQ_MODEL=llama-3.1-70b-versatile

# OpenAI (PAID, HIGHEST QUALITY)
OPENAI_API_KEY=sk_your_openai_key_here
OPENAI_MODEL=gpt-4-turbo-preview

# Anthropic Claude (PAID, EXCELLENT QUALITY)
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key_here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# X.AI Grok (PAID)
XAI_API_KEY=xai_your_xai_key_here
XAI_MODEL=grok-beta

# ============================================
# CONFIGURATION
# ============================================

# RAG Strategy
RAG_ENABLED=true
RAG_STRATEGY=ai_only
RAG_QUESTION_BANK_PERCENTAGE=0

# Rate Limiting
RATE_LIMIT_ENABLED=false

# Application
NODE_ENV=development
PORT=5001

# AI Provider Priority (system tries in this order)
AI_PROVIDER_PRIORITY=google,groq,openai,anthropic,xai
```

## 🚀 Quick Start with FREE APIs

### Step 1: Get Google Gemini API Key (FREE)

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API key"
4. Copy the key

### Step 2: Get Groq API Key (FREE)

1. Go to https://console.groq.com/
2. Sign up
3. Go to API Keys
4. Create new key
5. Copy the key (starts with `gsk_`)

### Step 3: Add to .env

```env
# Free AI providers
GOOGLE_API_KEY=your_actual_google_key_here
GROQ_API_KEY=gsk_your_actual_groq_key_here

# Use free providers first
AI_PROVIDER_PRIORITY=google,groq
```

### Step 4: Test

```bash
npm run dev:server
```

You should see:
```
🤖 AI Provider Manager initialized with 2 provider(s):
   Priority order: google → groq
```

## ❌ What Happens Without API Keys?

If you don't provide any AI provider API keys, you'll get this error:

```
Error: No AI providers configured. Please set at least one API key:
OPENAI_API_KEY, ANTHROPIC_API_KEY, GOOGLE_API_KEY, GROQ_API_KEY, or XAI_API_KEY
```

**The app will NOT start without at least one AI provider API key.**

## 🔄 Fallback System

The app tries providers in order:

```
User requests questions
    ↓
Try Provider 1 (Google)
    ↓ [FAIL]
Try Provider 2 (Groq)
    ↓ [SUCCESS]
Return questions
```

If all providers fail, user gets an error.

## 💡 Cost Comparison

| Provider | Cost per Evaluation | Free Tier | Quality | Speed |
|----------|-------------------|-----------|---------|-------|
| **Google Gemini** | FREE | 1500/day | Very Good | Fast |
| **Groq** | FREE | 14,400/day | Good | Ultra Fast |
| **OpenAI** | ~$0.10 | No | Excellent | Medium |
| **Anthropic** | ~$0.08 | No | Excellent | Fast |
| **X.AI** | Variable | No | Good | Fast |

## 🎯 Recommendations

### For Beginners/Testing
**Use Google Gemini** (free, good quality)
```env
GOOGLE_API_KEY=your_key
AI_PROVIDER_PRIORITY=google
```

### For High Volume Testing
**Use Groq** (free, ultra fast, high limits)
```env
GROQ_API_KEY=gsk_your_key
AI_PROVIDER_PRIORITY=groq
```

### For Production
**Use multiple providers** for reliability
```env
ANTHROPIC_API_KEY=sk-ant-your_key
OPENAI_API_KEY=sk_your_key
GOOGLE_API_KEY=your_key
AI_PROVIDER_PRIORITY=anthropic,openai,google
```

## 🔧 Setup Commands

### Automated Setup
```bash
npm run setup:localhost
```
This wizard will ask for your API keys.

### Manual Setup
```bash
cp .env.example .env
# Edit .env with your API keys
```

## 🆘 Troubleshooting

### "No AI providers configured"
**Problem:** No API keys in .env
**Solution:** Add at least one API key

### "Invalid API key"
**Problem:** Wrong or expired key
**Solution:** Generate new key from provider console

### "Rate limit exceeded"
**Problem:** Hit free tier limits
**Solution:** 
- Wait for reset
- Add another provider
- Upgrade to paid tier

### "Provider failed"
**Problem:** Provider is down
**Solution:** System automatically tries next provider

## 📊 Free Tier Limits

### Google Gemini
- ✅ 15 requests per minute
- ✅ 1500 requests per day
- ✅ No credit card required

### Groq
- ✅ 14,400 requests per day
- ✅ 30 requests per minute
- ✅ No credit card required

**These limits are enough for:**
- Testing the application
- Small-scale usage
- Development and learning
- Demonstrating to stakeholders

## 🎉 Summary

**You NEED at least one API key, but you can get FREE ones!**

**Recommended for testing:**
1. Get Google Gemini API key (FREE)
2. Get Groq API key (FREE)
3. Add both to .env
4. Start testing!

**Total cost for testing: $0**

**For production:**
- Add paid providers (OpenAI, Anthropic)
- Better quality and reliability
- Cost: ~$0.08-0.10 per evaluation

**Start with free providers, upgrade when needed!**

---

**Next Steps:**
1. Get a free API key from Google or Groq
2. Follow [README_LOCALHOST.md](README_LOCALHOST.md)
3. Start evaluating skills!