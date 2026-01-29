# 🧪 End-to-End Testing Guide

Complete testing guide before deployment and for running on different systems.

---

## 🚀 Quick Test (Automated)

```bash
TEST_BEFORE_DEPLOYMENT.bat
```

This will:
1. ✅ Install all dependencies
2. ✅ Build frontend and backend
3. ✅ Start both servers
4. ✅ Open browser for testing
5. ✅ Provide testing checklist

---

## 📋 Manual Testing Steps

### Step 1: Install Dependencies

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### Step 2: Start Backend Server

```bash
# Terminal 1: Backend
cd server
npm run dev
```

Backend will start at: `http://localhost:5001`

### Step 3: Start Frontend Server

```bash
# Terminal 2: Frontend
cd client
npm run dev
```

Frontend will start at: `http://localhost:3001`

### Step 4: Open Browser

Visit: `http://localhost:3001`

---

## ✅ Testing Checklist

### 1. Homepage Tests
- [ ] Homepage loads without errors
- [ ] Hero section displays correctly
- [ ] Navigation menu works
- [ ] All links are functional
- [ ] Animations work smoothly
- [ ] Responsive design works (resize browser)

### 2. Authentication Tests
- [ ] Sign up form appears
- [ ] Can create new account
- [ ] Email validation works
- [ ] Password requirements enforced
- [ ] Login form works
- [ ] Can login with credentials
- [ ] Logout works
- [ ] Session persists on refresh

### 3. Careers Page Tests
- [ ] Careers page loads
- [ ] All career paths display
- [ ] Career cards are clickable
- [ ] Career details show correctly
- [ ] Skills list displays
- [ ] "Start Evaluation" button works

### 4. Evaluation Tests
- [ ] Evaluation page loads
- [ ] Instructions dialog appears
- [ ] Timer starts correctly
- [ ] Questions load
- [ ] Can select answers
- [ ] Multiple choice works
- [ ] Fill-in-the-blank works (if applicable)
- [ ] "Next" button works
- [ ] "Previous" button works
- [ ] Question counter updates
- [ ] Tab switch detection works
- [ ] Warning system works
- [ ] Can submit evaluation
- [ ] Confirmation dialog appears

### 5. Scorecard Tests
- [ ] Scorecard page loads
- [ ] Score displays correctly
- [ ] Pass/Fail status shows
- [ ] Breakdown by topic shows
- [ ] Correct/incorrect answers shown
- [ ] Recommendations display
- [ ] Can download/print scorecard
- [ ] "Back to Dashboard" works

### 6. Dashboard Tests
- [ ] Dashboard loads
- [ ] User stats display
- [ ] Progress charts show
- [ ] Recent evaluations list
- [ ] Skill proficiency shows
- [ ] Achievements display
- [ ] Can navigate to other pages

### 7. Profile Tests
- [ ] Profile page loads
- [ ] User info displays
- [ ] Can edit profile
- [ ] Avatar upload works (if enabled)
- [ ] Settings can be changed
- [ ] Changes save correctly

### 8. AI Chat Tests (Optional)
- [ ] AI chat page loads
- [ ] Can send messages
- [ ] AI responds correctly
- [ ] Chat history persists
- [ ] Can clear chat
- [ ] Error handling works

### 9. Database Tests
- [ ] User data saves to Supabase
- [ ] Progress tracking works
- [ ] Questions load from database
- [ ] Media loads correctly
- [ ] No 406 errors in console

### 10. Performance Tests
- [ ] Page load time < 3 seconds
- [ ] No console errors
- [ ] No console warnings (critical)
- [ ] Images load properly
- [ ] Videos play correctly
- [ ] Smooth animations
- [ ] No memory leaks

---

## 🔍 Browser Console Checks

### Open Developer Tools (F12)

#### Console Tab:
- [ ] No red errors
- [ ] No critical warnings
- [ ] API calls succeed (200 status)
- [ ] No 404 errors
- [ ] No CORS errors

#### Network Tab:
- [ ] All requests succeed
- [ ] No failed requests (red)
- [ ] API responses are correct
- [ ] Images load (200 status)
- [ ] CSS/JS files load

#### Application Tab:
- [ ] LocalStorage has auth token
- [ ] Session data persists
- [ ] Cookies set correctly

---

## 🌐 Test on Different Browsers

Test on at least 2 browsers:

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)

---

## 📱 Responsive Design Tests

Test on different screen sizes:

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

Use Chrome DevTools (F12) → Toggle device toolbar

---

## 🔧 Backend API Tests

### Test Backend Health:

```bash
curl http://localhost:5001/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-27T...",
  "version": "2.0.0"
}
```

### Test API Endpoints:

```bash
# Test questions endpoint
curl http://localhost:5001/api/questions

# Test careers endpoint
curl http://localhost:5001/api/careers
```

---

## 🐛 Common Issues & Fixes

### Issue: Port already in use

```bash
# Kill process on port 3001 (frontend)
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Kill process on port 5001 (backend)
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

### Issue: Dependencies not installing

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
cd client
rmdir /s /q node_modules
npm install

cd ../server
rmdir /s /q node_modules
npm install
```

### Issue: Build fails

```bash
# Check Node.js version (should be 18+)
node --version

# Update Node.js if needed
# Download from: https://nodejs.org/
```

### Issue: Supabase connection fails

1. Check `.env` file has correct Supabase URL and keys
2. Verify Supabase project is active
3. Check RLS policies are configured
4. Test Supabase connection in browser console

### Issue: 406 errors

Run the fix we created earlier:
```bash
# In Supabase SQL Editor
fix-406-simple.sql
populate-media-table.sql
```

---

## 📦 Test Production Build Locally

Before deploying, test the production build:

### Build for Production:

```bash
# Build client
cd client
npm run build

# Build server
cd ../server
npm run build
```

### Preview Production Build:

```bash
# Preview client build
cd client
npm run preview
```

Visit: `http://localhost:4173`

---

## 🖥️ Run on Different System

### Prerequisites on New System:

1. **Install Node.js 18+**
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **Install Git** (optional, for cloning)
   - Download: https://git-scm.com/

### Transfer Project:

#### Option A: Via Git
```bash
git clone your-repo-url
cd your-project
```

#### Option B: Via ZIP
1. Compress your project folder
2. Transfer to new system
3. Extract

### Setup on New System:

```bash
# 1. Install dependencies
cd client
npm install

cd ../server
npm install

# 2. Copy environment files
# Copy .env files from old system
# Or create new ones with same values

# 3. Test
cd ..
TEST_BEFORE_DEPLOYMENT.bat
```

### Environment Files Needed:

```
client/.env
server/.env (if exists)
.env (root, if exists)
```

---

## 📝 Testing Report Template

After testing, document results:

```
TESTING REPORT
Date: [Date]
Tester: [Name]
System: [OS, Browser]

✅ PASSED TESTS:
- Homepage loads
- Authentication works
- Evaluations work
- Dashboard displays

❌ FAILED TESTS:
- [List any failures]

🐛 BUGS FOUND:
- [List any bugs]

📊 PERFORMANCE:
- Page load: [X] seconds
- API response: [X] ms

✅ READY FOR DEPLOYMENT: [YES/NO]
```

---

## 🚀 After Testing

If all tests pass:

```bash
DEPLOY_FULLSTACK_FIREBASE.bat
```

If tests fail:
1. Fix issues
2. Re-test
3. Document changes
4. Test again

---

## 💡 Pro Tips

1. **Test in Incognito Mode**
   - Ensures clean state
   - No cached data
   - Fresh session

2. **Check Network Speed**
   - Throttle network in DevTools
   - Test on slow connections
   - Ensure app works on 3G

3. **Test Error Scenarios**
   - Wrong password
   - Invalid email
   - Network offline
   - API errors

4. **Monitor Console**
   - Keep DevTools open
   - Watch for errors
   - Check API responses

5. **Test User Flows**
   - Complete full user journey
   - Sign up → Evaluate → Dashboard
   - Test all features

---

## 📞 Need Help?

If you encounter issues:

1. Check console for errors
2. Review server logs
3. Verify environment variables
4. Check Supabase connection
5. Review this testing guide

---

**Ready to test? Run:**

```bash
TEST_BEFORE_DEPLOYMENT.bat
```
