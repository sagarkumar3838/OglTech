@echo off
echo ========================================
echo Deploying AssemblyAI Voice Feature
echo ========================================
echo.

echo Step 1: Checking environment variables...
if not exist ".env" (
    echo ERROR: .env file not found!
    echo Please create .env file with ASSEMBLYAI_API_KEY
    pause
    exit /b 1
)

if not exist "functions\.env" (
    echo ERROR: functions\.env file not found!
    echo Please create functions\.env file with ASSEMBLYAI_API_KEY
    pause
    exit /b 1
)

echo ✓ Environment files found
echo.

echo Step 2: Installing dependencies...
cd functions
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✓ Dependencies installed
echo.

echo Step 3: Deploying to Firebase...
call firebase deploy --only functions
if errorlevel 1 (
    echo ERROR: Deployment failed
    pause
    exit /b 1
)
echo.

echo ========================================
echo ✓ Deployment Complete!
echo ========================================
echo.
echo Your AssemblyAI voice feature is now live!
echo.
echo Next steps:
echo 1. Go to your app's evaluation page
echo 2. Click the microphone button
echo 3. Speak your answer
echo 4. See the transcribed text!
echo.
echo Monitor usage at: https://www.assemblyai.com/dashboard
echo.
pause
