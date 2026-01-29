# Free Deployment Guide - SkillEval Platform

Deploy your SkillEval app to free hosting platforms. Choose the best option for your needs.

## 🎯 Best Free Options (Ranked)

### 1. **Vercel** (Recommended - Easiest)
- ✅ Free forever for personal projects
- ✅ Automatic deployments from Git
- ✅ Built-in CI/CD
- ✅ Custom domains
- ✅ Serverless functions support
- ✅ 100GB bandwidth/month

### 2. **Netlify** (Great Alternative)
- ✅ Free tier with 100GB bandwidth
- ✅ Automatic deployments
- ✅ Serverless functions
- ✅ Form handling
- ✅ Split testing

### 3. **Firebase Hosting** (Already Configured!)
- ✅ You already have this set up
- ✅ 10GB storage, 360MB/day bandwidth
- ✅ Free SSL
- ✅ CDN included

### 4. **Render** (Backend + Frontend)
- ✅ Free tier for web services
- ✅ Automatic deployments
- ✅ PostgreSQL database (free)
- ⚠️ Spins down after inactivity

### 5. **Railway** (Full Stack)
- ✅ $5 free credit/month
- ✅ Easy deployment
- ✅ Database included
- ⚠️ Limited free tier

---

## 🚀 Option 1: Deploy to Vercel (Recommended)

### Why Vercel?
- Zero configuration needed
- Fastest deployment (< 2 minutes)
- Best performance
- Free SSL and CDN
- Perfect for React/Vite apps

### Step-by-Step Deployment

#### 1. Prepare Your App

First, let's create a production environment file:

```bash
# Create production env file
copy client\.env client\.env.production
```

Edit `client/.env.production`:
```env
VITE_SUPABASE_URL=https://ksjgsgebjnpwyycnptom.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_API_URL=https://your-app.vercel.app/api
```

#### 2. Install Vercel CLI

```bash
npm install -g vercel
```

#### 3. Login to Vercel

```bash
vercel login
```

#### 4. Deploy

```bash
# Navigate to client folder
cd client

# Deploy to Vercel
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? skilleval (or your choice)
# - Directory? ./ (current directory)
# - Override settings? No
```

#### 5. Production Deployment

```bash
# Deploy to production
vercel --prod
```

**Your app is now live!** 🎉

Vercel will give you a URL like: `https://skilleval.vercel.app`

### Configure Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings > Environment Variables
4. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_FIREBASE_API_KEY` (if using Firebase Auth)
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`

5. Redeploy: `vercel --prod`

---

## 🔥 Option 2: Deploy to Firebase (Already Configured!)

You already have Firebase set up! Let's deploy:

### Quick Deploy

```bash
# Build the client
cd client
npm run build

# Go back to root
cd ..

# Deploy to Firebase
firebase deploy --only hosting
```

**Your app will be live at:**
`https://mentorai1998.web.app`

### Update Firebase Hosting

If you need to update the deployment:

```bash
# Build
cd client && npm run build && cd ..

# Deploy
firebase deploy --only hosting
```

---

## 🌐 Option 3: Deploy to Netlify

### Step-by-Step

#### 1. Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### 2. Login

```bash
netlify login
```

#### 3. Build Your App

```bash
cd client
npm run build
```

#### 4. Deploy

```bash
# From client directory
netlify deploy

# Follow prompts:
# - Create new site? Yes
# - Team? Your team
# - Site name? skilleval (or your choice)
# - Publish directory? dist

# For production:
netlify deploy --prod
```

**Your app is live!**
URL: `https://skilleval.netlify.app`

---

## 🐳 Option 4: Deploy to Render

### For Full Stack (Frontend + Backend)

#### 1. Create `render.yaml` in root:

```yaml
services:
  # Frontend
  - type: web
    name: skilleval-frontend
    env: static
    buildCommand: cd client && npm install && npm run build
    staticPublishPath: client/dist
    envVars:
      - key: VITE_SUPABASE_URL
        value: https://ksjgsgebjnpwyycnptom.supabase.co
      - key: VITE_SUPABASE_ANON_KEY
        sync: false

  # Backend (if needed)
  - type: web
    name: skilleval-backend
    env: node
    buildCommand: cd server && npm install
    startCommand: cd server && npm start
    envVars:
      - key: NODE_ENV
        value: production
```

#### 2. Deploy

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +"
3. Select "Blueprint"
4. Connect your Git repository
5. Render will auto-deploy from `render.yaml`

---

## 🚂 Option 5: Deploy to Railway

### Quick Deploy

#### 1. Install Railway CLI

```bash
npm install -g @railway/cli
```

#### 2. Login

```bash
railway login
```

#### 3. Initialize

```bash
railway init
```

#### 4. Deploy

```bash
# Deploy frontend
cd client
railway up

# Deploy backend (if needed)
cd ../server
railway up
```

---

## 📦 Deployment Checklist

Before deploying, make sure:

- [ ] Build works locally: `cd client && npm run build`
- [ ] Environment variables are set
- [ ] Supabase is configured and working
- [ ] All 406 errors are fixed (✅ Done!)
- [ ] Media table is populated (✅ Done!)
- [ ] RLS policies are set (✅ Done!)

---

## 🔧 Build Script for All Platforms

Create `DEPLOY.bat` in root:

```batch
@echo off
echo ============================================
echo BUILDING SKILLEVAL FOR DEPLOYMENT
echo ============================================

cd client
echo Building client...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo ✅ Build successful!
echo.
echo Deployment files ready in: client\dist
echo.
echo Choose your deployment platform:
echo 1. Vercel: vercel --prod
echo 2. Firebase: firebase deploy --only hosting
echo 3. Netlify: netlify deploy --prod
echo.
pause
```

---

## 🌟 Recommended: Vercel Deployment (Complete)

### One-Command Deploy

Create `deploy-vercel.bat`:

```batch
@echo off
echo Deploying to Vercel...
cd client
call npm run build
call vercel --prod
cd ..
echo ✅ Deployment complete!
pause
```

Run: `deploy-vercel.bat`

---

## 🔐 Environment Variables Reference

### Required for All Platforms:

```env
VITE_SUPABASE_URL=https://ksjgsgebjnpwyycnptom.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Optional (if using Firebase Auth):

```env
VITE_FIREBASE_API_KEY=AIzaSyByiM9KkbVqYdEkF4ZHB1GnJRY2XdQFEPM
VITE_FIREBASE_AUTH_DOMAIN=aimentorapp-ec286.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=aimentorapp-ec286
```

---

## 🎯 Quick Start (Fastest Method)

### Deploy to Vercel in 3 Commands:

```bash
# 1. Install Vercel
npm install -g vercel

# 2. Build
cd client && npm run build && cd ..

# 3. Deploy
cd client && vercel --prod
```

**Done! Your app is live in < 2 minutes!** 🚀

---

## 📊 Platform Comparison

| Platform | Speed | Ease | Free Tier | Best For |
|----------|-------|------|-----------|----------|
| Vercel | ⚡⚡⚡ | ⭐⭐⭐ | 100GB/mo | React/Vite apps |
| Firebase | ⚡⚡ | ⭐⭐ | 10GB/mo | Already configured |
| Netlify | ⚡⚡⚡ | ⭐⭐⭐ | 100GB/mo | Static sites |
| Render | ⚡⚡ | ⭐⭐ | Limited | Full stack |
| Railway | ⚡⚡ | ⭐⭐ | $5/mo | Full stack |

---

## 🆘 Troubleshooting

### Build Fails

```bash
# Clear cache
cd client
rmdir /s /q node_modules
rmdir /s /q dist
npm install
npm run build
```

### Environment Variables Not Working

Make sure they start with `VITE_` prefix for Vite apps.

### 404 on Refresh

Add to `vercel.json` in client folder:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 🎉 Next Steps After Deployment

1. Test your live app
2. Set up custom domain (optional)
3. Configure analytics
4. Set up monitoring
5. Share with users!

---

**Choose Vercel for the easiest and fastest deployment!** 🚀
