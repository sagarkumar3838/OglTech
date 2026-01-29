# 🚀 Full Stack Quick Start - Deploy Frontend + Backend

## ⚡ Fastest Method: Firebase (Recommended)

### One Command Deployment:

```bash
DEPLOY_FULLSTACK_FIREBASE.bat
```

**Result:**
- ✅ Frontend: `https://mentorai1998.web.app`
- ✅ Backend: `https://us-central1-mentorai1998.cloudfunctions.net/api`

---

## 🎯 Alternative: Vercel + Render

### Step 1: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Blueprint"
3. Connect your Git repository
4. Render will auto-deploy using `render.yaml`
5. Copy your backend URL: `https://skilleval-api.onrender.com`

### Step 2: Deploy Frontend to Vercel

```bash
# Update frontend to use your backend URL
echo VITE_API_URL=https://skilleval-api.onrender.com/api > client\.env.production

# Deploy
cd client
vercel --prod
```

---

## 📋 What Gets Deployed

### Frontend (Client)
- React app
- Static assets
- Environment variables

### Backend (Server)
- Express API
- AI Chat endpoints
- Question management
- Progress tracking
- Scorecard generation

---

## 🔐 Environment Variables Needed

### Backend (Set in Render/Firebase):

```env
NODE_ENV=production
SUPABASE_URL=https://ksjgsgebjnpwyycnptom.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=your_openai_key (optional)
ANTHROPIC_API_KEY=your_anthropic_key (optional)
```

### Frontend (Set in Vercel):

```env
VITE_SUPABASE_URL=https://ksjgsgebjnpwyycnptom.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=https://your-backend-url.com/api
```

---

## 🧪 Test Your Deployment

### Test Backend:

```bash
# Health check
curl https://your-backend-url.com/api/health

# Should return:
{
  "status": "ok",
  "timestamp": "2026-01-27T...",
  "version": "2.0.0"
}
```

### Test Frontend:

1. Visit your frontend URL
2. Sign up for account
3. Take an evaluation
4. Check dashboard
5. Try AI chat

---

## 📊 Platform Comparison

| Method | Setup Time | Free Tier | Best For |
|--------|------------|-----------|----------|
| **Firebase** | 5 min | 125K calls/mo | All-in-one |
| **Vercel + Render** | 10 min | Unlimited | Best performance |
| **Railway** | 7 min | $5/month | Full stack |

---

## 🚀 Deploy Now!

### Interactive Menu:

```bash
DEPLOY_FULLSTACK_MENU.bat
```

### Direct Firebase Deploy:

```bash
DEPLOY_FULLSTACK_FIREBASE.bat
```

---

## 🆘 Troubleshooting

### Backend Build Fails:

```bash
cd server
rmdir /s /q node_modules dist
npm install
npm run build
```

### Frontend Can't Connect:

1. Check `VITE_API_URL` in frontend env
2. Verify backend is running: `/api/health`
3. Check CORS configuration

### Firebase Functions Timeout:

Update `firebase.json`:

```json
{
  "functions": {
    "timeout": "60s",
    "memory": "512MB"
  }
}
```

---

## 💡 Pro Tips

1. **Test Locally First**
   ```bash
   # Terminal 1: Backend
   cd server && npm run dev
   
   # Terminal 2: Frontend
   cd client && npm run dev
   ```

2. **Monitor Your Apps**
   - Firebase: Console → Functions → Logs
   - Render: Dashboard → Logs
   - Vercel: Dashboard → Analytics

3. **Set Up Alerts**
   - Monitor function usage
   - Track error rates
   - Watch free tier limits

---

## 📚 Additional Resources

- `FULLSTACK_DEPLOYMENT_GUIDE.md` - Complete guide
- `render.yaml` - Render configuration
- `firebase.json` - Firebase configuration
- `server/src/server.ts` - Backend entry point

---

**Ready? Run `DEPLOY_FULLSTACK_FIREBASE.bat` now!** 🚀
