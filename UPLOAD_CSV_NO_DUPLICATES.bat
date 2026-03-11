@echo off
echo ========================================
echo CSV Upload Tool (No Duplicates)
echo ========================================
echo.
echo This script uploads CSV files to Supabase
echo and automatically skips duplicate questions.
echo.
echo Usage:
echo   1. Upload all CSV files:
echo      UPLOAD_CSV_NO_DUPLICATES.bat
echo.
echo   2. Upload specific file:
echo      UPLOAD_CSV_NO_DUPLICATES.bat questions/react-advanced.csv
echo.
echo   3. Upload multiple files:
echo      UPLOAD_CSV_NO_DUPLICATES.bat questions/react-beginner.csv questions/react-intermediate.csv
echo.
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Run the upload script
if "%~1"=="" (
    echo Uploading all CSV files from questions directory...
    echo.
    npx tsx scripts/upload-csv-no-duplicates.ts
) else (
    echo Uploading specified file(s)...
    echo.
    npx tsx scripts/upload-csv-no-duplicates.ts %*
)

echo.
echo ========================================
echo Done!
echo ========================================
pause
