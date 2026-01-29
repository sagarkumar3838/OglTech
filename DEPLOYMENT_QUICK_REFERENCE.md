# 🚀 Deployment Quick Reference

## One-Command Deployment

### Vercel (Recommended)
```bash
DEPLOY_VERCEL.bat
```
**Result:** Live in 2 minutes at `https://your-app.vercel.app`

### Firebase
```bash
DEPLOY_FIREBASE.bat
```
**Result:** Live at `https://mentorai1998.web.app`

---

## Manual Deployment

### Step 1: Build
```bash
cd client
npm run build
```

### Step 2: Deploy

**Vercel:**
```bash
vercel --prod
```

**Firebase:**
```bash
firebase deploy --only hosting
```

**Netlify:**
```bash
netlify deploy --prod
```

---

## Environment Variables

### Required:
```env
VITE_SUPABASE_URL=https://ksjgsgebjnpwyycnptom.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
```

### Optional (Firebase Auth):
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
```

---

## Platform URLs

### Vercel
- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs

### Firebase
- Console: https://console.firebase.google.com/
- Your Project: https://console.firebase.google.com/project/mentorai1998

### Netlify
- Dashboard: https://app.netlify.com/
- Docs: https://docs.netlify.com/

---

## Troubleshooting

### Build Fails
```bash
cd client
rmdir /s /q node_modules dist
npm install
npm run build
```

### CLI Not Found
```bash
# Vercel
npm install -g vercel

# Firebase
npm install -g firebase-tools

# Netlify
npm install -g netlify-cli
```

### Environment Variables Not Working
- Make sure they start with `VITE_`
- Restart dev server after changes
- Check spelling and values

---

## Quick Commands

| Action | Command |
|--------|---------|
| Build | `cd client && npm run build` |
| Deploy Vercel | `DEPLOY_VERCEL.bat` |
| Deploy Firebase | `DEPLOY_FIREBASE.bat` |
| Deploy Menu | `DEPLOY_MENU.bat` |
| Test Build | `cd client && npm run preview` |

---

## Post-Deployment

1. ✅ Test live app
2. ✅ Check all features work
3. ✅ Verify environment variables
4. ✅ Test authentication
5. ✅ Test evaluations
6. ✅ Check dashboard

---

## Free Tier Limits

### Vercel
- 100GB bandwidth/month
- Unlimited projects
- Automatic SSL

### Firebase
- 10GB storage
- 360MB/day bandwidth
- Free SSL

### Netlify
- 100GB bandwidth/month
- 300 build minutes/month
- Free SSL

---

## Support Links

- **Vercel Support:** https://vercel.com/support
- **Firebase Support:** https://firebase.google.com/support
- **Netlify Support:** https://www.netlify.com/support/

---

**Need help? Check DEPLOY_NOW.md for detailed instructions!**
