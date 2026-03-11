@echo off
echo ========================================
echo Generating Question Database Report
echo ========================================
echo.

cd /d "%~dp0"

echo Running report generator...
call npx tsx scripts/generate-question-report.ts

echo.
echo ========================================
echo Report Complete!
echo Check QUESTION_DATABASE_REPORT.txt
echo ========================================
echo.
pause
