# 🔄 Free Alternatives to Keep Your Server Awake

## Why You Need This
Render free tier sleeps after 15 minutes. These services ping your server every 5-10 minutes to keep it awake.

---

## ✅ OPTION 1: Cron-job.org (Recommended)

**Website**: https://cron-job.org

### Setup (2 minutes):
1. Go to https://cron-job.org/en/
2. Click **"Sign up"** (free, no credit card)
3. Verify email
4. Click **"Create cronjob"**
5. Fill in:
   - **Title**: Keep Render Awake
   - **URL**: `https://skilleval-api.onrender.com/api/health`
   - **Schedule**: Every 10 minutes
   - **Enabled**: ✅ Yes
6. Click **"Create"**

**Done!** Your server will be pinged every 10 minutes.

---

## ✅ OPTION 2: EasyCron

**Website**: https://www.easycron.com

### Setup (2 minutes):
1. Go to https://www.easycron.com/user/register
2. Sign up (free plan: 20 cron jobs)
3. Click **"+ Cron Job"**
4. Fill in:
   - **URL**: `https://skilleval-api.onrender.com/api/health`
   - **Cron Expression**: `*/10 * * * *` (every 10 minutes)
   - **Name**: Render Keep Alive
5. Click **"Create Cron Job"**

**Done!** Server stays awake.

---

## ✅ OPTION 3: Koyeb (Free Hosting Alternative)

**Website**: https://www.koyeb.com

### Why Koyeb:
- Free tier **never sleeps** (unlike Render)
- Same features as Render
- Easy GitHub deployment
- No credit card required

### Setup (10 minutes):
1. Go to https://app.koyeb.com/auth/signup
2. Sign up with GitHub
3. Click **"Create App"**
4. Select **"GitHub"**
5. Choose your repository: `sagarkumar3838/OglTech`
6. Configure:
   - **Name**: skilleval-api
   - **Branch**: main
   - **Build command**: `cd server && npm install && npm run build`
   - **Run command**: `cd server && node dist/server.js`
   - **Port**: 10000
7. Add environment variables (same as Render)
8. Click **"Deploy"**

**Benefit**: No sleep, no need for ping services!

---

## ✅ OPTION 4: GitHub Actions (Free)

Use GitHub's free automation to ping your server.

### Setup (5 minutes):

1. **Create workflow file**:

Create `.github/workflows/keep-alive.yml` in your repository:

```yaml
name: Keep Server Awake

on:
  schedule:
    # Runs every 10 minutes
    - cron: '*/10 * * * *'
  workflow_dispatch: # Allows manual trigger

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Server
        run: |
          curl -f https://skilleval-api.onrender.com/api/health || echo "Server is waking up"
```

2. **Commit and push**:
```bash
git add .github/workflows/keep-alive.yml
git commit -m "Add keep-alive workflow"
git push origin main
```

3. **Enable workflow**:
   - Go to your GitHub repo
   - Click **"Actions"** tab
   - Enable workflows if prompted

**Done!** GitHub will ping your server every 10 minutes for free.

---

## ✅ OPTION 5: Render Cron Job (Free)

Use Render's own cron job service (free tier).

### Setup (3 minutes):

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Cron Job"**
3. Connect your GitHub repo
4. Configure:
   - **Name**: keep-alive
   - **Command**: `curl https://skilleval-api.onrender.com/api/health`
   - **Schedule**: `*/10 * * * *` (every 10 minutes)
5. Click **"Create Cron Job"**

**Done!** Render pings itself.

---

## ✅ OPTION 6: BetterStack (formerly BetterUptime)

**Website**: https://betterstack.com/uptime

### Setup (3 minutes):
1. Go to https://betterstack.com/uptime
2. Sign up (free plan: 10 monitors)
3. Click **"Create Monitor"**
4. Fill in:
   - **URL**: `https://skilleval-api.onrender.com/api/health`
   - **Name**: Render Server
   - **Check frequency**: 10 minutes
5. Click **"Create Monitor"**

**Bonus**: Get email alerts if server goes down!

---

## ✅ OPTION 7: Freshping by Freshworks

**Website**: https://www.freshworks.com/website-monitoring/

### Setup (3 minutes):
1. Go to https://www.freshworks.com/website-monitoring/signup/
2. Sign up (free: 50 checks)
3. Click **"Add Check"**
4. Fill in:
   - **URL**: `https://skilleval-api.onrender.com/api/health`
   - **Check Name**: Render API
   - **Check Interval**: 10 minutes
5. Click **"Save"**

**Bonus**: Nice dashboard with uptime stats!

---

## 📊 Comparison

| Service | Free Tier | Setup Time | Best For |
|---------|-----------|------------|----------|
| **Cron-job.org** | Unlimited | 2 min | Simple, reliable |
| **EasyCron** | 20 jobs | 2 min | Multiple projects |
| **Koyeb** | Always-on hosting | 10 min | No sleep ever |
| **GitHub Actions** | 2000 min/month | 5 min | Already using GitHub |
| **Render Cron** | Free | 3 min | All-in-one Render |
| **BetterStack** | 10 monitors | 3 min | Monitoring + alerts |
| **Freshping** | 50 checks | 3 min | Nice dashboard |

---

## 🎯 My Recommendation

### For Quick Setup (2 minutes):
**Use Cron-job.org** - Simplest, most reliable

### For Best Performance (10 minutes):
**Use Koyeb** - Free tier never sleeps, no ping needed

### For GitHub Users (5 minutes):
**Use GitHub Actions** - Already have GitHub, why not?

---

## 🚀 Quick Start: Cron-job.org

Since UptimeRobot isn't working for you, here's the fastest alternative:

1. **Go to**: https://cron-job.org/en/
2. **Click**: "Sign up" (top right)
3. **Enter**: Email and password
4. **Verify**: Check email and click link
5. **Login**: Go back to cron-job.org
6. **Click**: "Create cronjob" (big button)
7. **Enter**:
   - Title: `Render Keep Alive`
   - URL: `https://skilleval-api.onrender.com/api/health`
   - Execution schedule: Select "Every 10 minutes"
8. **Click**: "Create"

**That's it!** Your server will stay awake 24/7.

---

## 🔧 GitHub Actions Setup (If You Prefer)

I can create the GitHub Actions workflow file for you right now:

```yaml
name: Keep Server Awake

on:
  schedule:
    - cron: '*/10 * * * *'  # Every 10 minutes
  workflow_dispatch:

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Render Server
        run: |
          echo "Pinging server..."
          curl -f https://skilleval-api.onrender.com/api/health
          echo "Server is awake!"
```

Want me to create this file in your repository?

---

## ✅ Verify It's Working

After setting up any service, check:

1. **Wait 10 minutes**
2. **Check Render logs**: https://dashboard.render.com → Your service → Logs
3. **Look for**: Regular health check requests every 10 minutes
4. **Test**: Try AI generation - should be instant (no 30-60 sec wait)

---

## 💡 Pro Tip

Use **multiple services** for redundancy:
- Cron-job.org (primary)
- GitHub Actions (backup)

If one fails, the other keeps your server awake!

---

**Choose one and set it up now - takes 2-5 minutes!**
