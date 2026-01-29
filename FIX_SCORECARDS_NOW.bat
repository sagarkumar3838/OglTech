@echo off
echo ========================================
echo FIX SCORECARDS TABLE - RLS POLICIES
echo ========================================
echo.
echo This will fix the scorecards table permissions
echo so you can save test results to the database.
echo.
echo INSTRUCTIONS:
echo 1. Open Supabase Dashboard: https://supabase.com/dashboard
echo 2. Go to your project
echo 3. Click "SQL Editor" in the left sidebar
echo 4. Copy the contents of: fix-scorecards-table.sql
echo 5. Paste into SQL Editor
echo 6. Click "Run"
echo.
echo The SQL file will:
echo   - Enable RLS on scorecards table
echo   - Create policies for SELECT, INSERT, UPDATE, DELETE
echo   - Grant permissions to authenticated users
echo.
echo After running the SQL:
echo   - Complete a test evaluation
echo   - Check console for success message
echo   - Go to Dashboard to see your progress
echo.
pause
start "" "https://supabase.com/dashboard"
notepad fix-scorecards-table.sql
