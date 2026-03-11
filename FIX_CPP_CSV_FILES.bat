@echo off
echo ============================================
echo FIX C++ CSV FILES - Replace C++ with cpp
echo ============================================
echo.

echo Fixing cpp-beginner.csv...
powershell -Command "(Get-Content 'questions/cpp-beginner.csv') -replace '^C\+\+,Beginner,', 'cpp,beginner,' | Set-Content 'questions/cpp-beginner.csv'"

echo Fixing cpp-intermediate.csv...
powershell -Command "(Get-Content 'questions/cpp-intermediate.csv') -replace '^C\+\+,Intermediate,', 'cpp,intermediate,' | Set-Content 'questions/cpp-intermediate.csv'"

echo Fixing cpp-advanced.csv...
powershell -Command "(Get-Content 'questions/cpp-advanced.csv') -replace '^C\+\+,Advanced,', 'cpp,advanced,' | Set-Content 'questions/cpp-advanced.csv'"

echo.
echo ============================================
echo CSV FILES FIXED!
echo ============================================
echo.
echo All C++ CSV files now use: cpp,beginner / cpp,intermediate / cpp,advanced
echo.
echo Next steps:
echo 1. Run FIX_CPP_MERGE_NOW.sql in Supabase to merge existing database entries
echo 2. Future CSV uploads will use correct format
echo.
pause
