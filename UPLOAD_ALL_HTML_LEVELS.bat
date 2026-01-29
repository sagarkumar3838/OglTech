@echo off
echo ========================================
echo Upload HTML Questions - All Levels
echo ========================================
echo.
echo This will upload HTML questions from:
echo   - html_basic_questions.csv (or html_easy_questions.csv)
echo   - html_medium_questions.csv
echo   - html_advanced_questions.csv
echo.
echo Press Ctrl+C to cancel...
timeout /t 3
echo.

npx tsx scripts/upload-all-levels.ts HTML

echo.
echo ========================================
echo Done!
echo ========================================
pause
