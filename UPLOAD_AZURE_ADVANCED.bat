@echo off
echo ========================================
echo  UPLOAD AZURE ADVANCED QUESTIONS
echo ========================================
echo.

cd /d "%~dp0"

echo Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js not found!
    pause
    exit /b 1
)

echo.
echo Installing dependencies...
call npm install

echo.
echo Running upload script...
npx tsx scripts/upload-azure-advanced.ts

echo.
echo ========================================
echo  DONE!
echo ========================================
pause
