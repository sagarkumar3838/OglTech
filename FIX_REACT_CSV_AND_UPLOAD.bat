@echo off
echo ========================================
echo Fix and Upload React Questions
echo ========================================
echo.
echo This will:
echo 1. Check your React CSV files
echo 2. Show you any issues
echo 3. Upload if format is correct
echo.
echo ========================================
echo.

echo Checking React CSV files...
echo.

REM Run the TypeScript script directly
npx tsx scripts/upload-csv-no-duplicates.ts questions/react-beginner.csv questions/react-intermediate.csv questions/react-advanced.csv

echo.
echo ========================================
echo.
echo If you see errors above, the CSV format needs fixing.
echo.
echo Common issues:
echo - Columns not matching (too many or too few commas)
echo - Text with commas not wrapped in quotes
echo - Missing required fields
echo.
echo ========================================
pause
