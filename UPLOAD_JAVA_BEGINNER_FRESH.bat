@echo off
echo ========================================
echo UPLOADING JAVA BEGINNER QUESTIONS
echo ========================================
echo.
echo This will:
echo 1. Delete all existing Java Basic questions
echo 2. Upload all 102 questions from java-beginner.csv
echo.
pause

call npx tsx scripts/upload-java-beginner-fresh.ts

echo.
echo ========================================
echo UPLOAD COMPLETE!
echo ========================================
echo.
echo Next steps:
echo 1. Run CHECK_JAVA_BEGINNER_IN_DATABASE.sql in Supabase SQL Editor
echo 2. Verify you see 102 Java Basic questions
echo.
pause
