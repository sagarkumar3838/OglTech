@echo off
echo ========================================
echo   FIX AND UPLOAD JAVA BEGINNER QUESTIONS
echo ========================================
echo.
echo This will:
echo 1. Fix CSV formatting issues
echo 2. Delete existing Java Basic questions
echo 3. Upload all valid questions from CSV
echo.
pause

cd /d "%~dp0"
npx tsx scripts/fix-java-csv-and-upload.ts

echo.
echo ========================================
echo   DONE!
echo ========================================
echo.
echo Now verify in Supabase SQL Editor:
echo SELECT COUNT(*) FROM practice_questions WHERE skill = 'Java' AND level = 'Basic';
echo.
pause
