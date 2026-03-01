@echo off
echo ========================================
echo FIXING JAVA BEGINNER CSV
echo ========================================
echo.
echo This will fix the 3 CSV formatting issues:
echo - Row 54: Extra field
echo - Row 67: Malformed trailing quote
echo - Row 90: Malformed trailing quote
echo.
pause

cd scripts
npx tsx fix-java-csv-simple.ts
cd ..

echo.
echo ========================================
echo DONE!
echo ========================================
echo.
echo Now you can upload the fixed CSV to Supabase
echo using the Table Editor import feature.
echo.
pause
