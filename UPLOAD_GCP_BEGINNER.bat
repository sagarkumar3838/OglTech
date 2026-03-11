@echo off
echo ========================================
echo   Upload GCP Beginner Questions
echo ========================================
echo.

cd /d "%~dp0"

echo Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Installing dependencies...
call npm install

echo.
echo Running upload script...
npx ts-node scripts/upload-gcp-beginner.ts

echo.
echo ========================================
echo   Upload Complete!
echo ========================================
echo.
pause
