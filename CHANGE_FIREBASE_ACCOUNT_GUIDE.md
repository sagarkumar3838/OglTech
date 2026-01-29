# 🔄 Change Firebase Account & Project Guide

## Quick Method: Use the Script

```bash
SWITCH_FIREBASE_ACCOUNT.bat
```

This script will guide you through the entire process.

---

## Manual Method: Step-by-Step

### Step 1: Logout from Current Account

```bash
firebase logout
```

### Step 2: Login with New Gmail Account

```bash
firebase login
```

A browser window will open. Sign in with your **new Gmail account**.

### Step 3: Create New Firebase Project

#### Via Firebase Console (Recommended):

1. Go to https://console.firebase.google.com/
2. Click "Add Project"
3. Enter project name:
   - Example: `skilleval`
   - Example: `my-assessment-platform`
   - Example: `talent-evaluation-app`
4. Click Continue
5. Disable Google Analytics (optional)
6. Click "Create Project"
7. **Copy your Project ID** (shown in project settings)

### Step 4: Update `.firebaserc`

Replace the content with your new project ID:

```json
{
  "projects": {
    "default": "your-new-project-id"
  }
}
```

### Step 5: Get New Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click the Web icon `</>`
4. Register your app
5. Copy the configuration

### Step 6: Update `client/.env`

Update with your new Firebase config:

```env
# New Firebase Configuration
VITE_FIREBASE_API_KEY=your_new_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-new-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-new-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-new-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_new_sender_id
VITE_FIREBASE_APP_ID=your_new_app_id

# Keep Supabase config (no change needed)
VITE_SUPABASE_URL=https://ksjgsgebjnpwyycnptom.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### Step 7: Initialize Firebase Services (Optional)

If you want to reconfigure services:

```bash
firebase init
```

Select:
- ✅ Hosting
- ✅ Functions
- ✅ Firestore (if using)

### Step 8: Deploy to New Project

```bash
DEPLOY_FULLSTACK_FIREBASE.bat
```

---

## Your New URLs

After deployment, your app will be at:

- **Frontend:** `https://your-new-project-id.web.app`
- **Backend:** `https://us-central1-your-new-project-id.cloudfunctions.net/api`

---

## Alternative: Use Vercel Instead

If you want to avoid Firebase completely, deploy to Vercel:

### Frontend to Vercel:

```bash
cd client
vercel --prod
```

### Backend to Render:

1. Go to https://dashboard.render.com/
2. New + → Blueprint
3. Connect your Git repo
4. Auto-deploys from `render.yaml`

---

## Comparison: Firebase vs Vercel

| Feature | Firebase | Vercel |
|---------|----------|--------|
| **Account** | Gmail required | Any email |
| **Setup** | More steps | Simpler |
| **Free Tier** | 125K calls/mo | Unlimited |
| **Custom Domain** | Free | Free |
| **Backend** | Functions | Need separate (Render) |

---

## Troubleshooting

### Can't logout?

```bash
# Force logout
firebase logout --force

# Clear cache
rmdir /s /q %USERPROFILE%\.config\firebase
```

### Wrong account logged in?

```bash
# Check current account
firebase login:list

# Use specific account
firebase login:use your-email@gmail.com
```

### Project not found?

```bash
# List your projects
firebase projects:list

# Use specific project
firebase use your-project-id
```

---

## Quick Commands

| Action | Command |
|--------|---------|
| Logout | `firebase logout` |
| Login | `firebase login` |
| List projects | `firebase projects:list` |
| Switch project | `firebase use project-id` |
| Check current | `firebase projects:list` |
| Create project | Via console |

---

## Need Help?

Run the automated script:

```bash
SWITCH_FIREBASE_ACCOUNT.bat
```

It will guide you through everything!

---

## After Switching

1. ✅ Update `.firebaserc` with new project ID
2. ✅ Update `client/.env` with new Firebase config
3. ✅ Deploy: `DEPLOY_FULLSTACK_FIREBASE.bat`
4. ✅ Test your new URLs
5. ✅ Update any external links

---

**Ready to switch? Run:**

```bash
SWITCH_FIREBASE_ACCOUNT.bat
```
