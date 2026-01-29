# 🚀 Deploy SkillEval NOW - Quick Start

Choose your deployment method and follow the steps.

## ⚡ Fastest: Vercel (Recommended)

### Option A: Using Script (Easiest)

```bash
# Just run this:
DEPLOY_VERCEL.bat
```

That's it! Your app will be live in 2 minutes.

### Option B: Manual Steps

```bash
# 1. Install Vercel CLI (one time only)
npm install -g vercel

# 2. Build
cd client
npm run build

# 3. Deploy
vercel --prod
```

**Your app is live!** 🎉

---

## 🔥 Already Configured: Firebase

### Using Script

```bash
DEPLOY_FIREBASE.bat
```

### Manual Steps

```bash
# 1. Build
cd client
npm run build
cd ..

# 2. Deploy
firebase deploy --only hosting
```

**Live at:** `https://mentorai1998.web.app`

---

## 🎯 Which Should I Choose?

### Choose Vercel if:
- ✅ You want the fastest deployment
- ✅ You want automatic deployments from Git
- ✅ You want the best performance
- ✅ You want 100GB bandwidth/month

### Choose Firebase if:
- ✅ You're already using Firebase Auth
- ✅ You want to use Firebase Functions
- ✅ You're familiar with Firebase

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure:

- [x] ✅ 406 errors fixed (Done!)
- [x] ✅ Media table populated (Done!)
- [x] ✅ RLS policies configured (Done!)
- [ ] Environment variables ready
- [ ] App tested locally

---

## 🔐 Environment Variables Needed

### For Vercel:

After first deployment, add these in Vercel Dashboard:

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Settings > Environment Variables
4. Add:

```
VITE_SUPABASE_URL=https://ksjgsgebjnpwyycnptom.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### For Firebase:

Already configured in `client/.env`

---

## 🚀 Deploy Right Now!

### Vercel (2 minutes):

```bash
DEPLOY_VERCEL.bat
```

### Firebase (2 minutes):

```bash
DEPLOY_FIREBASE.bat
```

---

## 🎉 After Deployment

1. **Test your live app**
   - Sign up
   - Take an evaluation
   - Check dashboard

2. **Share the URL**
   - Send to users
   - Add to portfolio
   - Share on social media

3. **Optional: Custom Domain**
   - Vercel: Settings > Domains
   - Firebase: Hosting > Add custom domain

---

## 🆘 Need Help?

### Build fails?

```bash
cd client
rmdir /s /q node_modules
npm install
npm run build
```

### Deployment fails?

Check:
- Node.js version (should be 18+)
- Internet connection
- CLI tool installed

### App not working after deployment?

Check:
- Environment variables are set
- Supabase URL is correct
- Browser console for errors

---

## 💡 Pro Tips

1. **Automatic Deployments**
   - Push to GitHub
   - Connect Vercel/Firebase to your repo
   - Auto-deploy on every push

2. **Preview Deployments**
   - Vercel creates preview URLs for branches
   - Test before going live

3. **Monitoring**
   - Check Vercel Analytics
   - Monitor Supabase usage

---

**Ready? Run `DEPLOY_VERCEL.bat` now!** 🚀
