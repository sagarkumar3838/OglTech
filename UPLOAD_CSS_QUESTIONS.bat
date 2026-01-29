@echo off
echo ========================================
echo CSS Questions Upload to Supabase
echo ========================================
echo.
echo This will:
echo 1. Read client/dist/assets/css_easy_questions.csv
echo 2. Remove duplicates
echo 3. Transform to Supabase format
echo 4. Upload to your Supabase database
echo.
echo Press Ctrl+C to cancel...
timeout /t 3
echo.

npx tsx scripts/transform-css-questions.ts

echo.
echo ========================================
echo Done!
echo ========================================
pause
