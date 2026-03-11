@echo off
echo ============================================================
echo FIX CYPRESS CASE SENSITIVITY
echo ============================================================
echo.
echo Current problem:
echo - "cypress" (lowercase): 258 beginner questions
echo - "Cypress" (capital C): 275 intermediate + 184 advanced = 459 questions
echo.
echo This will merge them all into lowercase "cypress"
echo.
pause

echo.
echo Opening Supabase SQL Editor...
echo.

start https://supabase.com/dashboard/project/_/sql

echo.
echo INSTRUCTIONS:
echo 1. Copy ALL the SQL from FIX_CYPRESS_CASE_NOW.sql
echo 2. Paste into Supabase SQL Editor
echo 3. Click RUN
echo 4. You should see all questions merged under "cypress"
echo.
echo After running SQL, press any key to continue...
pause

echo.
echo ============================================================
echo DONE! All Cypress questions are now lowercase "cypress"
echo ============================================================
echo.
echo Final count should be:
echo - cypress beginner: 258
echo - cypress intermediate: 275
echo - cypress advanced: 184
echo - TOTAL: 717 questions
echo.
pause
