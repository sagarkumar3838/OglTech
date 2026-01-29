@echo off
echo ============================================
echo DEPLOY SKILLEVAL TO VERCEL
echo ============================================
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Vercel CLI not found. Installing...
    call npm install -g vercel
    if %ERRORLEVEL% NEQ 0 (
        echo Failed to install Vercel CLI
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

echo.
echo ✅ Build successful!
echo.
echo Step 2: Deploying to Vercel...
echo.

REM Deploy to production
call vercel --prod

if %ERRORLEVEL% NEQ 0 (
    echo Deployment failed!
    cd ..
    pause
    exit /b 1
)

cd ..

echo.
echo ============================================
echo ✅ DEPLOYMENT COMPLETE!
echo ============================================
echo.
echo Your app is now live on Vercel!
echo.
echo Next steps:
echo 1. Copy the deployment URL
echo 2. Test your live app
echo 3. Configure custom domain (optional)
echo.
pause
