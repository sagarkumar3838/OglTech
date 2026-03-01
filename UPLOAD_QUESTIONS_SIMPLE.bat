@echo off
REM ========================================
REM  SIMPLE UPLOAD - ALL QUESTIONS
REM ========================================

REM Go to the root directory where this batch file is located
cd /d "%~dp0"

echo.
echo Current directory: %CD%
echo.
echo Uploading all questions from questions/ folder...
echo.

npx tsx scripts/upload-all-questions.ts

echo.
echo Done!
pause
