@echo off
echo ============================================
echo COMPLETE QUESTIONS DATABASE FIX
echo ============================================
echo.
echo This script will:
echo 1. Check current database state
echo 2. Standardize all existing questions
echo 3. Upload HTML easy questions from CSV
echo 4. Remove duplicates
echo 5. Verify the fix worked
echo.
echo Press any key to start...
pause > nul

echo.
echo Running fix script...
echo.

npx tsx scripts/fix-questions-complete.ts

echo.
echo ============================================
echo FIX COMPLETE!
echo ============================================
echo.
echo You can now test the evaluation system.
echo.
pause
