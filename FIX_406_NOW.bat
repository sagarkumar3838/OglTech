@echo off
echo ============================================
echo FIX 406 ERROR - SUPABASE SETUP
echo ============================================
echo.
echo This will help you fix the 406 errors from Supabase
echo.
echo STEPS TO FIX:
echo.
echo 1. Go to: https://supabase.com/dashboard
echo 2. Select your project
echo 3. Click "SQL Editor" in the left sidebar
echo 4. Copy and paste the contents of: fix-406-complete.sql
echo 5. Click "Run" to execute the SQL
echo.
echo ============================================
echo OPENING FILES FOR YOU...
echo ============================================
echo.

REM Open the SQL fix file
start notepad fix-406-complete.sql

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Open the guide
start notepad FIX_406_ERROR_GUIDE.md

echo.
echo ✅ Files opened!
echo.
echo NEXT STEPS:
echo 1. Copy the SQL from fix-406-complete.sql
echo 2. Paste it in Supabase SQL Editor
echo 3. Click Run
echo 4. Refresh your app
echo.
echo Press any key to open Supabase Dashboard...
pause >nul

REM Open Supabase dashboard
start https://supabase.com/dashboard

echo.
echo ✅ Done! Follow the guide to complete the fix.
echo.
pause
