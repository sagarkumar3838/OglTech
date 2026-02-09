@echo off
cls
echo.
echo ========================================================
echo   UPLOAD ALL PRACTICE QUESTIONS TO SUPABASE
echo ========================================================
echo.
echo This will upload ALL 99 CSV files to Supabase
echo.
echo Skills: 33 technologies (React, Python, Java, etc.)
echo Levels: Basic, Intermediate, Advanced
echo.
echo ========================================================
echo.
echo BEFORE YOU START - Make sure you have:
echo.
echo [1] Created the practice_questions table in Supabase
echo     (Run create-practice-questions-database-v2.sql)
echo.
echo [2] Updated your .env file with Supabase credentials
echo     VITE_SUPABASE_URL=https://your-project.supabase.co
echo     VITE_SUPABASE_ANON_KEY=your-key-here
echo.
echo ========================================================
echo.
pause

echo.
echo [Step 1/3] Installing dependencies...
echo.
call npm install csv-parse @supabase/supabase-js dotenv
if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dependencies
    echo Please check your internet connection
    pause
    exit /b 1
)

echo.
echo [Step 2/3] Compiling TypeScript...
echo.
call npx tsc scripts/upload-all-questions.ts --esModuleInterop --resolveJsonModule --skipLibCheck --module commonjs
if errorlevel 1 (
    echo.
    echo ERROR: Failed to compile TypeScript
    pause
    exit /b 1
)

echo.
echo [Step 3/3] Uploading all questions...
echo.
echo This may take 2-5 minutes for 99 files...
echo.
call node scripts/upload-all-questions.js

echo.
echo ========================================================
echo   UPLOAD COMPLETE!
echo ========================================================
echo.
echo Next steps:
echo 1. Check the summary above
echo 2. Verify in Supabase dashboard
echo 3. Run verify-practice-questions.sql to check data
echo.
echo ========================================================
pause
