@echo off
echo ============================================
echo FIX AWS CSV FILES - Replace Aws with aws
echo ============================================
echo.

echo Fixing aws-beginner.csv...
powershell -Command "(Get-Content 'questions/aws-beginner.csv') -replace '^Aws,Beginner,', 'aws,beginner,' | Set-Content 'questions/aws-beginner.csv'"

echo Fixing aws-intermediate.csv...
powershell -Command "(Get-Content 'questions/aws-intermediate.csv') -replace '^Aws,Intermediate,', 'aws,intermediate,' | Set-Content 'questions/aws-intermediate.csv'"

echo Fixing aws-advanced.csv...
powershell -Command "(Get-Content 'questions/aws-advanced.csv') -replace '^Aws,Advanced,', 'aws,advanced,' | Set-Content 'questions/aws-advanced.csv'"

echo.
echo ============================================
echo AWS CSV FILES FIXED!
echo ============================================
echo.
echo All AWS CSV files now use: aws,beginner / aws,intermediate / aws,advanced
echo.
echo Next steps:
echo 1. Run FIX_COMPLETE_WITH_CONSTRAINT.sql in Supabase to merge ALL skills
echo 2. Or run DIAGNOSE_AWS_SPLIT.sql to see current AWS split
echo.
pause
