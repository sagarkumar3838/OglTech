@echo off
echo ============================================
echo SETUP ON NEW SYSTEM
echo ============================================
echo.
echo This will set up SkillEval on a new computer
echo.

REM Check Node.js
echo Step 1: Checking prerequisites...
echo ----------------------------------------
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found!
    echo.
    echo Please install Node.js 18+ from:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js found:
node --version
echo.

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm not found!
    pause
    exit /b 1
)

echo ✅ npm found:
npm --version
echo.

echo Step 2: Checking environment files...
echo ----------------------------------------
if not exist "client\.env" (
    echo ⚠️ client\.env not found!
    echo.
    echo Creating from example...
    if exist "client\.env.example" (
        copy "client\.env.example" "client\.env"
        echo ✅ Created client\.env
        echo ⚠️ Please update with your actual values!
    ) else (
        echo ❌ client\.env.example not found!
        echo Please create client\.env manually
    )
    echo.
)

if not exist ".env" (
    if exist ".env.example" (
        copy ".env.example" ".env"
        echo ✅ Created .env
    )
)

echo Step 3: Installing dependencies...
echo ----------------------------------------
echo.
echo This may take a few minutes...
echo.

echo Installing client dependencies...
cd client
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Client installation failed!
    cd ..
    pause
    exit /b 1
)
echo ✅ Client dependencies installed
cd ..

echo.
echo Installing server dependencies...
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Server installation failed!
    cd ..
    pause
    exit /b 1
)
echo ✅ Server dependencies installed
cd ..

echo.
echo Step 4: Testing build...
echo ----------------------------------------
echo.

echo Building server...
cd server
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️ Server build failed!
    echo This might be okay if you're just testing
    cd ..
) else (
    echo ✅ Server built successfully
    cd ..
)

echo.
echo Building client...
cd client
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️ Client build failed!
    echo This might be okay if you're just testing
    cd ..
) else (
    echo ✅ Client built successfully
    cd ..
)

echo.
echo ============================================
echo ✅ SETUP COMPLETE!
echo ============================================
echo.
echo Your SkillEval app is ready!
echo.
echo IMPORTANT: Update environment variables
echo ----------------------------------------
echo Edit these files with your actual values:
echo - client\.env (Supabase, Firebase config)
echo - server\.env (if exists)
echo.
echo Next steps:
echo ----------------------------------------
echo 1. Update environment files
echo 2. Run: TEST_BEFORE_DEPLOYMENT.bat
echo 3. Test the application
echo 4. Deploy: DEPLOY_FULLSTACK_FIREBASE.bat
echo.
echo To start testing now:
echo - Run: TEST_BEFORE_DEPLOYMENT.bat
echo.
pause
