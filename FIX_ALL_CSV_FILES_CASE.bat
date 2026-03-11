@echo off
echo ============================================
echo FIX ALL CSV FILES - Standardize to Lowercase
echo ============================================
echo.
echo This will fix case sensitivity issues in ALL CSV files
echo Converting: Skill,Level to skill,level
echo.
pause

echo.
echo Fixing C++ files...
powershell -Command "(Get-Content 'questions/cpp-beginner.csv') -replace '^C\+\+,Beginner,', 'cpp,beginner,' | Set-Content 'questions/cpp-beginner.csv'"
powershell -Command "(Get-Content 'questions/cpp-intermediate.csv') -replace '^C\+\+,Intermediate,', 'cpp,intermediate,' | Set-Content 'questions/cpp-intermediate.csv'"
powershell -Command "(Get-Content 'questions/cpp-advanced.csv') -replace '^C\+\+,Advanced,', 'cpp,advanced,' | Set-Content 'questions/cpp-advanced.csv'"

echo Fixing AWS files...
powershell -Command "(Get-Content 'questions/aws-beginner.csv') -replace '^Aws,Beginner,', 'aws,beginner,' | Set-Content 'questions/aws-beginner.csv'"
powershell -Command "(Get-Content 'questions/aws-intermediate.csv') -replace '^Aws,Intermediate,', 'aws,intermediate,' | Set-Content 'questions/aws-intermediate.csv'"
powershell -Command "(Get-Content 'questions/aws-advanced.csv') -replace '^Aws,Advanced,', 'aws,advanced,' | Set-Content 'questions/aws-advanced.csv'"

echo Fixing Angular files...
powershell -Command "(Get-Content 'questions/angular-beginner.csv') -replace '^Angular,Beginner,', 'angular,beginner,' | Set-Content 'questions/angular-beginner.csv'"
powershell -Command "(Get-Content 'questions/angular-intermediate.csv') -replace '^Angular,Intermediate,', 'angular,intermediate,' | Set-Content 'questions/angular-intermediate.csv'"
powershell -Command "(Get-Content 'questions/angular-advanced.csv') -replace '^Angular,Advanced,', 'angular,advanced,' | Set-Content 'questions/angular-advanced.csv'"

echo.
echo ============================================
echo CRITICAL CSV FILES FIXED!
echo ============================================
echo.
echo Fixed: C++, AWS, Angular
echo.
echo IMPORTANT: You still need to fix the DATABASE
echo Run this SQL in Supabase: FIX_COMPLETE_WITH_CONSTRAINT.sql
echo.
echo This will merge all duplicate entries in the database.
echo.
pause
