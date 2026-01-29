@echo off
echo ========================================
echo Upload JavaScript Questions - All Levels
echo ========================================
echo.
echo This will upload JavaScript questions from:
echo   - javascript_basic_questions.csv
echo   - javascript_medium_questions.csv
echo   - javascript_advanced_questions.csv
echo.
echo Press Ctrl+C to cancel...
timeout /t 3
echo.

npx tsx scripts/upload-all-levels.ts JavaScript

echo.
echo ========================================
echo Done!
echo ========================================
pause
