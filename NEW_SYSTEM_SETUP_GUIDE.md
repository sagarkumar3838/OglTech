# 🖥️ Setup on New System Guide

Complete guide for setting up SkillEval on a different computer.

---

## 📋 Prerequisites

### Required Software:

1. **Node.js 18 or higher**
   - Download: https://nodejs.org/
   - Choose LTS version
   - Verify: `node --version`

2. **npm** (comes with Node.js)
   - Verify: `npm --version`

3. **Git** (optional, for cloning)
   - Download: https://git-scm.com/

---

## 🚀 Quick Setup (Automated)

```bash
SETUP_NEW_SYSTEM.bat
```

This will:
1. ✅ Check prerequisites
2. ✅ Create environment files
3. ✅ Install all dependencies
4. ✅ Test builds
5. ✅ Prepare for testing

---

## 📦 Manual Setup Steps

### Step 1: Transfer Project Files

#### Option A: Via Git (Recommended)

```bash
git clone your-repository-url
cd your-project-name
```

#### Option B: Via ZIP File

1. Compress project folder on original system
2. Transfer ZIP to new system
3. Extract to desired location

#### Option C: Via USB/Network Drive

1. Copy entire project folder
2. Paste to new system

### Step 2: Install Node.js

1. Download from https://nodejs.org/
2. Run installer
3. Follow installation wizard
4. Restart terminal/command prompt
5. Verify installation:

```bash
node --version
npm --version
```

Should show v18.x.x or higher

### Step 3: Setup Environment Files

#### Copy Environment Files:

You need these files from your original system:

```
client/.env
server/.env (if exists)
.env (if exists)
```

#### Or Create New Ones:

**client/.env:**
```env
# Supabase
VITE_SUPABASE_URL=https://ksjgsgebjnpwyycnptom.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Firebase (if using)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# API URL (for local testing)
VITE_API_URL=http://localhost:5001/api
```

### Step 4: Install Dependencies

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install

# Go back to root
cd ..
```

This may take 5-10 minutes depending on internet speed.

### Step 5: Verify Installation

```bash
# Check client
cd client
npm list --depth=0

# Check server
cd ../server
npm list --depth=0
```

---

## 🧪 Test the Setup

### Run Automated Test:

```bash
TEST_BEFORE_DEPLOYMENT.bat
```

### Or Manual Test:

#### Terminal 1 - Backend:
```bash
cd server
npm run dev
```

#### Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

#### Open Browser:
Visit: `http://localhost:3001`

---

## 🔧 Troubleshooting

### Issue: Node.js not found

**Solution:**
1. Install Node.js from https://nodejs.org/
2. Restart terminal
3. Verify: `node --version`

### Issue: npm install fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### Issue: Permission errors (Windows)

**Solution:**
Run Command Prompt as Administrator

### Issue: Port already in use

**Solution:**
```bash
# Find process using port 3001
netstat -ano | findstr :3001

# Kill the process
taskkill /PID <PID> /F
```

### Issue: Environment variables not working

**Solution:**
1. Check `.env` file exists in `client/` folder
2. Verify all values are correct
3. Restart dev servers
4. Clear browser cache

### Issue: Build fails

**Solution:**
```bash
# Delete node_modules and reinstall
cd client
rmdir /s /q node_modules
npm install

cd ../server
rmdir /s /q node_modules
npm install
```

---

## 📝 Checklist for New System

- [ ] Node.js 18+ installed
- [ ] npm working
- [ ] Project files transferred
- [ ] Environment files created/copied
- [ ] Client dependencies installed
- [ ] Server dependencies installed
- [ ] Backend starts successfully
- [ ] Frontend starts successfully
- [ ] Can access http://localhost:3001
- [ ] No console errors
- [ ] Database connection works

---

## 🌐 Network Configuration

### If Testing on Local Network:

#### On Host Machine:

1. Find your IP address:
```bash
ipconfig
```
Look for IPv4 Address (e.g., 192.168.1.100)

2. Update `client/.env`:
```env
VITE_API_URL=http://192.168.1.100:5001/api
```

3. Start servers:
```bash
# Backend
cd server
npm run dev

# Frontend (in new terminal)
cd client
npm run dev -- --host
```

#### On Other Devices:

Visit: `http://192.168.1.100:3001`

---

## 💾 Backup Important Files

Before transferring, backup these files:

```
client/.env
server/.env
.firebaserc
firebase.json
package.json
package-lock.json
```

---

## 🔐 Security Notes

### Don't Share:

- ❌ `.env` files (contain secrets)
- ❌ `node_modules/` folders (too large)
- ❌ `.git/` folder (if contains sensitive data)
- ❌ API keys or passwords

### Do Share:

- ✅ Source code
- ✅ `.env.example` files
- ✅ Documentation
- ✅ Configuration files

---

## 📊 System Requirements

### Minimum:
- **OS:** Windows 10, macOS 10.15, Linux
- **RAM:** 4GB
- **Storage:** 2GB free space
- **Internet:** Required for npm install

### Recommended:
- **OS:** Windows 11, macOS 12+, Ubuntu 20.04+
- **RAM:** 8GB+
- **Storage:** 5GB+ free space
- **Internet:** Broadband connection

---

## 🚀 After Setup

### Test Everything:

```bash
TEST_BEFORE_DEPLOYMENT.bat
```

### Deploy:

```bash
DEPLOY_FULLSTACK_FIREBASE.bat
```

---

## 📞 Need Help?

### Common Commands:

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# List installed packages
npm list --depth=0

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Useful Links:

- Node.js: https://nodejs.org/
- npm: https://www.npmjs.com/
- Vite: https://vitejs.dev/
- React: https://react.dev/

---

## ✅ Setup Complete!

Your SkillEval app is now ready on the new system!

**Next steps:**
1. Run `TEST_BEFORE_DEPLOYMENT.bat`
2. Test all features
3. Deploy when ready

---

**Quick Start:**

```bash
# Setup
SETUP_NEW_SYSTEM.bat

# Test
TEST_BEFORE_DEPLOYMENT.bat

# Deploy
DEPLOY_FULLSTACK_FIREBASE.bat
```
