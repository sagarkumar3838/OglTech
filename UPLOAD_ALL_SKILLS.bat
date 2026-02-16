@echo off
echo ============================================
echo UPLOAD ALL SKILLS TO SUPABASE
echo ============================================
echo.
echo This will upload ALL question CSV files to Supabase
echo.

echo Checking for CSV files...
echo.

set /a count=0

for %%f in (questions\*.csv) do (
    set /a count+=1
    echo Found: %%f
)

echo.
echo Total CSV files found: %count%
echo.

if %count%==0 (
    echo ERROR: No CSV files found in questions\ folder!
    echo.
    echo Please make sure you have CSV files like:
    echo   - questions\java-beginner.csv
    echo   - questions\python-beginner.csv
    echo   - questions\html-beginner.csv
    echo   etc.
    echo.
    pause
    exit /b 1
)

echo.
echo Starting upload...
echo This may take a few minutes depending on how many files you have.
echo.

npx tsx scripts/upload-all-questions.ts

echo.
echo ============================================
echo UPLOAD COMPLETE
echo ============================================
echo.
echo Next steps:
echo 1. Go to Supabase SQL Editor
echo 2. Run: FIX_ALL_SKILLS_COMPLETE.sql
echo 3. Verify all skills are uploaded
echo 4. Test in Practice page
echo.
pause
