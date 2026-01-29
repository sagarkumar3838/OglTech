# Getting Started - Choose Your Path

## 🎯 What Do You Want to Do?

### Option 1: Run on Localhost (Recommended for Testing)
**Perfect for:** Testing, development, learning the codebase

**Time:** 10 minutes  
**Cost:** Pay per AI API call only  
**Complexity:** ⭐⭐ (Easy)

👉 **Follow:** [README_LOCALHOST.md](README_LOCALHOST.md)

**Quick Start:**
```bash
npm run install:all
npm run setup:localhost
npm run dev
```

---

### Option 2: Deploy to Production
**Perfect for:** Real users, production use, scalability

**Time:** 30 minutes  
**Cost:** Optimized with question bank caching  
**Complexity:** ⭐⭐⭐⭐ (Moderate)

👉 **Follow:** [DEPLOYMENT.md](DEPLOYMENT.md)

**Quick Start:**
```bash
npm run install:all
# Configure .env for production
npm run build
npm run deploy
```

---

## 📚 Documentation Guide

### For Localhost Development
1. **README_LOCALHOST.md** - Complete localhost guide ⭐ START HERE
2. **LOCALHOST_SETUP.md** - Detailed step-by-step
3. **START_LOCALHOST.md** - Quick reference
4. **LOCALHOST_SUMMARY.txt** - Text summary

### For Understanding the System
1. **QUICK_START.md** - 10-minute overview
2. **FEATURES.md** - Complete feature list (150+)
3. **ARCHITECTURE.md** - System architecture
4. **RAG_GUIDE.md** - RAG system explained

### For Production Deployment
1. **DEPLOYMENT.md** - Production deployment
2. **SETUP_GUIDE.md** - Detailed setup
3. **README.md** - Project overview

### For Implementation Details
1. **IMPLEMENTATION_SUMMARY.md** - What was built
2. **TypeScript files** - Source code with comments

---

## 🚀 Quick Decision Tree

```
Do you want to test locally?
│
├─ YES → Use ai_only mode
│   │
│   ├─ Follow: README_LOCALHOST.md
│   ├─ Config: RAG_STRATEGY=ai_only
│   ├─ Time: 10 minutes
│   └─ Result: Running on localhost
│
└─ NO → Deploy to production
    │
    ├─ Follow: DEPLOYMENT.md
    ├─ Config: RAG_STRATEGY=hybrid
    ├─ Time: 30 minutes
    └─ Result: Live on Firebase
```

---

## 🎓 Learning Path

### Beginner (Just Starting)
1. Read **QUICK_START.md** (5 min)
2. Follow **README_LOCALHOST.md** (10 min)
3. Run on localhost
4. Test all features
5. Read **FEATURES.md** to understand capabilities

### Intermediate (Ready to Deploy)
1. Complete localhost setup
2. Read **RAG_GUIDE.md** to understand RAG system
3. Read **ARCHITECTURE.md** to understand structure
4. Follow **DEPLOYMENT.md** to deploy
5. Monitor and optimize

### Advanced (Customization)
1. Review TypeScript source code
2. Modify AI prompts in `BaseAIProvider.ts`
3. Add custom question types
4. Implement custom features
5. Contribute improvements

---

## 🔑 Key Concepts

### RAG (Retrieval-Augmented Generation)
Combines question bank with AI generation to reduce hallucinations and costs.

**Three Strategies:**
- `ai_only` - All AI (localhost)
- `hybrid` - Mix of bank + AI (production)
- `rag_only` - Only bank (zero AI costs)

### AI Providers
System supports 5 providers with automatic fallback:
1. Anthropic Claude
2. OpenAI GPT-4
3. Google Gemini
4. Groq (fastest)
5. X.AI Grok

### Rate Limiting
Prevents abuse by limiting requests per user/IP.
- Localhost: Disabled
- Production: Enabled

---

## 📋 Prerequisites Checklist

### For Localhost
- [ ] Node.js 18+ installed
- [ ] Firebase account (free tier OK)
- [ ] At least 1 AI provider API key
- [ ] 10 minutes of time

### For Production
- [ ] Everything from localhost
- [ ] Firebase project configured
- [ ] Multiple AI provider keys (recommended)
- [ ] Question bank seeded
- [ ] 30 minutes of time

---

## 🎯 Recommended Path

### First Time Users
1. **Start with localhost** (README_LOCALHOST.md)
2. Test all features
3. Understand the system
4. Then deploy to production (DEPLOYMENT.md)

### Experienced Developers
1. Read ARCHITECTURE.md
2. Review source code
3. Configure for production
4. Deploy directly

---

## 💡 Tips

### For Localhost
- Use `ai_only` mode (simpler)
- Disable rate limiting
- Use Groq for speed (free tier)
- Set Firestore to test mode

### For Production
- Use `hybrid` mode (cost-effective)
- Enable rate limiting
- Seed question bank
- Use secure Firestore rules
- Configure multiple AI providers

---

## 🆘 Need Help?

### Common Issues
1. **"No AI providers configured"**
   - Add API key to .env
   - Restart server

2. **"Firebase permission denied"**
   - Check Firestore rules
   - Use test mode for localhost

3. **"Cannot connect to backend"**
   - Verify VITE_API_URL in .env
   - Check Firebase project ID

### Where to Look
- **Localhost issues:** README_LOCALHOST.md
- **Production issues:** DEPLOYMENT.md
- **RAG questions:** RAG_GUIDE.md
- **Architecture questions:** ARCHITECTURE.md

---

## 📊 Feature Comparison

| Feature | Localhost | Production |
|---------|-----------|------------|
| Setup Time | 10 min | 30 min |
| RAG Mode | ai_only | hybrid |
| Question Bank | Not needed | Recommended |
| Rate Limiting | Disabled | Enabled |
| Cost | Per API call | Optimized |
| Scalability | Single machine | Auto-scaling |
| Security | Test mode | Production rules |

---

## 🎉 Success Criteria

### Localhost Success
- [ ] App runs on http://localhost:3000
- [ ] Can sign up and login
- [ ] Can generate questions
- [ ] Can complete evaluation
- [ ] Can view scorecard

### Production Success
- [ ] App deployed to Firebase
- [ ] Custom domain configured (optional)
- [ ] Question bank seeded
- [ ] Multiple AI providers configured
- [ ] Rate limiting enabled
- [ ] Monitoring set up

---

## 🚀 Next Steps

After getting started:

1. **Customize**
   - Add more careers
   - Modify AI prompts
   - Add custom question types

2. **Optimize**
   - Seed more questions
   - Configure provider priority
   - Monitor costs

3. **Scale**
   - Add more AI providers
   - Implement caching
   - Add analytics

4. **Enhance**
   - Add admin dashboard UI
   - Implement reporting
   - Add multi-language support

---

## 📞 Support

- **Documentation:** See files listed above
- **Code:** Review TypeScript source files
- **Issues:** Check troubleshooting sections
- **Questions:** Review FAQ in documentation

---

**Ready to start? Choose your path above! 🚀**

For localhost: [README_LOCALHOST.md](README_LOCALHOST.md)  
For production: [DEPLOYMENT.md](DEPLOYMENT.md)
