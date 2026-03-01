@echo off
echo ========================================
echo DEPLOY ALL CSV FILES TO SUPABASE
echo ========================================
echo.
echo This will upload ALL CSV files from the questions folder
echo Duplicates will be automatically skipped
echo.
pause

echo.
echo 🚀 Starting upload process...
echo.

npm run upload:all-csv

echo.
echo ========================================
echo Upload process completed!
echo ========================================
pause
