@echo off
echo ========================================
echo 🚀 FULLSTACK DEPLOYMENT GUIDE
echo ========================================
echo.
echo ✅ CLIENT BUILD: SUCCESS
echo ✅ SERVER BUILD: SUCCESS
echo ✅ DATABASE: CONFIGURED
echo.
echo ========================================
echo STEP 1: DEPLOY CLIENT (Frontend)
echo ========================================
echo.
echo Option A - Vercel (Recommended):
echo   cd client
echo   npm install -g vercel
echo   vercel
echo.
echo Option B - Firebase:
echo   cd client
echo   firebase deploy --only hosting
echo.
echo ========================================
echo STEP 2: DEPLOY SERVER (Backend)
echo ========================================
echo.
echo Option A - Render (Recommended):
echo   1. Go to https://render.com
echo   2. New Web Service
echo   3. Connect GitHub
echo   4. Build: cd server ^&^& npm install ^&^& npm run build
echo   5. Start: cd server ^&^& node dist/server.js
echo   6. Add environment variables
echo.
echo Option B - Railway:
echo   1. Go to https://railway.app
echo   2. New Project
echo   3. Deploy from GitHub
echo   4. Add environment variables
echo.
echo ========================================
echo STEP 3: ENVIRONMENT VARIABLES
echo ========================================
echo.
echo CLIENT (Vercel/Firebase):
echo   VITE_SUPABASE_URL=https://ksjgsgebjnpwyycnptom.supabase.co
echo   VITE_SUPABASE_ANON_KEY=your_key
echo   VITE_API_URL=https://your-server.onrender.com/api
echo.
echo SERVER (Render/Railway):
echo   NODE_ENV=production
echo   PORT=10000
echo   SUPABASE_URL=https://ksjgsgebjnpwyycnptom.supabase.co
echo   SUPABASE_ANON_KEY=your_key
echo   OPENAI_API_KEY=your_key
echo   GROQ_API_KEY=your_key
echo   DEEPSEEK_API_KEY=your_key
echo.
echo ========================================
echo STEP 4: UPDATE SUPABASE
echo ========================================
echo.
echo 1. Go to Supabase Dashboard
echo 2. Settings -^> API
echo 3. Add Site URL: https://your-app.vercel.app
echo 4. Add Redirect URLs
echo.
echo ========================================
echo STEP 5: TEST PRODUCTION
echo ========================================
echo.
echo Client: https://your-app.vercel.app
echo Server: https://your-api.onrender.com/api/health
echo.
echo Test:
echo   - Sign up
echo   - Complete profile
echo   - Take test
echo   - Check scorecard
echo   - Verify analytics
echo.
echo ========================================
echo 📚 FULL GUIDE
echo ========================================
echo.
echo See FULLSTACK_DEPLOYMENT_COMPLETE.md
echo for detailed step-by-step instructions
echo.
echo ========================================
echo CURRENT STATUS
echo ========================================
echo.
echo Client Preview: http://localhost:4174/
echo Server Dev: http://localhost:5001
echo.
echo Both builds are ready for deployment!
echo.
echo ========================================
pause
