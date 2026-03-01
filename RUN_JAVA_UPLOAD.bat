@echo off
echo ========================================
echo UPLOADING JAVA BEGINNER QUESTIONS
echo ========================================
echo.
echo This will:
echo 1. Delete existing Java Basic questions (10 old ones)
echo 2. Upload all 102 questions from java-beginner.csv
echo.
pause

echo.
echo Running upload script...
echo.

npx tsx scripts/upload-java-beginner-fresh.ts

echo.
echo ========================================
echo DONE!
echo ========================================
echo.
echo Next: Run CHECK_JAVA_BEGINNER_IN_DATABASE.sql
echo        to verify 102 questions were uploaded
echo.
pause
