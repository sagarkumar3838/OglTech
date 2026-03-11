@echo off
echo ========================================
echo Uploading React Beginner Questions
echo ========================================
echo.

cd /d "%~dp0"

echo Compiling TypeScript...
call npx tsx scripts/upload-react-beginner.ts

echo.
echo ========================================
echo Done!
echo ========================================
pause
