@echo off
echo ========================================
echo 🔥 FIREBASE DEPLOYMENT GUIDE
echo ========================================
echo.
echo Firebase Project: mentorai1998
echo Client URL: https://mentorai1998.web.app
echo.
echo ========================================
echo RECOMMENDED: OPTION 1
echo ========================================
echo.
echo Client: Firebase Hosting (Fast, Free, CDN)
echo Server: Render.com (Better for Express)
echo.
echo ========================================
echo STEP 1: DEPLOY CLIENT (2 MINUTES)
echo ========================================
echo.
echo cd client
echo firebase deploy --only hosting
echo.
echo Result: https://mentorai1998.web.app
echo.
echo ========================================
echo STEP 2: DEPLOY SERVER (10 MINUTES)
echo ========================================
echo.
echo 1. Go to: https://render.com
echo 2. Sign up / Login
echo 3. New Web Service
echo 4. Connect GitHub
echo 5. Configure:
echo    Build: cd server ^&^& npm install ^&^& npm run build
echo    Start: cd server ^&^& node dist/server.js
echo 6. Add environment variables:
echo    NODE_ENV=production
echo    PORT=10000
echo    SUPABASE_URL=https://ksjgsgebjnpwyycnptom.supabase.co
echo    SUPABASE_ANON_KEY=your_key
echo    OPENAI_API_KEY=your_key
echo    GROQ_API_KEY=your_key
echo    DEEPSEEK_API_KEY=your_key
echo    CORS_ORIGIN=https://mentorai1998.web.app
echo 7. Deploy
echo.
echo Result: https://skilleval-api.onrender.com
echo.
echo ========================================
echo STEP 3: UPDATE CLIENT API URL (2 MINUTES)
echo ========================================
echo.
echo 1. Create client/.env.production:
echo    VITE_API_URL=https://skilleval-api.onrender.com/api
echo.
echo 2. Rebuild and redeploy:
echo    cd client
echo    npm run build
echo    firebase deploy --only hosting
echo.
echo ========================================
echo STEP 4: UPDATE SUPABASE (1 MINUTE)
echo ========================================
echo.
echo 1. Go to Supabase Dashboard
echo 2. Settings -^> API
echo 3. Add Site URL: https://mentorai1998.web.app
echo 4. Add Redirect URLs
echo.
echo ========================================
echo STEP 5: TEST PRODUCTION
echo ========================================
echo.
echo Client: https://mentorai1998.web.app
echo Server: https://skilleval-api.onrender.com/api/health
echo.
echo Test:
echo - Sign up
echo - Complete profile
echo - Take test
echo - Check scorecard
echo - Verify analytics
echo.
echo ========================================
echo 📚 FULL GUIDE
echo ========================================
echo.
echo See FIREBASE_DEPLOYMENT_COMPLETE.md
echo for detailed instructions
echo.
echo ========================================
echo QUICK START
echo ========================================
echo.
echo 1. Test locally: http://localhost:4174/
echo 2. Deploy client: cd client ^&^& firebase deploy --only hosting
echo 3. Deploy server: https://render.com
echo 4. Update API URL and redeploy client
echo 5. Test production
echo.
echo Total Time: ~15 minutes
echo Total Cost: $0/month (free tier)
echo.
echo ========================================
pause
