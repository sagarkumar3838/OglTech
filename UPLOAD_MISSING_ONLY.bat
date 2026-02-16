@echo off
echo ============================================
echo SMART UPLOAD - ONLY MISSING QUESTIONS
echo ============================================
echo.
echo This script will:
echo 1. Check what's already in the database
echo 2. Skip files that are already uploaded
echo 3. Only upload NEW questions
echo 4. Avoid duplicates
echo.
pause
echo.
echo Checking database and uploading...
echo.
REM Stay in root directory so .env file is found
call npm install --prefix scripts
call npx ts-node scripts/upload-missing-questions.ts
echo.
echo ============================================
echo Done!
echo.
echo Next step: Run CHECK_AND_FIX_QUESTIONS.sql
echo to copy from practice_questions to questions table
echo ============================================
pause
