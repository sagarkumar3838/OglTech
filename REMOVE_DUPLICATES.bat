@echo off
echo ========================================
echo  REMOVE DUPLICATE IMAGES
echo ========================================
echo.
echo This script will:
echo.
echo 1. Find all duplicate images (same URL)
echo 2. Show you which ones are duplicates
echo 3. Remove duplicates (keeps oldest entry)
echo 4. Fix position numbers to be sequential
echo 5. Verify everything is clean
echo.
echo ========================================
echo  STEPS:
echo ========================================
echo.
echo 1. Open Supabase Dashboard
echo    https://supabase.com/dashboard
echo.
echo 2. Go to: SQL Editor
echo.
echo 3. Open file: find-and-remove-duplicate-images.sql
echo.
echo 4. Copy ALL the SQL code
echo.
echo 5. Paste into SQL Editor
echo.
echo 6. Click RUN (or press Ctrl+Enter)
echo.
echo 7. Review the results:
echo    - First query shows duplicates found
echo    - Last query shows clean list
echo.
echo 8. Refresh your app!
echo.
echo ========================================
echo.
echo SAFE: This keeps the OLDEST entry for each image
echo       and removes newer duplicates.
echo.
pause
start find-and-remove-duplicate-images.sql
