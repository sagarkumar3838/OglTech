# Start on Localhost - Quick Reference

## Prerequisites
- Node.js 18+ installed
- Firebase project created
- At least ONE AI provider API key

## Quick Start (5 Steps)

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Create .env File
```bash
# Copy localhost template
cp .env.localhost .env

# Edit .env with your values:
# - Firebase config (from Firebase Console)
# - At least one AI provider API key
# - Update 'your-project-id' in VITE_API_URL
```

### 3. Update Firebase Project ID
Edit `.firebaserc`:
```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

### 4. Add Sample Career to Firestore
Go to Firebase Console → Firestore → Add Collection:
- Collection: `careers`
- Add document with fields from `LOCALHOST_SETUP.md`

### 5. Run the App

**Terminal 1 - Backend:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev:client
```

**Browser:**
```
http://localhost:3000
```

## Configuration for Localhost

Your `.env` should have:

```env
# AI Only Mode (no question bank needed)
RAG_STRATEGY=ai_only

# Rate limiting disabled
RATE_LIMIT_ENABLED=false

# Localhost API URL
VITE_API_URL=http://localhost:5001/your-project-id/us-central1/api
```

## Testing Flow

1. Open http://localhost:3000
2. Sign up with any email/password
3. Go to "Careers"
4. Click "OGL Content Developer"
5. Select skill (HTML/CSS/JavaScript)
6. Select level (Basic/Intermediate/Advanced)
7. Wait for AI to generate questions
8. Complete evaluation
9. View scorecard

## Troubleshooting

### Backend won't start
- Check `.env` has at least one AI provider key
- Verify Firebase project ID in `.firebaserc`
- Check port 5001 is not in use

### Frontend won't start
- Check port 3000 is not in use
- Verify `VITE_API_URL` in `.env`

### Can't generate questions
- Verify AI provider API key is valid
- Check backend terminal for errors
- Ensure you have API credits/quota

### Firebase permission denied
- Set Firestore to "test mode" for localhost
- Or use open rules (see `LOCALHOST_SETUP.md`)

## Key Features on Localhost

✅ **AI-powered question generation** (ai_only mode)
✅ **No question bank needed** (simplified setup)
✅ **Rate limiting disabled** (unlimited testing)
✅ **Multiple AI providers** (automatic fallback)
✅ **TypeScript** (full type safety)
✅ **Hot reload** (instant updates)

## Localhost vs Production

| Feature | Localhost | Production |
|---------|-----------|------------|
| RAG Mode | `ai_only` | `hybrid` |
| Rate Limit | Disabled | Enabled |
| Question Bank | Not needed | Recommended |
| Firestore Rules | Test mode | Secure |
| Cost | Per API call | Optimized |

## Next Steps

1. Test all skills and levels
2. Try different AI providers
3. Add more careers
4. Enable question bank (optional)
5. Deploy to production

## Full Documentation

- **LOCALHOST_SETUP.md** - Detailed localhost guide
- **QUICK_START.md** - 10-minute setup
- **RAG_GUIDE.md** - RAG system details
- **DEPLOYMENT.md** - Production deployment

---

**Ready to evaluate skills locally! 🚀**
