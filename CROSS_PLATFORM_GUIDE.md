# Cross-Platform Compatibility Guide

## ✅ Platform Support

This application is designed to run on:
- ✅ **Windows** (Windows 10/11)
- ✅ **macOS** (macOS 10.15+)
- ✅ **Linux** (Ubuntu, Debian, Fedora, etc.)

## 🔧 Prerequisites (All Platforms)

### Required Software

1. **Node.js** (v18 or higher)
   - Windows: Download from [nodejs.org](https://nodejs.org/)
   - macOS: `brew install node` or download from nodejs.org
   - Linux: `sudo apt install nodejs npm` or use nvm

2. **npm** (comes with Node.js)
   - Verify: `npm --version`

3. **Git** (optional but recommended)
   - Windows: Download from [git-scm.com](https://git-scm.com/)
   - macOS: `brew install git` or Xcode Command Line Tools
   - Linux: `sudo apt install git`

4. **Firebase CLI** (optional, for deployment)
   - All platforms: `npm install -g firebase-tools`

## 📦 Installation Steps (All Platforms)

### 1. Clone or Download Project

```bash
# Using Git
git clone <repository-url>
cd oglTech

# Or download and extract ZIP file
```

### 2. Install Dependencies

#### Client (Frontend)
```bash
cd client
npm install
```

#### Server (Backend)
```bash
cd server
npm install
```

### 3. Configure Environment Variables

#### Windows (PowerShell)
```powershell
# Copy example files
Copy-Item .env.example .env
Copy-Item client\.env.example client\.env
```

#### macOS/Linux (Bash/Zsh)
```bash
# Copy example files
cp .env.example .env
cp client/.env.example client/.env
```

### 4. Edit Environment Files

Edit `.env` and `client/.env` with your configuration:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# AI Provider Keys (at least one required)
GOOGLE_API_KEY=your_google_key
GROQ_API_KEY=your_groq_key
DEEPSEEK_API_KEY=your_deepseek_key
```

### 5. Seed Career Data

#### Windows (PowerShell)
```powershell
cd server
npm run seed:ogl-careers
```

#### macOS/Linux (Bash/Zsh)
```bash
cd server
npm run seed:ogl-careers
```

### 6. Start Development Servers

#### Windows (PowerShell)
```powershell
# Terminal 1: Start client
cd client
npm run dev

# Terminal 2: Start server (if using local server)
cd server
npm run dev
```

#### macOS/Linux (Bash/Zsh)
```bash
# Terminal 1: Start client
cd client
npm run dev

# Terminal 2: Start server (if using local server)
cd server
npm run dev
```

## 🌐 Browser Compatibility

### Supported Browsers
- ✅ **Chrome** (v90+)
- ✅ **Firefox** (v88+)
- ✅ **Safari** (v14+)
- ✅ **Edge** (v90+)
- ✅ **Opera** (v76+)

### Not Supported
- ❌ Internet Explorer (any version)

## 🔍 Platform-Specific Considerations

### Windows

#### Path Separators
- Uses backslash `\` for paths
- Code automatically handles this with Node.js path module

#### PowerShell vs CMD
- Recommended: **PowerShell** (better Unicode support)
- CMD works but may have display issues with emojis

#### Line Endings
- Git may convert line endings (CRLF vs LF)
- Configure Git: `git config --global core.autocrlf true`

#### Firewall
- May need to allow Node.js through Windows Firewall
- Allow when prompted during first run

### macOS

#### Xcode Command Line Tools
- Required for some npm packages
- Install: `xcode-select --install`

#### Homebrew (Recommended)
- Package manager for easy installation
- Install: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

#### Permissions
- May need `sudo` for global npm packages
- Or configure npm to use user directory

### Linux

#### Package Manager
- **Ubuntu/Debian**: `apt`
- **Fedora**: `dnf`
- **Arch**: `pacman`

#### Node.js Installation
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### Permissions
- Avoid using `sudo` with npm
- Configure npm prefix: `npm config set prefix ~/.npm-global`

## 🐳 Docker Support (Optional)

### Dockerfile (Client)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

### Dockerfile (Server)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5001
CMD ["npm", "run", "dev"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  client:
    build: ./client
    ports:
      - "3000:3000"
    volumes:
      - ./client:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development

  server:
    build: ./server
    ports:
      - "5001:5001"
    volumes:
      - ./server:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
```

## 🧪 Testing Cross-Platform Compatibility

### Test Checklist

#### All Platforms
- [ ] Node.js and npm installed
- [ ] Dependencies install without errors
- [ ] Environment variables configured
- [ ] Client starts on port 3000
- [ ] Server starts on port 5001 (if applicable)
- [ ] Firebase connection works
- [ ] AI providers respond
- [ ] Career data seeds successfully
- [ ] All pages load correctly
- [ ] Authentication works
- [ ] Evaluations can be completed
- [ ] Scorecards generate
- [ ] Dashboard displays progress

#### Windows-Specific
- [ ] PowerShell commands work
- [ ] Path separators handled correctly
- [ ] Emoji icons display properly
- [ ] Firewall allows connections

#### macOS-Specific
- [ ] Xcode tools installed
- [ ] Homebrew packages work
- [ ] Terminal commands execute
- [ ] Safari compatibility verified

#### Linux-Specific
- [ ] Package manager works
- [ ] Node.js version correct
- [ ] Permissions configured
- [ ] Display server available (for GUI)

## 🔧 Common Issues & Solutions

### Issue 1: Node.js Version Mismatch

**Problem**: "Error: The engine 'node' is incompatible"

**Solution**:
```bash
# Check version
node --version

# Should be v18 or higher
# Update Node.js or use nvm
nvm install 18
nvm use 18
```

### Issue 2: Permission Errors (Linux/macOS)

**Problem**: "EACCES: permission denied"

**Solution**:
```bash
# Don't use sudo, configure npm
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Issue 3: Port Already in Use

**Problem**: "Error: listen EADDRINUSE: address already in use :::3000"

**Solution**:
```bash
# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Issue 4: Firebase Connection Issues

**Problem**: "Firebase: Error (auth/invalid-api-key)"

**Solution**:
1. Verify `.env` files exist in both root and client directories
2. Check API keys are correct
3. Ensure no extra spaces in environment variables
4. Restart development server after changing .env

### Issue 5: Module Not Found

**Problem**: "Error: Cannot find module 'xyz'"

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Windows (PowerShell)
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

## 📱 Mobile Device Testing

### iOS (Safari)
- Test on iPhone/iPad
- Use Safari Developer Tools
- Check touch interactions
- Verify responsive design

### Android (Chrome)
- Test on Android device
- Use Chrome DevTools
- Check touch interactions
- Verify responsive design

### Responsive Testing
```bash
# Use browser DevTools
# Chrome: F12 → Toggle Device Toolbar
# Firefox: F12 → Responsive Design Mode
# Safari: Develop → Enter Responsive Design Mode
```

## 🌍 Internationalization (Future)

### Character Encoding
- All files use UTF-8 encoding
- Supports Unicode characters
- Emoji icons work on all platforms

### Locale Support
- Currently: English (en-US)
- Future: Multi-language support planned

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files to Git
- Use `.env.example` as template
- Keep API keys secure

### HTTPS in Production
- Use HTTPS for production deployment
- Configure SSL certificates
- Enable secure cookies

## 📊 Performance Optimization

### Build for Production

#### Client
```bash
cd client
npm run build
# Creates optimized build in dist/
```

#### Server
```bash
cd server
npm run build
# Compiles TypeScript to JavaScript
```

### Deployment Options

1. **Firebase Hosting** (Recommended)
   ```bash
   firebase deploy
   ```

2. **Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Netlify**
   ```bash
   npm install -g netlify-cli
   netlify deploy
   ```

4. **Traditional Server**
   - Use PM2 or systemd
   - Configure reverse proxy (nginx/Apache)
   - Set up SSL certificates

## ✅ Verification Script

Create a test script to verify installation:

```bash
#!/bin/bash
# verify-setup.sh

echo "🔍 Verifying OGL Skill Evaluation Platform Setup..."

# Check Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js installed: $(node --version)"
else
    echo "❌ Node.js not found"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    echo "✅ npm installed: $(npm --version)"
else
    echo "❌ npm not found"
    exit 1
fi

# Check client dependencies
if [ -d "client/node_modules" ]; then
    echo "✅ Client dependencies installed"
else
    echo "❌ Client dependencies missing"
    exit 1
fi

# Check server dependencies
if [ -d "server/node_modules" ]; then
    echo "✅ Server dependencies installed"
else
    echo "❌ Server dependencies missing"
    exit 1
fi

# Check environment files
if [ -f "client/.env" ]; then
    echo "✅ Client .env file exists"
else
    echo "⚠️  Client .env file missing"
fi

if [ -f ".env" ]; then
    echo "✅ Root .env file exists"
else
    echo "⚠️  Root .env file missing"
fi

echo ""
echo "🎉 Setup verification complete!"
echo "Run 'npm run dev' in client and server directories to start"
```

## 📞 Support & Troubleshooting

### Getting Help

1. **Check Documentation**
   - GETTING_STARTED.md
   - README.md
   - Platform-specific guides

2. **Common Issues**
   - Review this guide's troubleshooting section
   - Check browser console for errors
   - Verify environment variables

3. **System Requirements**
   - Ensure minimum versions met
   - Check available disk space
   - Verify network connectivity

## 🎯 Deployment Checklist

Before deploying to production:

- [ ] All dependencies installed
- [ ] Environment variables configured
- [ ] Career data seeded
- [ ] Build process successful
- [ ] Tests passing (if applicable)
- [ ] Security review completed
- [ ] Performance optimized
- [ ] Cross-browser tested
- [ ] Mobile responsive verified
- [ ] Backup strategy in place

## 🏆 Conclusion

This application is fully cross-platform compatible and can run on:
- ✅ Windows (PowerShell/CMD)
- ✅ macOS (Terminal/iTerm)
- ✅ Linux (Bash/Zsh)
- ✅ Docker containers
- ✅ Cloud platforms (Firebase, Vercel, Netlify)

Follow the platform-specific instructions above for smooth installation and operation on any system!
