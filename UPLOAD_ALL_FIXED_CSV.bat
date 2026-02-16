@echo off
echo ========================================
echo  Upload All Fixed CSV Files to Supabase
echo ========================================
echo.
echo This will upload all 133 CSV files to your Supabase database.
echo Make sure you have your .env file configured with Supabase credentials.
echo.
pause

echo.
echo Starting upload process...
echo.

npx tsx scripts/upload-all-questions.ts

echo.
echo ========================================
echo  Upload Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Verify the upload in Supabase dashboard
echo 2. Run verification queries to check data
echo.
pause
