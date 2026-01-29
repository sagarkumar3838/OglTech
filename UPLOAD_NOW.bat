@echo off
echo ============================================
echo UPLOADING 3000 QUESTIONS TO SUPABASE
echo ============================================
echo.
echo This will take 3-5 minutes...
echo.

npx tsx scripts/upload-csv-to-supabase.ts client/dist/assets/ogl_developer_questions_combined_3000_cleaned.csv

echo.
echo ============================================
echo UPLOAD COMPLETE!
echo ============================================
echo.
echo Next steps:
echo 1. Check the output above for any errors
echo 2. Verify in Supabase SQL Editor (run verify-upload.sql)
echo 3. Test the app at http://localhost:3000
echo.
pause
