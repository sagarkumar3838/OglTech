@echo off
echo ============================================
echo BUILD SKILLEVAL FOR DEPLOYMENT
echo ============================================
echo.

echo Checking Node.js version...
node --version
echo.

echo Step 1: Installing dependencies...
cd client
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo Failed to install dependencies!
    cd ..
    pause
    exit /b 1
)

echo.
echo Step 2: Building production bundle...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    cd ..
    pause
    exit /b 1
)

cd ..

echo.
echo ============================================
echo ✅ BUILD COMPLETE!
echo ============================================
echo.
echo Build output: client\dist
echo.
echo Ready to deploy to:
echo 1. Vercel   - Run: DEPLOY_VERCEL.bat
echo 2. Firebase - Run: DEPLOY_FIREBASE.bat
echo 3. Netlify  - Run: netlify deploy --prod
echo.
echo Or manually upload the client\dist folder to any static host
echo.
pause
