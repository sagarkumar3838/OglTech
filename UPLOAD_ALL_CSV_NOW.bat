@echo off
echo ========================================
echo UPLOAD ALL CSV FILES TO DATABASE
echo ========================================
echo.

cd scripts
npx ts-node upload-csv-direct.ts

echo.
echo ========================================
echo NEXT STEP:
echo Run CHECK_AND_FIX_QUESTIONS.sql in Supabase
echo ========================================
pause
