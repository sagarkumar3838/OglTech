@echo off
echo ========================================
echo PRE-DEPLOYMENT TESTING
echo ========================================
echo.
echo This will help you test everything before deployment
echo.
echo ========================================
echo STEP 1: READ THE CHECKLIST
echo ========================================
echo.
echo Open and follow: PRE_DEPLOYMENT_TESTING_CHECKLIST.md
echo.
echo Test all features:
echo   - Authentication (Sign up, Login)
echo   - Profile setup
echo   - Dashboard
echo   - Take tests
echo   - Scorecard
echo   - Analytics
echo   - Level unlocking
echo.
pause
echo.
echo ========================================
echo STEP 2: BUILD CLIENT
echo ========================================
echo.
echo Building client for production...
cd client
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ BUILD FAILED!
    echo Fix errors before deploying.
    pause
    exit /b 1
)
echo.
echo ✅ Build successful!
echo.
pause
echo.
echo ========================================
echo STEP 3: TEST PRODUCTION BUILD
echo ========================================
echo.
echo Starting production preview...
echo Open: http://localhost:4173
echo.
echo Test the production build:
echo   1. Sign up / Login
echo   2. Complete profile
echo   3. Take a test
echo   4. View scorecard
echo   5. Check analytics
echo.
start http://localhost:4173
call npm run preview
echo.
pause
echo.
echo ========================================
echo STEP 4: CHECK FOR ERRORS
echo ========================================
echo.
echo Did you see any errors in:
echo   - Browser console (F12)?
echo   - Build output?
echo   - Production preview?
echo.
echo If YES: Fix errors before deploying
echo If NO: You're ready to deploy!
echo.
pause
echo.
echo ========================================
echo STEP 5: READY TO DEPLOY?
echo ========================================
echo.
echo If all tests passed:
echo   1. Read DEPLOYMENT_GUIDE.md
echo   2. Choose deployment platform (Vercel recommended)
echo   3. Deploy client
echo   4. Deploy server (if needed)
echo   5. Test production deployment
echo.
echo ========================================
echo DEPLOYMENT COMMANDS
echo ========================================
echo.
echo Vercel (Recommended):
echo   cd client
echo   vercel --prod
echo.
echo Firebase:
echo   cd client
echo   npm run build
echo   firebase deploy
echo.
echo ========================================
pause
