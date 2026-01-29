@echo off
echo ============================================
echo DEPLOY SKILLEVAL TO FIREBASE
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

echo Step 1: Building client...
cd client
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    cd ..
    pause
    exit /b 1
)

cd ..

echo.
echo ✅ Build successful!
echo.
echo Step 2: Deploying to Firebase...
echo.

REM Deploy to Firebase Hosting
call firebase deploy --only hosting

if %ERRORLEVEL% NEQ 0 (
    echo Deployment failed!
    pause
    exit /b 1
)

echo.
echo ============================================
echo ✅ DEPLOYMENT COMPLETE!
echo ============================================
echo.
echo Your app is now live at:
echo https://mentorai1998.web.app
echo.
echo Or check Firebase Console for the URL:
echo https://console.firebase.google.com/project/mentorai1998/hosting
echo.
pause
