@echo off
echo ========================================
echo Fixing Angular Advanced CSV File
echo ========================================
echo.

echo Running TypeScript fix script...
npx tsx scripts/fix-angular-advanced-csv.ts

echo.
echo ========================================
echo Fix Complete!
echo ========================================
echo.
echo The fixed file is: questions/angular-advanced-fixed.csv
echo Original backup is: questions/angular-advanced.csv.backup
echo.
echo To replace the original file with the fixed version:
echo   Copy-Item "questions/angular-advanced-fixed.csv" "questions/angular-advanced.csv" -Force
echo.
pause
