@echo off
echo ========================================
echo Upload OGL Questions - All Levels
echo ========================================
echo.
echo This will upload OGL questions from:
echo   - ogl_basic_questions.csv (or ogl_easy_questions.csv)
echo   - ogl_medium_questions.csv
echo   - ogl_advanced_questions.csv
echo.
echo Press Ctrl+C to cancel...
timeout /t 3
echo.

npx tsx scripts/upload-all-levels.ts OGL

echo.
echo ========================================
echo Done!
echo ========================================
pause
