@echo off
echo ========================================
echo 🔥 DEPLOYING CLIENT TO FIREBASE
echo ========================================
echo.
echo Project: mentorai1998
echo URL: https://mentorai1998.web.app
echo.
echo ========================================
echo STEP 1: BUILD CLIENT
echo ========================================
echo.
cd client
echo Building client...
call npm run build
echo.
echo ========================================
echo STEP 2: DEPLOY TO FIREBASE
echo ========================================
echo.
echo Deploying to Firebase Hosting...
call firebase deploy --only hosting
echo.
echo ========================================
echo ✅ DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your app is live at:
echo https://mentorai1998.web.app
echo.
echo ========================================
echo NEXT STEPS
echo ========================================
echo.
echo 1. Deploy server to Render.com
echo 2. Update VITE_API_URL in client
echo 3. Redeploy client
echo 4. Update Supabase URLs
echo 5. Test production
echo.
echo See FIREBASE_DEPLOYMENT_COMPLETE.md for details
echo.
echo ========================================
pause
