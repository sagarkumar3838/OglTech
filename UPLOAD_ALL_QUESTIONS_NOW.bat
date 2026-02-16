@echo off
echo ============================================
echo UPLOAD ALL QUESTIONS TO DATABASE
echo ============================================
echo.
echo This will upload ALL CSV files from questions/ folder
echo to the practice_questions table in Supabase
echo.
echo Make sure your .env file has:
echo   VITE_SUPABASE_URL=your-url
echo   SUPABASE_SERVICE_ROLE_KEY=your-key
echo.
pause
echo.
echo Starting upload...
echo.
cd scripts
call npm install
call npx ts-node upload-all-questions.ts
echo.
echo ============================================
echo Upload complete!
echo.
echo Next step: Run CHECK_AND_FIX_QUESTIONS.sql
echo to copy from practice_questions to questions table
echo ============================================
pause
