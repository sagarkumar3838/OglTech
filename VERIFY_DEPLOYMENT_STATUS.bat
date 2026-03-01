@echo off
echo ========================================
echo   CHECK DEPLOYMENT STATUS
echo ========================================
echo.
echo This will show you:
echo 1. How many CSV files you have locally
echo 2. Connection to Supabase
echo 3. How many questions are in database
echo.
pause

echo.
echo [1/3] Counting local CSV files...
echo.
powershell -Command "(Get-ChildItem -Path questions -Filter '*.csv' | Measure-Object).Count"
echo CSV files found in questions/ folder
echo.

echo [2/3] Testing Supabase connection...
echo.
call npx tsx scripts/test-upload-connection.ts
echo.

echo [3/3] Next Steps:
echo.
echo If connection is OK, run one of these:
echo   - UPLOAD_ALL_QUESTIONS_NOW.bat (upload everything)
echo   - UPLOAD_MISSING_ONLY.bat (smart upload, skip duplicates)
echo.
echo Then check Supabase SQL Editor with:
echo   - CHECK_NEW_QUESTIONS_STATUS.sql
echo.
pause
