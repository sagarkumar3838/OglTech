@echo off
echo ============================================
echo UPLOAD UNIQUE HTML EASY QUESTIONS
echo ============================================
echo.
echo This will upload 325 unique HTML easy questions
echo (1,101 duplicates were removed)
echo.
pause

echo.
echo Uploading unique questions to Supabase...
echo.

npx tsx scripts/upload-csv-to-supabase.ts client/dist/assets/html_easy_questions_unique.csv

echo.
echo ============================================
echo DONE!
echo ============================================
echo.
pause
