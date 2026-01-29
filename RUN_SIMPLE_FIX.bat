@echo off
cls
echo ============================================
echo SIMPLE RLS FIX - NO ERRORS
echo ============================================
echo.
echo This version checks if tables exist before fixing them.
echo No more "relation does not exist" errors!
echo.
echo STEP 1: Check what tables you have
echo ============================================
echo First, let's see what tables exist in your database.
echo.
pause
start "" "https://supabase.com/dashboard"
notepad check-existing-tables.sql
echo.
echo Copy the SQL above and run it in Supabase SQL Editor.
echo This will show you which tables exist.
echo.
pause
echo.
echo STEP 2: Fix the tables
echo ============================================
echo Now we'll fix only the tables that exist.
echo.
pause
notepad FIX_RLS_SIMPLE_SAFE.sql
echo.
echo Copy the SQL above and run it in Supabase SQL Editor.
echo This will fix all existing tables safely.
echo.
echo ============================================
echo DONE!
echo ============================================
pause
