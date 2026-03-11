@echo off
echo ============================================================
echo REMOVING CYPRESS BEGINNER DUPLICATES
echo ============================================================
echo.
echo This will delete all existing cypress beginner questions
echo so you can re-upload the corrected CSV file.
echo.
pause

echo.
echo Opening Supabase SQL Editor...
echo.
echo INSTRUCTIONS:
echo 1. Copy the SQL from FIX_CYPRESS_DUPLICATES_NOW.sql
echo 2. Paste it into Supabase SQL Editor
echo 3. Run the query
echo 4. Then re-upload cypress-beginner.csv
echo.

start https://supabase.com/dashboard/project/_/sql

echo.
echo After running the SQL, press any key to continue...
pause

echo.
echo Now uploading cypress-beginner.csv...
echo.

cd /d "%~dp0"
npx tsx scripts/upload-csv-no-duplicates.ts questions/cypress-beginner.csv

echo.
echo ============================================================
echo DONE!
echo ============================================================
pause
