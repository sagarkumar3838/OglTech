@echo off
:menu
cls
echo ============================================
echo     SKILLEVAL DEPLOYMENT MENU
echo ============================================
echo.
echo Choose your deployment platform:
echo.
echo 1. Vercel (Recommended - Fastest)
echo 2. Firebase (Already Configured)
echo 3. Build Only (Manual Upload)
echo 4. Exit
echo.
echo ============================================
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto vercel
if "%choice%"=="2" goto firebase
if "%choice%"=="3" goto build
if "%choice%"=="4" goto end
echo Invalid choice. Please try again.
timeout /t 2 >nul
goto menu

:vercel
cls
echo ============================================
echo DEPLOYING TO VERCEL
echo ============================================
echo.
call DEPLOY_VERCEL.bat
goto end

:firebase
cls
echo ============================================
echo DEPLOYING TO FIREBASE
echo ============================================
echo.
call DEPLOY_FIREBASE.bat
goto end

:build
cls
echo ============================================
echo BUILDING FOR DEPLOYMENT
echo ============================================
echo.
call BUILD_FOR_DEPLOYMENT.bat
goto end

:end
echo.
echo Press any key to exit...
pause >nul
