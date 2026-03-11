@echo off
echo ========================================
echo FIX MULTIPLE ANSWERS CONSTRAINT ERROR
echo ========================================
echo.
echo You got a constraint error because question_type column already exists.
echo.
echo SOLUTION (2 steps):
echo.
echo Step 1: Fix the constraint
echo   File: FIX_QUESTION_TYPE_CONSTRAINT.sql
echo   Action: Copy and run in Supabase SQL Editor
echo.
echo Step 2: Run the fixed migration
echo   File: add-multiple-correct-answers-support-FIXED.sql
echo   Action: Copy and run in Supabase SQL Editor
echo.
echo ========================================
echo.
pause
echo.
echo Opening guide...
start FIX_CONSTRAINT_ERROR_NOW.md
echo.
echo Next: Open Supabase SQL Editor and run the 2 SQL files above
echo.
pause
