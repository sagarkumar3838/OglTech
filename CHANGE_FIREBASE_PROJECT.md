# 🔄 CHANGE FIREBASE PROJECT

## 📋 STEPS TO CHANGE FIREBASE PROJECT

### Step 1: Create New Firebase Project (5 minutes)

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Click "Add Project"**
3. **Enter Project Name**: (e.g., `skilleval-app`, `ogltech-app`, etc.)
4. **Disable Google Analytics** (optional, can enable later)
5. **Click "Create Project"**
6. **Wait for project creation**

### Step 2: Get New Project ID

After project is created:
1. Go to **Project Settings** (gear icon)
2. Copy your **Project ID** (e.g., `skilleval-app-12345`)
3. Keep this handy for next steps

### Step 3: Update Local Configuration

Run this command to change Firebase project:

```bash
firebase use --add
```

This will:
1. Show list of your Firebase projects
2. Let you select the new project
3. Give it an alias (use "default")
4. Update `.firebaserc` file automatically

**OR** manually update `.firebaserc`:

```json
{
  "projects": {
    "default": "your-new-project-id"
  }
}
```

### Step 4: Initialize Firebase Hosting (if needed)

If you haven't set up hosting in the new project:

```bash
firebase init hosting
```

Select:
- Use existing project: [your new project]
- Public directory: `client/dist`
- Single-page app: `Yes`
- Automatic builds: `No`

### Step 5: Update Client Environment Variables

Update `client/.env` with new Firebase config:

1. Go to Firebase Console → Project Settings
2. Scroll to "Your apps" section
3. Click "Web app" (</> icon)
4. Register app (name: "SkillEval Client")
5. Copy the config values

Update `client/.env`:

```env
# Firebase Configuration (for Authentication)
VITE_FIREBASE_API_KEY=your_new_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-new-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-new-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-new-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Supabase Configuration (keep same)
VITE_SUPABASE_URL=https://ksjgsgebjnpwyycnptom.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzamdzZ2Viam5wd3l5Y25wdG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMzM5NDEsImV4cCI6MjA4NDYwOTk0MX0.R4w_7BJ7AgzegkpCaJZji154NFlmzjjnOs3VkH4eYjU
```

### Step 6: Enable Firebase Authentication

1. Go to Firebase Console → Authentication
2. Click "Get Started"
3. Enable "Email/Password" sign-in method
4. Save

### Step 7: Deploy to New Project

```bash
# Build client
cd client
npm run build

# Deploy to new Firebase project
firebase deploy --only hosting
```

Your app will be live at:
```
https://your-new-project-id.web.app
```

### Step 8: Update Supabase URLs

1. Go to Supabase Dashboard
2. Settings → API
3. Update Site URL: `https://your-new-project-id.web.app`
4. Update Redirect URLs:
   - `https://your-new-project-id.web.app`
   - `https://your-new-project-id.web.app/auth/callback`
   - `https://your-new-project-id.web.app/dashboard`

---

## 🚀 QUICK CHANGE SCRIPT

Run these commands in order:

```bash
# 1. Add new Firebase project
firebase use --add

# 2. Select your new project from the list

# 3. Build client
cd client
npm run build

# 4. Deploy
firebase deploy --only hosting

# 5. Get your new URL
firebase hosting:sites:list
```

---

## 📝 WHAT GETS CHANGED

### Files Updated:
- ✅ `.firebaserc` - Project ID
- ✅ `client/.env` - Firebase config
- ⚠️ `client/.env.production` - Create if deploying

### What Stays Same:
- ✅ Supabase configuration
- ✅ Server code
- ✅ Database
- ✅ All features

---

## 🔐 NEW FIREBASE CONFIG

After creating new project, you'll get:

```javascript
// Firebase Config (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

Copy these values to `client/.env`

---

## ✅ VERIFICATION CHECKLIST

After changing project:

- [ ] `.firebaserc` has new project ID
- [ ] `client/.env` has new Firebase config
- [ ] Firebase Authentication enabled
- [ ] Client builds successfully
- [ ] Deployment succeeds
- [ ] New URL works: `https://your-project.web.app`
- [ ] Can sign up/login
- [ ] Supabase URLs updated
- [ ] All features work

---

## 🐛 TROUBLESHOOTING

### Problem: "Project not found"
**Solution**: Run `firebase login` and `firebase use --add`

### Problem: "Permission denied"
**Solution**: Make sure you're logged in with correct Google account

### Problem: "Hosting not initialized"
**Solution**: Run `firebase init hosting`

### Problem: Authentication not working
**Solution**: Enable Email/Password in Firebase Console → Authentication

---

## 💡 RECOMMENDED PROJECT NAMES

Good project names:
- `skilleval-app`
- `ogltech-platform`
- `skill-assessment-app`
- `learning-platform-app`

Avoid:
- Names with spaces
- Special characters
- Very long names

---

## 📞 QUICK COMMANDS

```bash
# List all your Firebase projects
firebase projects:list

# Switch to different project
firebase use project-id

# Check current project
firebase use

# Deploy to current project
firebase deploy --only hosting

# View deployment URL
firebase hosting:sites:list
```

---

## 🎯 AFTER CHANGING PROJECT

Your new URLs will be:
- **Client**: `https://your-new-project-id.web.app`
- **Server**: Keep on Render (no change needed)
- **Database**: Supabase (no change needed)

Only the client hosting URL changes!

---

**Current Project**: mentorai1998  
**New Project**: [Your choice]  
**Time to Change**: ~10 minutes  
**Difficulty**: Easy
