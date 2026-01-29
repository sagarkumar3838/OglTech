@echo off
echo ============================================
echo FIXING QUESTIONS DATABASE
echo ============================================
echo.
echo This will:
echo 1. Clean up and standardize existing questions
echo 2. Upload HTML easy questions from CSV
echo.
pause

echo.
echo Step 1: Uploading HTML easy questions...
echo.
cd client\dist\assets
npx tsx ..\..\..\scripts\upload-csv-to-supabase.ts html_easy_questions.csv
cd ..\..\..

echo.
echo ============================================
echo DONE! 
echo ============================================
echo.
echo Next steps:
echo 1. Go to Supabase SQL Editor
echo 2. Run the fix-questions-database.sql script
echo 3. Verify questions are loaded correctly
echo.
pause
