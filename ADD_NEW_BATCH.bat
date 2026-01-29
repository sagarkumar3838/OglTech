@echo off
echo ============================================
echo ADD NEW BATCH OF QUESTIONS
echo ============================================
echo.
echo This script will:
echo 1. Merge new questions into your master file
echo 2. Remove duplicate questions automatically
echo 3. Keep only unique questions
echo 4. Create a backup of your master file
echo.
echo Master file: client\dist\assets\html_easy_questions_unique.csv
echo.
echo Please provide the path to your new questions file
echo (the file where you pasted questions from DeepSeek)
echo.

set /p NEW_FILE="Enter new questions file path: "

if "%NEW_FILE%"=="" (
    echo.
    echo ❌ No file provided!
    pause
    exit /b 1
)

set MASTER_FILE=client\dist\assets\html_easy_questions_unique.csv

echo.
echo Master file: %MASTER_FILE%
echo New file: %NEW_FILE%
echo.
pause

echo.
echo Processing...
echo.

npx tsx scripts/merge-and-deduplicate.ts "%MASTER_FILE%" "%NEW_FILE%"

echo.
echo ============================================
echo DONE!
echo ============================================
echo.
echo Your master file has been updated!
echo A backup was created automatically.
echo.
pause
