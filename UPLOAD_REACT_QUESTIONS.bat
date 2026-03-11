@echo off
echo ========================================
echo Uploading React Questions
echo ========================================
echo.
echo Uploading:
echo   - react-beginner.csv
echo   - react-intermediate.csv
echo   - react-advanced.csv
echo.
echo ========================================
echo.

UPLOAD_CSV_NO_DUPLICATES.bat questions/react-beginner.csv questions/react-intermediate.csv questions/react-advanced.csv

echo.
echo ========================================
echo Done!
echo ========================================
pause
