@echo off
echo ========================================
echo Upload All Existing CSV Files
echo ========================================
echo.
echo This will upload and merge:
echo   1. ogl_easy_questions.csv
echo   2. jquery_easy_questions.csv
echo   3. js_easy_questions.csv
echo   4. css_easy_questions.csv
echo   5. html_basic_new_batch_1_unique.csv
echo   6. html_fillblank_questions.csv (fill-in-the-blank type)
echo.
echo The script will:
echo   - Read all CSV files
echo   - Remove duplicate questions
echo   - Transform to Supabase format
echo   - Upload to database
echo.
echo Press Ctrl+C to cancel...
timeout /t 5
echo.

npx tsx scripts/upload-multiple-csv-files.ts

echo.
echo ========================================
echo Done!
echo ========================================
pause
