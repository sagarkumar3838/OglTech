@echo off
echo ============================================
echo SQL Fixes for User Progress
echo ============================================
echo.
echo IMPORTANT: You need to run these SQL scripts in your Supabase SQL Editor
echo.
echo Step 1: Go to https://supabase.com/dashboard
echo Step 2: Select your project
echo Step 3: Go to SQL Editor
echo Step 4: Copy and paste the contents of these files:
echo.
echo    1. fix-user-progress-rls.sql
echo    2. add-overall-completion-column.sql
echo.
echo Step 5: Click "Run" for each script
echo.
echo ============================================
echo.
echo Opening SQL files in notepad...
echo.

start notepad fix-user-progress-rls.sql
timeout /t 2 /nobreak >nul
start notepad add-overall-completion-column.sql

echo.
echo SQL files opened! Copy their contents to Supabase SQL Editor.
echo.
pause
