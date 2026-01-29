@echo off
echo ========================================
echo 🔥 DEPLOYING TO FIREBASE
echo ========================================
echo.
echo Project: skillevaluate
echo URL: https://skillevaluate.web.app
echo.
echo ========================================
echo STEP 1: ENABLE AUTHENTICATION
echo ========================================
echo.
echo IMPORTANT: Before deploying, enable authentication!
echo.
echo 1. Go to: https://console.firebase.google.com/
echo 2. Select: skillevaluate project
echo 3. Click: Authentication
echo 4. Click: Get Started
echo 5. Enable: Email/Password
echo 6. Save
echo.
pause
echo.
echo ========================================
echo STEP 2: BUILD CLIENT
echo ========================================
echo.
cd client
echo Building client...
call npm run build
echo.
if errorlevel 1 (
    echo ❌ Build failed! Fix errors and try again.
    pause
    exit /b 1
)
echo ✅ Build successful!
echo.
echo ========================================
echo STEP 3: DEPLOY TO FIREBASE
echo ========================================
echo.
echo Deploying to Firebase Hosting...
cd ..
call firebase deploy --only hosting
echo.
if errorlevel 1 (
    echo ❌ Deployment failed!
    pause
    exit /b 1
)
echo.
echo ========================================
echo ✅ DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your app is live at:
echo https://skillevaluate.web.app
echo.
echo ========================================
echo STEP 4: UPDATE SUPABASE URLS
echo ========================================
echo.
echo IMPORTANT: Update Supabase redirect URLs!
echo.
echo 1. Go to: https://supabase.com/dashboard
echo 2. Select your project
echo 3. Settings -^> API
echo 4. Update Site URL: https://skillevaluate.web.app
echo 5. Add Redirect URLs:
echo    - https://skillevaluate.web.app
echo    - https://skillevaluate.web.app/auth/callback
echo    - https://skillevaluate.web.app/dashboard
echo 6. Save
echo.
echo ========================================
echo STEP 5: TEST PRODUCTION
echo ========================================
echo.
echo Open: https://skillevaluate.web.app
echo.
echo Test:
echo - Sign up
echo - Complete profile
echo - Take test
echo - Check scorecard
echo - Verify analytics
echo.
echo ========================================
echo 🎉 DONE!
echo ========================================
echo.
pause
