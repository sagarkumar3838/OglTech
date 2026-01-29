@echo off
:menu
cls
echo ============================================
echo   SKILLEVAL FULL STACK DEPLOYMENT
echo   Frontend + Backend
echo ============================================
echo.
echo Choose your deployment option:
echo.
echo 1. Firebase (Frontend + Backend Together) - Easiest
echo 2. Vercel (Frontend) + Render (Backend) - Best Performance
echo 3. Build Only (Manual Upload)
echo 4. Test Backend Locally
echo 5. View Deployment Guide
echo 6. Exit
echo.
echo ============================================
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto firebase
if "%choice%"=="2" goto vercel_render
if "%choice%"=="3" goto build
if "%choice%"=="4" goto test_backend
if "%choice%"=="5" goto guide
if "%choice%"=="6" goto end
echo Invalid choice. Please try again.
timeout /t 2 >nul
goto menu

:firebase
cls
echo ============================================
echo DEPLOYING TO FIREBASE
echo Frontend + Backend Together
echo ============================================
echo.
call DEPLOY_FULLSTACK_FIREBASE.bat
goto end

:vercel_render
cls
echo ============================================
echo DEPLOYING TO VERCEL + RENDER
echo ============================================
echo.
echo This deployment has 2 parts:
echo.
echo PART 1: Deploy Backend to Render
echo ----------------------------------------
echo 1. Go to: https://dashboard.render.com/
echo 2. Click "New +" then "Blueprint"
echo 3. Connect your Git repository
echo 4. Render will use render.yaml to deploy
echo 5. Copy your backend URL (e.g., https://skilleval-api.onrender.com)
echo.
echo Press any key when backend is deployed...
pause >nul
echo.
echo PART 2: Deploy Frontend to Vercel
echo ----------------------------------------
set /p backend_url="Enter your Render backend URL: "
echo.
echo Updating frontend environment...
echo VITE_API_URL=%backend_url%/api > client\.env.production
echo.
echo Building and deploying frontend...
cd client
call npm run build
call vercel --prod
cd ..
echo.
echo ✅ Full stack deployment complete!
echo.
echo Frontend: Check Vercel output above
echo Backend: %backend_url%
echo.
goto end

:build
cls
echo ============================================
echo BUILDING FOR MANUAL DEPLOYMENT
echo ============================================
echo.
echo Building backend...
cd server
call npm install
call npm run build
cd ..
echo.
echo Building frontend...
cd client
call npm install
call npm run build
cd ..
echo.
echo ✅ Build complete!
echo.
echo Backend build: server\dist
echo Frontend build: client\dist
echo.
echo You can now manually upload these to any hosting platform.
echo.
goto end

:test_backend
cls
echo ============================================
echo TESTING BACKEND LOCALLY
echo ============================================
echo.
echo Starting backend server...
cd server
start cmd /k "npm run dev"
cd ..
echo.
echo Backend is starting...
echo Wait a few seconds, then test:
echo.
echo http://localhost:5001/api/health
echo.
echo Press any key to return to menu...
pause >nul
goto menu

:guide
cls
echo ============================================
echo OPENING DEPLOYMENT GUIDE
echo ============================================
echo.
start notepad FULLSTACK_DEPLOYMENT_GUIDE.md
timeout /t 2 >nul
goto menu

:end
echo.
echo Press any key to exit...
pause >nul
