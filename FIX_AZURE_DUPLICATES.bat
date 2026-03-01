@echo off
echo ========================================
echo  FIX AZURE ADVANCED DUPLICATES
echo ========================================
echo.
echo This will:
echo 1. Diagnose duplicate Azure Advanced questions
echo 2. Remove duplicates (keeping first occurrence)
echo 3. Verify the cleanup
echo.
echo ========================================
echo.
echo INSTRUCTIONS:
echo.
echo 1. Open Supabase SQL Editor
echo 2. Copy and paste: diagnose-azure-duplicates.sql
echo 3. Run it to see the duplicate count
echo.
echo 4. Then copy and paste: CLEAN_AZURE_DUPLICATES_SAFE.sql
echo 5. Run it to remove duplicates
echo.
echo ========================================
echo.
echo Files created:
echo   - diagnose-azure-duplicates.sql (check duplicates)
echo   - CLEAN_AZURE_DUPLICATES_SAFE.sql (remove duplicates)
echo   - remove-azure-duplicates.sql (alternative method)
echo.
pause
