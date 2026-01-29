@echo off
echo ========================================
echo Upload jQuery Questions - All Levels
echo ========================================
echo.
echo This will upload jQuery questions from:
echo   - jquery_basic_questions.csv (or jquery_easy_questions.csv)
echo   - jquery_medium_questions.csv
echo   - jquery_advanced_questions.csv
echo.
echo Press Ctrl+C to cancel...
timeout /t 3
echo.

npx tsx scripts/upload-all-levels.ts jQuery

echo.
echo ========================================
echo Done!
echo ========================================
pause
