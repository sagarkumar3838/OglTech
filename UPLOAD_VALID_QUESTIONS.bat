@echo off
echo ========================================
echo  Upload Valid Questions to Supabase
echo ========================================
echo.
echo This will upload all CSV files with valid data to Supabase.
echo Files with 0 questions or invalid data will be skipped.
echo.
echo Make sure your .env file has:
echo - VITE_SUPABASE_URL
echo - VITE_SUPABASE_ANON_KEY
echo.
pause

echo.
echo Starting upload...
echo.

npx tsx scripts/upload-valid-questions-only.ts

echo.
echo ========================================
echo  Upload Complete!
echo ========================================
echo.
echo Next: Verify in Supabase SQL Editor:
echo SELECT COUNT(*) FROM practice_questions;
echo.
pause
