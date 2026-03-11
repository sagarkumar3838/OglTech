@echo off
echo ========================================
echo SETUP MULTIPLE CORRECT ANSWERS SUPPORT
echo ========================================
echo.
echo This will add support for questions with multiple correct answers.
echo.
echo What this does:
echo   1. Adds correct_answers column (array)
echo   2. Adds question_type column (single/multiple)
echo   3. Migrates existing data
echo   4. Creates validation functions
echo.
pause
echo.
echo Opening Supabase SQL Editor...
echo.
echo INSTRUCTIONS:
echo 1. Copy the contents of: add-multiple-correct-answers-support.sql
echo 2. Paste into Supabase SQL Editor
echo 3. Click "Run" to execute
echo.
echo After running the SQL:
echo   - Use: npx tsx scripts/upload-csv-with-multiple-answers.ts
echo   - CSV format for multiple answers: "A,B,D"
echo.
pause
