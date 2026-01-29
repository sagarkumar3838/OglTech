@echo off
cls
echo ============================================
echo PERMANENT FIX FOR ALL RLS POLICIES
echo ============================================
echo.
echo This will fix the UUID vs TEXT issue PERMANENTLY
echo across ALL tables in your database.
echo.
echo You only need to run this ONCE.
echo.
echo What this does:
echo   1. Drops all existing RLS policies
echo   2. Enables RLS on all tables
echo   3. Creates universal policies that work for BOTH TEXT and UUID
echo   4. Grants all necessary permissions
echo   5. Verifies everything is set up correctly
echo.
echo After running this, you will NEVER see:
echo   - "operator does not exist: uuid = text" errors
echo   - 406 errors on user_progress, scorecards, etc.
echo   - RLS permission errors
echo.
echo ============================================
echo INSTRUCTIONS:
echo ============================================
echo 1. Open Supabase Dashboard (opening now...)
echo 2. Go to SQL Editor
echo 3. Copy ALL contents of: PERMANENT_FIX_ALL_RLS_POLICIES.sql
echo 4. Paste into SQL Editor
echo 5. Click "Run"
echo 6. Wait for success message
echo.
echo That's it! You're done forever.
echo ============================================
echo.
pause
start "" "https://supabase.com/dashboard"
notepad PERMANENT_FIX_ALL_RLS_POLICIES.sql
