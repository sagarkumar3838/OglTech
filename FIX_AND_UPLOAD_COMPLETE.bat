@echo off
echo ========================================
echo CSV Files Fixed and Ready to Upload
echo ========================================
echo.
echo All CSV files have been fixed with consistent level names:
echo   - Beginner (not "Basic")
echo   - Intermediate
echo   - Advanced
echo.
echo Total: 9,464 questions ready to upload
echo.
echo ========================================
echo BEFORE UPLOADING:
echo ========================================
echo.
echo 1. Go to Supabase SQL Editor
echo 2. Run this SQL:
echo.
echo    ALTER TABLE practice_questions DISABLE ROW LEVEL SECURITY;
echo    GRANT ALL ON practice_questions TO anon;
echo    GRANT ALL ON practice_questions TO authenticated;
echo    GRANT ALL ON practice_questions TO service_role;
echo.
echo 3. Press any key here to start upload
echo.
pause
echo.
echo ========================================
echo Starting Upload...
echo ========================================
echo.
npx tsx scripts/upload-valid-questions-only.ts
echo.
echo ========================================
echo Upload Complete!
echo ========================================
echo.
echo Verify in Supabase with:
echo   SELECT COUNT(*) FROM practice_questions;
echo.
echo Should show: 9464 questions
echo.
pause
