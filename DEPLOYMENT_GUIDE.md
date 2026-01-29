# Complete Deployment Guide

## Deploy Client & Server to Production

---

## Prerequisites

Before deploying, ensure:
- ✅ All tests from `PRE_DEPLOYMENT_TESTING_CHECKLIST.md` pass
- ✅ Supabase project is set up and configured
- ✅ Environment variables are ready
- ✅ Build completes without errors locally

---

## Deployment Options

### Client (Frontend)
1. **Vercel** (Recommended - Free, Easy)
2. **Firebase Hosting** (Good for Firebase users)
3. **Netlify** (Alternative to Vercel)

### Server (Backend) - Optional
1. **Render** (Free tier available)
2. **Railway** (Easy deployment)
3. **Heroku** (Paid)

---

## Option 1: Deploy Client to Vercel (Recommended)

### Step 1: Prepare Client for Deployment

1. **Update environment variables**
   ```bash
   cd client
   ```

2. **Create `.env.production` file**
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

3. **Test production build locally**
   ```bash
   npm run build
   npm run preview
   ```

4. **Verify build works** - Open `http://localhost:4173`

### Step 2: Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from client folder**
   ```bash
   cd client
   vercel
   ```

4. **Follow prompts:**
   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N`
   - Project name? `ogl-platform` (or your choice)
   - In which directory is your code? `./`
   - Want to override settings? `N`

5. **Set environment variables in Vercel**
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   ```
   Or set them in Vercel Dashboard:
   - Go to https://vercel.com/dashboard
   - Select your project
   - Settings → Environment Variables
   - Add both variables for Production

6. **Deploy to production**
   ```bash
   vercel --prod
   ```

7. **Your site is live!** 🎉
   - URL: `https://your-project.vercel.app`

---

## Option 2: Deploy Client to Firebase Hosting

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

### Step 3: Initialize Firebase

```bash
cd client
firebase init hosting
```

Select:
- Use existing project or create new one
- Public directory: `dist`
- Configure as single-page app: `Yes`
- Set up automatic builds: `No`
- Overwrite index.html: `No`

### Step 4: Build and Deploy

```bash
# Build the client
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

### Step 5: Set Environment Variables

Firebase doesn't support `.env` files directly. You need to:

1. **Option A**: Build with production env vars
   ```bash
   # Set env vars before build
   set VITE_SUPABASE_URL=your_url
   set VITE_SUPABASE_ANON_KEY=your_key
   npm run build
   firebase deploy
   ```

2. **Option B**: Use Firebase Functions to serve env vars (advanced)

---

## Option 3: Deploy Server to Render

### Step 1: Prepare Server

1. **Create `render.yaml` in root** (already exists)

2. **Verify server builds**
   ```bash
   cd server
   npm run build
   ```

### Step 2: Deploy to Render

1. **Go to** https://render.com
2. **Sign up/Login**
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repository**
5. **Configure:**
   - Name: `ogl-platform-server`
   - Environment: `Node`
   - Build Command: `cd server && npm install && npm run build`
   - Start Command: `cd server && npm start`
   - Plan: `Free`

6. **Add Environment Variables:**
   - `SUPABASE_URL`: Your Supabase URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key
   - `OPENAI_API_KEY`: Your OpenAI key (if using AI)
   - `PORT`: `5001`

7. **Click "Create Web Service"**

8. **Wait for deployment** (5-10 minutes)

9. **Your server is live!**
   - URL: `https://your-service.onrender.com`

### Step 3: Update Client to Use Production Server

Update `client/src/config/api.ts` or wherever API URL is defined:

```typescript
const API_URL = import.meta.env.PROD 
  ? 'https://your-service.onrender.com'
  : 'http://localhost:5001';
```

Redeploy client with updated API URL.

---

## Option 4: Deploy Server to Railway

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 2: Login and Deploy

```bash
railway login
cd server
railway init
railway up
```

### Step 3: Add Environment Variables

```bash
railway variables set SUPABASE_URL=your_url
railway variables set SUPABASE_SERVICE_ROLE_KEY=your_key
railway variables set OPENAI_API_KEY=your_key
```

Or set in Railway Dashboard.

---

## Post-Deployment Configuration

### 1. Update Supabase Settings

1. **Go to Supabase Dashboard**
2. **Authentication → URL Configuration**
3. **Add your production URLs:**
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/**`

### 2. Update CORS Settings (if using backend)

In your server, ensure CORS allows your production domain:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://your-app.vercel.app'
  ]
}));
```

### 3. Test Production Deployment

1. **Visit your production URL**
2. **Test critical flows:**
   - Sign up
   - Login
   - Take a test
   - View scorecard
   - Check analytics
3. **Check browser console** for errors
4. **Monitor Supabase logs**

---

## Environment Variables Summary

### Client (Frontend)
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### Server (Backend) - Optional
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
OPENAI_API_KEY=sk-... (optional)
PORT=5001
```

---

## Deployment Checklist

### Before Deployment
- [ ] All tests pass locally
- [ ] Build completes without errors
- [ ] Environment variables are ready
- [ ] Supabase is configured
- [ ] Database has all required tables

### During Deployment
- [ ] Client deployed successfully
- [ ] Server deployed (if needed)
- [ ] Environment variables set in production
- [ ] URLs updated in code
- [ ] CORS configured

### After Deployment
- [ ] Production site loads
- [ ] Authentication works
- [ ] Database connection works
- [ ] All features functional
- [ ] No console errors
- [ ] Mobile responsive

---

## Troubleshooting

### Build Fails
- Check for TypeScript errors: `npm run build`
- Check for missing dependencies: `npm install`
- Verify environment variables are set

### 404 Errors
- Ensure SPA routing is configured
- Vercel: Should auto-detect
- Firebase: Set `rewrites` in `firebase.json`

### API Errors
- Check CORS settings
- Verify server URL in client
- Check environment variables
- Review server logs

### Database Errors
- Verify Supabase URL and keys
- Check RLS policies
- Review Supabase logs
- Test connection locally first

---

## Monitoring & Maintenance

### Monitor Your App
- **Vercel**: Dashboard → Analytics
- **Render**: Dashboard → Logs
- **Supabase**: Dashboard → Logs

### Regular Maintenance
- Monitor error logs weekly
- Update dependencies monthly
- Backup database regularly
- Review user feedback

---

## Quick Deploy Commands

### Vercel (Client)
```bash
cd client
vercel --prod
```

### Firebase (Client)
```bash
cd client
npm run build
firebase deploy
```

### Render (Server)
- Push to GitHub
- Auto-deploys from main branch

### Railway (Server)
```bash
cd server
railway up
```

---

## Cost Estimate

### Free Tier (Recommended for Starting)
- **Vercel**: Free (Hobby plan)
- **Supabase**: Free (500MB database, 50K monthly active users)
- **Render**: Free (750 hours/month)
- **Total**: $0/month

### Paid Tier (For Production)
- **Vercel Pro**: $20/month
- **Supabase Pro**: $25/month
- **Render Starter**: $7/month
- **Total**: ~$52/month

---

## Support & Resources

### Documentation
- Vercel: https://vercel.com/docs
- Firebase: https://firebase.google.com/docs/hosting
- Render: https://render.com/docs
- Supabase: https://supabase.com/docs

### Community
- Vercel Discord
- Firebase Community
- Supabase Discord

---

## Success! 🎉

Your OGL Platform is now live and accessible to users worldwide!

**Next Steps:**
1. Share your production URL
2. Monitor for errors
3. Gather user feedback
4. Iterate and improve

Good luck with your deployment! 🚀
