@echo off
echo ========================================
echo  FIX CSV QUOTE ERRORS
echo ========================================
echo.
echo This will fix malformed quotes in CSV files
echo.

cd /d "%~dp0"

echo Installing dependencies...
call npm install

echo.
echo Running CSV quote fix...
npx tsx scripts/fix-csv-quotes.ts

echo.
echo ========================================
echo  FIX COMPLETE
echo ========================================
echo.
echo Next step: Run UPLOAD_ALL.bat
echo.
pause
