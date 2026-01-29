@echo off
echo ============================================
echo FULL STACK DEPLOYMENT TO FIREBASE
echo Frontend + Backend Together
echo ============================================
echo.

REM Check if Firebase CLI is installed
where firebase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Firebase CLI not found. Installing...
    call npm install -g firebase-tools
    if %ERRORLEVEL% NEQ 0 (
        echo Failed to install Firebase CLI
        pause
        exit /b 1
    )
)

echo Step 1/4: Installing backend dependencies...
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Backend dependencies installation failed!
    cd ..
    pause
    exit /b 1
)

echo.
echo Step 2/4: Building backend...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Backend build failed!
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo Step 3/4: Building frontend...
cd client
call npm install
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Frontend build failed!
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo Step 4/4: Deploying to Firebase...
echo This will deploy:
echo - Frontend (Hosting)
echo - Backend (Functions)
echo - Firestore Rules
echo.

call firebase deploy

if %ERRORLEVEL% NEQ 0 (
    echo Deployment failed!
    pause
    exit /b 1
)

echo.
echo ============================================
echo ✅ FULL STACK DEPLOYMENT COMPLETE!
echo ============================================
echo.
echo Your app is now live:
echo.
echo 🌐 Frontend: https://mentorai1998.web.app
echo 🔧 Backend API: https://us-central1-mentorai1998.cloudfunctions.net/api
echo.
echo Test your backend:
echo https://us-central1-mentorai1998.cloudfunctions.net/api/health
echo.
echo Next steps:
echo 1. Test your live app
echo 2. Check Firebase Console for logs
echo 3. Monitor function usage
echo.
pause
