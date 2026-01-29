@echo off
echo ========================================
echo Upload CSS Questions (Auto-Detect Levels)
echo ========================================
echo.
echo This will:
echo   - Read css_easy_questions.csv
echo   - Auto-detect level from CSV (BASIC, MEDIUM, ADVANCED)
echo   - Remove duplicates
echo   - Upload all levels to Supabase
echo.
echo Press Ctrl+C to cancel...
timeout /t 3
echo.

npx tsx scripts/upload-csv-auto-detect-level.ts client/dist/assets/css_easy_questions.csv

echo.
echo ========================================
echo Done!
echo ========================================
pause
