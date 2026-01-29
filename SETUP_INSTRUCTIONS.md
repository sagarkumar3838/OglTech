# OGL Skill Evaluation Platform - Setup Instructions

## 🚀 Quick Start (Any Platform)

### Step 1: Verify Prerequisites

```bash
# Check Node.js (should be v18+)
node --version

# Check npm
npm --version
```

If not installed, download from [nodejs.org](https://nodejs.org/)

### Step 2: Install Dependencies

```bash
# Install all dependencies at once
npm run install:all
```

Or manually:
```bash
# Root dependencies
npm install

# Client dependencies
cd client
npm install

# Server dependencies
cd ../server
npm install
cd ..
```

### Step 3: Verify Setup

```bash
# Run verification script
npm run verify
```

This will check:
- ✅ Node.js version
- ✅ npm installation
- ✅ Dependencies installed
- ✅ Directory structure
- ⚠️ Environment files (warnings if missing)

### Step 4: Configure Environment

#### Copy Example Files

**Windows (PowerShell)**:
```powershell
Copy-Item .env.example .env
Copy-Item client\.env.example client\.env
```

**macOS/Linux (Bash)**:
```bash
cp .env.example .env
cp client/.env.example client/.env
```

#### Edit Configuration Files

Edit `.env` (root) and `client/.env` with your credentials:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# AI Provider Keys (at least ONE required)
GOOGLE_API_KEY=your_google_api_key
GROQ_API_KEY=your_groq_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key
```

### Step 5: Seed Career Data

```bash
# Seed all 8 OGL career paths
npm run seed:careers
```

This creates:
- OGL Developer
- OGL Tester
- OGL Frontend Developer
- OGL Backend Developer
- OGL DevOps Developer
- OGL Cloud Developer
- OGL QA Developer
- OGL Content Developer

### Step 6: Start Development Servers

#### Option A: Start Both Servers (Recommended)
```bash
npm run dev
```

#### Option B: Start Separately

**Terminal 1 - Client**:
```bash
npm run dev:client
# Runs on http://localhost:3000
```

**Terminal 2 - Server** (if using local server):
```bash
npm run dev:server
# Runs on http://localhost:5001
```

### Step 7: Access Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📋 Platform-Specific Instructions

### Windows

#### Using PowerShell (Recommended)
```powershell
# Navigate to project
cd C:\path\to\oglTech

# Install dependencies
npm run install:all

# Copy environment files
Copy-Item .env.example .env
Copy-Item client\.env.example client\.env

# Edit .env files with your editor
notepad .env
notepad client\.env

# Seed careers
npm run seed:careers

# Start development
npm run dev
```

#### Using CMD
```cmd
cd C:\path\to\oglTech
npm run install:all
copy .env.example .env
copy client\.env.example client\.env
npm run seed:careers
npm run dev
```

### macOS

#### Using Terminal
```bash
# Navigate to project
cd ~/path/to/oglTech

# Install dependencies
npm run install:all

# Copy environment files
cp .env.example .env
cp client/.env.example client/.env

# Edit .env files
nano .env
nano client/.env
# Or use your preferred editor: code, vim, etc.

# Seed careers
npm run seed:careers

# Start development
npm run dev
```

### Linux (Ubuntu/Debian)

```bash
# Navigate to project
cd ~/path/to/oglTech

# Install dependencies
npm run install:all

# Copy environment files
cp .env.example .env
cp client/.env.example client/.env

# Edit .env files
nano .env
nano client/.env

# Seed careers
npm run seed:careers

# Start development
npm run dev
```

## 🔧 Troubleshooting

### Issue: "Command not found: npm"

**Solution**: Install Node.js from [nodejs.org](https://nodejs.org/)

### Issue: "Port 3000 already in use"

**Windows**:
```powershell
# Find and kill process
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

**macOS/Linux**:
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9
```

### Issue: "Firebase: Error (auth/invalid-api-key)"

**Solution**:
1. Verify `client/.env` file exists
2. Check API keys are correct (no extra spaces)
3. Restart development server

### Issue: "Module not found"

**Solution**:
```bash
# Delete and reinstall dependencies
cd client
rm -rf node_modules package-lock.json
npm install

cd ../server
rm -rf node_modules package-lock.json
npm install
```

**Windows**:
```powershell
cd client
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install

cd ..\server
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

### Issue: "Permission denied" (Linux/macOS)

**Solution**:
```bash
# Configure npm to use user directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

## 📦 Available Scripts

### Root Level
```bash
npm run verify          # Verify setup
npm run install:all     # Install all dependencies
npm run dev            # Start both client and server
npm run dev:client     # Start client only
npm run dev:server     # Start server only
npm run build          # Build for production
npm run seed:careers   # Seed career data
npm run deploy         # Deploy to Firebase
```

### Client Level
```bash
cd client
npm run dev            # Start development server
npm run build          # Build for production
npm run preview        # Preview production build
```

### Server Level
```bash
cd server
npm run dev            # Start development server
npm run build          # Compile TypeScript
npm run seed:ogl-careers  # Seed career data
```

## 🌐 Accessing the Application

After starting the development servers:

- **Home Page**: http://localhost:3000/
- **Dashboard**: http://localhost:3000/dashboard (requires login)
- **Careers**: http://localhost:3000/careers
- **Login**: http://localhost:3000/login

## 🎯 First-Time User Flow

1. **Visit Home Page** → http://localhost:3000/
2. **Browse Careers** → Click "Careers" in navigation
3. **Select a Career** → Click any career card
4. **Login/Signup** → Create account or login
5. **Start Evaluation** → Click "BASIC" level (unlocked by default)
6. **Take Test** → Answer 10 questions
7. **View Scorecard** → See results and feedback
8. **Check Dashboard** → View progress at /dashboard

## ✅ Verification Checklist

After setup, verify:

- [ ] Node.js v18+ installed
- [ ] All dependencies installed (client & server)
- [ ] Environment files configured
- [ ] Career data seeded (8 careers)
- [ ] Client runs on port 3000
- [ ] Server runs on port 5001 (if applicable)
- [ ] Firebase connection works
- [ ] Can create account/login
- [ ] Can view careers page
- [ ] Can start evaluation
- [ ] Can view scorecard
- [ ] Dashboard shows progress

## 🐳 Docker Alternative (Optional)

If you prefer Docker:

```bash
# Build and run with Docker Compose
docker-compose up

# Access application
# http://localhost:3000
```

## 📚 Additional Resources

- **CROSS_PLATFORM_GUIDE.md** - Detailed platform compatibility
- **GETTING_STARTED.md** - General getting started guide
- **README.md** - Project overview
- **FINAL_IMPLEMENTATION_SUMMARY.md** - Complete feature list

## 🆘 Getting Help

If you encounter issues:

1. Run verification: `npm run verify`
2. Check troubleshooting section above
3. Review browser console for errors
4. Verify environment variables
5. Check Firebase console for errors

## 🎉 Success!

If you can access http://localhost:3000 and see the home page, you're all set!

Next steps:
1. Create an account
2. Browse the 8 OGL career paths
3. Start with a BASIC level evaluation
4. Track your progress on the dashboard

Happy learning! 🚀
