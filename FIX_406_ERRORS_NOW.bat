@echo off
echo ============================================
echo FIXING 406 ERRORS - RLS POLICIES
echo ============================================
echo.
echo This will fix the user_progress table RLS policies
echo that are causing 406 errors in your application.
echo.
echo INSTRUCTIONS:
echo 1. Open Supabase Dashboard (https://supabase.com/dashboard)
echo 2. Go to your project
echo 3. Click on "SQL Editor" in the left sidebar
echo 4. Copy the contents of FIX_406_ERRORS_COMPLETE.sql
echo 5. Paste into the SQL Editor
echo 6. Click "Run" to execute
echo.
echo After running the SQL:
echo 1. Refresh your application
echo 2. The 406 errors should be gone
echo 3. Check browser console to verify
echo.
pause
echo.
echo Opening the SQL file...
notepad FIX_406_ERRORS_COMPLETE.sql
echo.
echo Done! Now copy and run this in Supabase SQL Editor.
pause
