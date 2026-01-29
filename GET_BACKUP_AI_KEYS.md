# How to Get Backup AI Provider API Keys

Your system is now configured to use **Groq** and **DeepSeek** as backup providers when OpenAI fails or is unavailable.

## 🚀 Groq (FREE - Recommended First Backup)

**Why Groq?** 
- ✅ FREE tier available
- ✅ Extremely fast inference (fastest in the market)
- ✅ Uses Llama 3.1 70B model
- ✅ Great for question generation

**How to Get:**
1. Go to: https://console.groq.com/keys
2. Sign up with Google/GitHub (takes 30 seconds)
3. Click "Create API Key"
4. Copy the key (starts with `gsk_`)
5. Add to your `.env` file:
   ```
   GROQ_API_KEY=gsk_your_key_here
   ```

**Free Tier Limits:**
- 30 requests per minute
- 14,400 requests per day
- More than enough for question generation!

---

## 💰 DeepSeek (Very Affordable - $0.14 per 1M tokens)

**Why DeepSeek?**
- ✅ Extremely cheap ($0.14 per 1M input tokens, $0.28 per 1M output)
- ✅ High quality responses
- ✅ Great for cost-conscious applications
- ✅ No free tier but very affordable

**How to Get:**
1. Go to: https://platform.deepseek.com/api_keys
2. Sign up with email
3. Add credits (minimum $5, will last a LONG time)
4. Create API key
5. Copy the key (starts with `sk-`)
6. Add to your `.env` file:
   ```
   DEEPSEEK_API_KEY=sk_your_key_here
   ```

**Pricing Example:**
- Generating 1,000 questions ≈ $0.05