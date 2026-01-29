# 🚀 Full Stack Deployment Guide - Frontend + Backend

Deploy both your React frontend and Node.js backend to free hosting platforms.

## 📋 Your Stack

### Frontend (Client)
- React + TypeScript + Vite
- Supabase for database
- Firebase Auth (optional)

### Backend (Server)
- Node.js + Express + TypeScript
- Firebase Functions
- AI Chat endpoints
- Question management
- Progress tracking

---

## 🎯 Best Free Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend) ⭐ Recommended
- ✅ Both 100% free
- ✅ Easy setup
- ✅ Great performance
- ✅ Automatic deployments

### Option 2: Firebase (Frontend + Backend)
- ✅ Already configured
- ✅ Single platform
- ✅ Free tier generous
- ✅ Integrated services

### Option 3: Netlify (Frontend) + Railway (Backend)
- ✅ Both free tiers
- ✅ Good performance
- ✅ Easy deployment

---

## 🔥 Option 1: Firebase (Easiest - Already Configured!)

### Why Firebase?
- ✅ You already have it set up
- ✅ Deploy both frontend and backend together
- ✅ Free tier: 125K function calls/month
- ✅ Integrated with your Firebase Auth

### Deploy Both Frontend + Backend

#### Step 1: Build Backend
```bash
cd server
npm install
npm run build
```

#### Step 2: Build Frontend
```bash
cd ../client
npm install
npm run build
```

#### Step 3: Deploy Everything
```bash
cd ..
firebase deploy
```

This deploys:
- ✅ Frontend to Firebase Hosting
- ✅ Backend to Firebase Functions
- ✅ Firestore rules

**Your URLs:**
- Frontend: `https://mentorai1998.web.app`
- Backend API: `https://us-central1-mentorai1998.cloudfunctions.net/api`

---

## ⚡ Option 2: Vercel (Frontend) + Render (Backend)

### Why This Combo?
- ✅ Best performance
- ✅ 100% free
- ✅ Separate scaling
- ✅ Easy to manage

### Part A: Deploy Backend to Render

#### 1. Create `render.yaml` in root:

```yaml
services:
  - type: web
    name: skilleval-api
    env: node
    region: oregon
    plan: free
    buildCommand: cd server && npm install && npm run build
    startCommand: cd server && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_SERVICE_KEY
        sync: false
      - key: OPENAI_API_KEY
        sync: false
      - key: ANTHROPIC_API_KEY
        sync: false
```

#### 2. Update `server/src/server.ts`:

Create this file if it doesn't exist:

```typescript
import app from './index';

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### 3. Deploy to Render:

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Blueprint"
3. Connect your Git repository
4. Render will auto-deploy from `render.yaml`

**Your Backend URL:** `https://skilleval-api.onrender.com`

### Part B: Deploy Frontend to Vercel

#### 1. Update `client/.env.production`:

```env
VITE_SUPABASE_URL=https://ksjgsgebjnpwyycnptom.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=https://skilleval-api.onrender.com/api
```

#### 2. Deploy to Vercel:

```bash
cd client
vercel --prod
```

**Your Frontend URL:** `https://skilleval.vercel.app`

---

## 🚂 Option 3: Railway (Full Stack)

### Why Railway?
- ✅ Deploy both frontend and backend
- ✅ $5 free credit/month
- ✅ Easy setup
- ✅ PostgreSQL included

### Deploy Full Stack to Railway

#### 1. Install Railway CLI:

```bash
npm install -g @railway/cli
```

#### 2. Login:

```bash
railway login
```

#### 3. Create `railway.json` in root:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### 4. Deploy Backend:

```bash
cd server
railway init
railway up
```

#### 5. Deploy Frontend:

```bash
cd ../client
railway init
railway up
```

---

## 📦 Complete Deployment Scripts

Let me create automated scripts for you:

### For Firebase (Frontend + Backend):

Create `DEPLOY_FULLSTACK_FIREBASE.bat`:

```batch
@echo off
echo ============================================
echo FULL STACK DEPLOYMENT TO FIREBASE
echo ============================================

echo Step 1: Building backend...
cd server
call npm install
call npm run build
cd ..

echo Step 2: Building frontend...
cd client
call npm install
call npm run build
cd ..

echo Step 3: Deploying to Firebase...
call firebase deploy

echo ✅ Deployment complete!
echo Frontend: https://mentorai1998.web.app
echo Backend: https://us-central1-mentorai1998.cloudfunctions.net/api
pause
```

### For Vercel + Render:

Create `DEPLOY_FULLSTACK_VERCEL_RENDER.bat`:

```batch
@echo off
echo ============================================
echo FULL STACK DEPLOYMENT
echo ============================================

echo Step 1: Deploy Backend to Render
echo Please follow these steps:
echo 1. Go to https://dashboard.render.com/
echo 2. Click "New +" then "Blueprint"
echo 3. Connect your Git repository
echo 4. Render will auto-deploy
echo.
echo Press any key when backend is deployed...
pause

echo Step 2: Building and deploying frontend to Vercel...
cd client
call npm run build
call vercel --prod
cd ..

echo ✅ Deployment complete!
pause
```

---

## 🔐 Environment Variables

### Backend Environment Variables:

For Render/Railway, set these in the dashboard:

```env
NODE_ENV=production
PORT=10000
SUPABASE_URL=https://ksjgsgebjnpwyycnptom.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

### Frontend Environment Variables:

For Vercel, set these in the dashboard:

```env
VITE_SUPABASE_URL=https://ksjgsgebjnpwyycnptom.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=https://your-backend-url.com/api
```

---

## 🎯 Recommended Deployment Path

### For Beginners: Firebase (All-in-One)

```bash
# 1. Build everything
cd server && npm run build && cd ..
cd client && npm run build && cd ..

# 2. Deploy everything
firebase deploy
```

**Done!** Both frontend and backend are live.

### For Best Performance: Vercel + Render

1. Deploy backend to Render (one-time setup)
2. Deploy frontend to Vercel (automatic)
3. Update frontend env with backend URL

---

## 📊 Platform Comparison

| Platform | Frontend | Backend | Free Tier | Best For |
|----------|----------|---------|-----------|----------|
| **Firebase** | ✅ | ✅ | 125K calls/mo | All-in-one |
| **Vercel + Render** | ✅ | ✅ | Unlimited | Performance |
| **Railway** | ✅ | ✅ | $5/month | Full stack |
| **Netlify + Render** | ✅ | ✅ | 100GB/mo | Static + API |

---

## 🚀 Quick Deploy Commands

### Firebase (Recommended for You):

```bash
# Build backend
cd server && npm run build && cd ..

# Build frontend
cd client && npm run build && cd ..

# Deploy both
firebase deploy
```

### Vercel (Frontend Only):

```bash
cd client
npm run build
vercel --prod
```

### Backend to Render:

1. Push code to GitHub
2. Connect to Render
3. Auto-deploy from `render.yaml`

---

## 🔧 Backend Server Configuration

### Update `server/src/server.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import { api } from './index';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({ 
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://skilleval.vercel.app', 'https://mentorai1998.web.app']
    : '*'
}));
app.use(express.json());

// Mount API routes
app.use('/api', api);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server (for non-Firebase deployments)
if (process.env.NODE_ENV !== 'firebase') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
```

---

## 🆘 Troubleshooting

### Backend Build Fails

```bash
cd server
rmdir /s /q node_modules dist
npm install
npm run build
```

### Frontend Can't Connect to Backend

1. Check backend URL in `client/.env.production`
2. Verify CORS is configured
3. Check backend is running: `https://your-backend/health`

### Firebase Functions Timeout

Increase timeout in `firebase.json`:

```json
{
  "functions": {
    "source": "server",
    "runtime": "nodejs18",
    "timeout": "60s",
    "memory": "512MB"
  }
}
```

---

## 📈 After Deployment

### Test Your Full Stack:

1. Visit frontend URL
2. Sign up for account
3. Take an evaluation (tests backend)
4. Check AI chat (tests AI endpoints)
5. View dashboard (tests progress tracking)

### Monitor Your Apps:

- **Frontend:** Vercel Analytics / Firebase Console
- **Backend:** Render Logs / Firebase Functions Logs
- **Database:** Supabase Dashboard

---

## 💡 Pro Tips

1. **Use Environment Variables**
   - Never commit API keys
   - Use platform dashboards to set env vars

2. **Enable Caching**
   - Cache static assets
   - Use CDN for better performance

3. **Monitor Usage**
   - Check free tier limits
   - Set up alerts

4. **Backup Your Data**
   - Export Supabase data regularly
   - Keep local backups

---

## 🎉 Ready to Deploy?

### Easiest: Firebase (Both Frontend + Backend)

```bash
DEPLOY_FULLSTACK_FIREBASE.bat
```

### Best Performance: Vercel + Render

```bash
DEPLOY_FULLSTACK_VERCEL_RENDER.bat
```

---

**Your full stack app will be live in 5 minutes!** 🚀
