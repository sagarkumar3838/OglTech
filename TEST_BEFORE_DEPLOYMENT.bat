@echo off
echo ============================================
echo END-TO-END TESTING BEFORE DEPLOYMENT
echo ============================================
echo.
echo This will test your app locally before deploying
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found! Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version
echo.

echo Step 1: Installing dependencies...
echo ----------------------------------------
echo.

echo Installing client dependencies...
cd client
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Client dependencies installation failed!
    cd ..
    pause
    exit /b 1
)
cd ..

echo Installing server dependencies...
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Server dependencies installation failed!
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ✅ Dependencies installed successfully!
echo.

echo Step 2: Building the application...
echo ----------------------------------------
echo.

echo Building server...
cd server
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Server build failed!
    cd ..
    pause
    exit /b 1
)
cd ..

echo Building client...
cd client
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Client build failed!
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ✅ Build successful!
echo.

echo Step 3: Starting servers for testing...
echo ----------------------------------------
echo.
echo Starting backend server...
start "Backend Server" cmd /k "cd server && npm run dev"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo Starting frontend server...
start "Frontend Server" cmd /k "cd client && npm run dev"

echo.
echo ============================================
echo ✅ SERVERS STARTED!
echo ============================================
echo.
echo Backend:  http://localhost:5001
echo Frontend: http://localhost:3001
echo.
echo Opening browser for testing...
timeout /t 3 /nobreak >nul
start http://localhost:3001
echo.
echo ============================================
echo TESTING CHECKLIST
echo ============================================
echo.
echo Please test the following:
echo.
echo [ ] 1. Homepage loads correctly
echo [ ] 2. Sign up / Login works
echo [ ] 3. Navigate to Careers page
echo [ ] 4. Select a career path
echo [ ] 5. Start an evaluation
echo [ ] 6. Answer questions
echo [ ] 7. Submit evaluation
echo [ ] 8. View scorecard
echo [ ] 9. Check dashboard
echo [ ] 10. Test AI chat (if enabled)
echo [ ] 11. Check profile page
echo [ ] 12. Test logout
echo.
echo ============================================
echo.
echo When done testing:
echo 1. Close both server windows
echo 2. Press any key here to continue
echo.
pause

echo.
echo Did all tests pass? (Y/N)
set /p test_result=
if /i "%test_result%"=="Y" (
    echo.
    echo ✅ Great! Your app is ready to deploy!
    echo.
    echo Run: DEPLOY_FULLSTACK_FIREBASE.bat
    echo.
) else (
    echo.
    echo ⚠️ Please fix any issues before deploying.
    echo Check the server logs for errors.
    echo.
)

pause
