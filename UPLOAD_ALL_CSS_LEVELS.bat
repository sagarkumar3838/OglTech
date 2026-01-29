@echo off
echo ========================================
echo Upload CSS Questions - All Levels
echo ========================================
echo.
echo This will upload CSS questions from:
echo   - css_basic_questions.csv (or css_easy_questions.csv)
echo   - css_medium_questions.csv
echo   - css_advanced_questions.csv
echo.
echo Press Ctrl+C to cancel...
timeout /t 3
echo.

npx tsx scripts/upload-all-levels.ts CSS

echo.
echo ========================================
echo Done!
echo ========================================
pause
