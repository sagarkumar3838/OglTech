@echo off
echo ========================================
echo  UPLOAD ALL QUESTIONS TO SUPABASE
echo ========================================
echo.
echo This will upload ALL CSV files from questions/ folder
echo to your Supabase practice_questions table.
echo.
echo Make sure your .env file has:
echo   VITE_SUPABASE_URL=your-url
echo   SUPABASE_SERVICE_ROLE_KEY=your-key
echo.
pause

echo.
echo Starting upload...
echo.
echo Current directory: %CD%
echo.

REM Make sure we're in the root directory
cd /d "%~dp0"

call npx tsx scripts/upload-all-questions.ts

echo.
echo ========================================
echo  UPLOAD COMPLETE!
echo ========================================
pause
