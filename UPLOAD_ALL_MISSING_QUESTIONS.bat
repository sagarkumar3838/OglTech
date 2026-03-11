@echo off
echo ========================================
echo Uploading Missing Questions to Database
echo ========================================
echo.

echo This will upload all newly generated questions to reach 100+ per skill
echo.
pause

echo.
echo Installing dependencies...
cd client
call npm install papaparse
cd ..

echo.
echo Running upload script...
node scripts/upload-missing-questions.ts

echo.
echo ========================================
echo Upload Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Run CHECK_ALL_SKILLS_COMPLETE_STATUS.sql to verify
echo 2. Test Practice page to ensure questions display
echo 3. Check for any duplicates
echo.
pause
