@echo off
echo ========================================
echo  FIX ALL DUPLICATE QUESTIONS
echo ========================================
echo.
echo This will remove ALL duplicate questions
echo from your database across ALL skills.
echo.
echo ========================================
echo  INSTRUCTIONS
echo ========================================
echo.
echo Step 1: DIAGNOSE
echo   - Open Supabase SQL Editor
echo   - Run: DIAGNOSE_ALL_DUPLICATES.sql
echo   - See how many duplicates exist
echo.
echo Step 2: CLEAN
echo   - Run: CLEAN_DUPLICATES_UUID_FIX.sql
echo   - This removes all duplicates
echo   - Adds unique constraint
echo.
echo Step 3: VERIFY
echo   - Check the results in the output
echo   - Should show "All duplicates removed"
echo.
echo ========================================
echo  FILES CREATED
echo ========================================
echo.
echo   DIAGNOSE_ALL_DUPLICATES.sql
echo   CLEAN_DUPLICATES_UUID_FIX.sql (USE THIS ONE)
echo   CLEAN_ALL_DUPLICATES_COMPLETE.sql (alternative)
echo   FIX_ALL_DUPLICATES_NOW.md
echo.
echo ========================================
echo.
echo Read FIX_ALL_DUPLICATES_NOW.md for details
echo.
pause
