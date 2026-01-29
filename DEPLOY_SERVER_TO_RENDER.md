# 🚀 DEPLOY SERVER TO RENDER.COM - STEP BY STEP

## 📋 WHAT YOU'LL DEPLOY

Your Express.js server with:
- AI Chat features (OpenAI, Groq, DeepSeek)
- Question generation API
- Backend endpoints for advanced features

---

## 🎯 STEP-BY-STEP GUIDE

### STEP 1: Create Render Account (2 minutes)

1. **Open browser**: Go to https://render.com
2. **Click "Get Started"** or "Sign Up"
3. **Sign up with GitHub** (recommended) or email
4. **Verify email** if needed
5. **Complete profile**

✅ **Done!** You now have a Render account.

---

### STEP 2: Push Code to GitHub (5 minutes)

Render deploys from GitHub, so we need your code there.

#### Option A: If you already have GitHub repo
- Skip to Step 3

#### Option B: Create new GitHub repo

1. **Go to**: https://github.com/new
2. **Repository name**: `skilleval-app` (or any name)
3. **Make it Private** (recommended)
4. **Click "Create repository"**

5. **Push your code**:
```bash
cd C:\Users\death\Desktop\oglTech

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/skilleval-app.git

# Push
git branch -M main
git push -u origin main
```

✅ **Done!** Code is on GitHub.

---

### STEP 3: Create Web Service on Render (3 minutes)

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** (top right)
3. **Select "Web Service"**
4. **Click "Connect GitHub"** (if first time)
5. **Authorize Render** to access your GitHub
6. **Find your repository**: `skilleval-app`
7. **Click "Connect"**

✅ **Done!** Repository connected.

---

### STEP 4: Configure Web Service (5 minutes)

You'll see a configuration form. Fill it out:

#### Basic Settings:
```
Name: skilleval-api
Region: Oregon (US West) or closest to you
Branch: main
Root Directory: server
```

#### Build & Deploy:
```
Runtime: Node
Build Command: npm install && npm run build
Start Command: node dist/server.js
```

#### Instance Type:
```
Select: Free
```

✅ **Done!** Basic config complete.

---

### STEP 5: Add Environment Variables (3 minutes)

Scroll down to **"Environment Variables"** section.

Click **"Add Environment Variable"** and add these one by one:

```
NODE_ENV = production
PORT = 10000
SUPABASE_URL = https://ksjgsgebjnpwyycnptom.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzamdzZ2Viam5wd3l5Y25wdG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMzM5NDEsImV4cCI6MjA4NDYwOTk0MX0.R4w_7BJ7AgzegkpCaJZji154NFlmzjjnOs3VkH4eYjU
CORS_ORIGIN = https://skillevaluate.web.app
```

**Optional (for AI features)**:
```
OPENAI_API_KEY = your_openai_key_here
GROQ_API_KEY = your_groq_key_here
DEEPSEEK_API_KEY = your_deepseek_key_here
```

**Note**: If you don't have AI keys, skip them for now. Server will still work.

✅ **Done!** Environment variables added.

---

### STEP 6: Deploy! (1 minute)

1. **Scroll to bottom**
2. **Click "Create Web Service"**
3. **Wait for deployment** (~5-10 minutes)

You'll see:
- ⏳ Building...
- ⏳ Deploying...
- ✅ Live!

Your server URL will be:
```
https://skilleval-api.onrender.com
```

✅ **Done!** Server is live!

---

### STEP 7: Test Server (1 minute)

1. **Copy your server URL** from Render dashboard
2. **Open in browser**: `https://skilleval-api.onrender.com/api/health`
3. **You should see**:
```json
{
  "status": "ok",
  "timestamp": "2026-01-29T...",
  "version": "2.0.0"
}
```

✅ **Done!** Server is working!

---

### STEP 8: Update Client to Use Server (5 minutes)

Now connect your client to the deployed server.

1. **Update `client/.env`**:
```env
# Add or update this line
VITE_API_URL=https://skilleval-api.onrender.com/api
```

2. **Rebuild client**:
```bash
cd client
npm run build
```

3. **Redeploy to Firebase**:
```bash
firebase deploy --only hosting
```

✅ **Done!** Client now uses deployed server!

---

### STEP 9: Test Everything (2 minutes)

1. **Open your site**: https://skillevaluate.web.app
2. **Go to a career page**
3. **Try AI question generation** (if you added AI keys)
4. **Check browser console** (F12) for errors

✅ **Done!** Everything working!

---

## 🎯 QUICK REFERENCE

### Your URLs:
- **Client**: https://skillevaluate.web.app
- **Server**: https://skilleval-api.onrender.com
- **Server Health**: https://skilleval-api.onrender.com/api/health
- **Database**: Supabase (already configured)

### Render Dashboard:
- **URL**: https://dashboard.render.com
- **View logs**: Click on your service → "Logs" tab
- **Restart**: Click "Manual Deploy" → "Deploy latest commit"

---

## 🐛 TROUBLESHOOTING

### Server not starting?
1. Check Render logs (Logs tab)
2. Verify environment variables
3. Check build command succeeded

### Build failing?
1. Make sure `server/package.json` exists
2. Check `server/tsconfig.json` exists
3. Verify `npm run build` works locally

### Server running but errors?
1. Check Render logs for errors
2. Verify Supabase URL and key
3. Test health endpoint

### Client can't connect to server?
1. Verify `VITE_API_URL` in client/.env
2. Check CORS_ORIGIN in server env vars
3. Rebuild and redeploy client

---

## 💰 RENDER FREE TIER

### What you get:
- ✅ 750 hours/month (enough for 1 service)
- ✅ Automatic HTTPS
- ✅ Automatic deploys from GitHub
- ⚠️ Sleeps after 15 minutes of inactivity
- ⚠️ First request after sleep takes 30-60 seconds

### Limitations:
- Server sleeps after 15 min inactivity
- 512 MB RAM
- Shared CPU

### Upgrade ($7/month):
- No sleep
- More RAM
- Dedicated resources

---

## 📝 AFTER DEPLOYMENT

### Monitor your server:
1. **Render Dashboard** → Your service → "Logs"
2. **Check health**: https://skilleval-api.onrender.com/api/health
3. **View metrics**: Render dashboard shows CPU, memory usage

### Update server:
1. **Push changes to GitHub**:
```bash
git add .
git commit -m "Update server"
git push
```
2. **Render auto-deploys** (or click "Manual Deploy")

### Get AI API keys (optional):
- **OpenAI**: https://platform.openai.com/api-keys
- **Groq**: https://console.groq.com/keys
- **DeepSeek**: https://platform.deepseek.com/api_keys

---

## ✅ CHECKLIST

- [ ] Step 1: Create Render account
- [ ] Step 2: Push code to GitHub
- [ ] Step 3: Create Web Service
- [ ] Step 4: Configure service
- [ ] Step 5: Add environment variables
- [ ] Step 6: Deploy
- [ ] Step 7: Test server health endpoint
- [ ] Step 8: Update client with server URL
- [ ] Step 9: Test everything

---

## 🎉 SUCCESS!

Once complete, you'll have:
- ✅ Client on Firebase
- ✅ Server on Render
- ✅ Database on Supabase
- ✅ Full-stack app deployed!

**Total time**: ~20 minutes  
**Total cost**: $0/month (free tier)

---

**Need help?** Check Render logs or ask me!
