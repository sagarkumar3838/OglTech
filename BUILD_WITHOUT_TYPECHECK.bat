@echo off
echo ============================================
echo BUILDING WITHOUT TYPE CHECKING
echo ============================================
echo.
echo This will build your app by skipping TypeScript errors
echo.

echo Building client (Vite only, skip tsc)...
cd client
call npx vite build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed!
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
echo Your app is built in: client\dist
echo.
echo Next steps:
echo 1. Test: npm run preview (in client folder)
echo 2. Deploy: DEPLOY_FULLSTACK_FIREBASE.bat
echo.
pause
