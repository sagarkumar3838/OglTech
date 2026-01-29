@echo off
cls
echo ============================================
echo   SKILLEVAL - QUICK DEPLOY
echo ============================================
echo.
echo This will deploy your app to the cloud!
echo.
echo Choose deployment platform:
echo.
echo [1] Vercel (Recommended - Fastest, 100GB free)
echo [2] Firebase (Already configured, 10GB free)
echo [3] Show deployment guide
echo [4] Cancel
echo.
set /p choice="Enter choice (1-4): "

if "%choice%"=="1" goto deploy_vercel
if "%choice%"=="2" goto deploy_firebase
if "%choice%"=="3" goto show_guide
if "%choice%"=="4" goto cancel

echo Invalid choice!
timeout /t 2 >nul
goto end

:deploy_vercel
echo.
echo ============================================
echo DEPLOYING TO VERCEL
echo ============================================
echo.
echo Checking Vercel CLI...
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing Vercel CLI...
    call npm install -g vercel
)

echo.
echo Building app...
cd client
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    cd ..
    pause
    exit /b 1
)

echo.
echo Deploying to Vercel...
call vercel --prod

cd ..
echo.
echo ✅ Deployment complete!
echo.
echo Your app is now live on Vercel!
echo Copy the URL from above and test your app.
echo.
goto end

:deploy_firebase
echo.
echo ============================================
echo DEPLOYING TO FIREBASE
echo ============================================
echo.
echo Checking Firebase CLI...
where firebase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing Firebase CLI...
    call npm install -g firebase-tools
)

echo.
echo Building app...
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
echo Deploying to Firebase...
call firebase deploy --only hosting

echo.
echo ✅ Deployment complete!
echo.
echo Your app is live at:
echo https://mentorai1998.web.app
echo.
goto end

:show_guide
echo.
echo Opening deployment guide...
start notepad DEPLOYMENT_SUMMARY.md
timeout /t 2 >nul
goto end

:cancel
echo.
echo Deployment cancelled.
goto end

:end
echo.
echo Press any key to exit...
pause >nul
