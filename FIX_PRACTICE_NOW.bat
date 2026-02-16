@echo off
echo ========================================
echo FIX PRACTICE PAGE - QUESTIONS NOT SHOWING
echo ========================================
echo.
echo Problem: Questions in practice_questions table
echo Solution: Copy to questions table
echo.
echo ========================================
echo STEP 1: Open Supabase
echo ========================================
echo.
echo 1. Go to: https://ksjgsgebjnpwyycnptom.supabase.co
echo 2. Click "SQL Editor" in left sidebar
echo 3. Click "New Query"
echo.
pause
echo.
echo ========================================
echo STEP 2: Copy This SQL
echo ========================================
echo.
echo Opening SQL file in Notepad...
echo Copy ALL the SQL code from the file that opens
echo.
pause
notepad COPY_PRACTICE_QUESTIONS_TO_MAIN.sql
echo.
echo ========================================
echo STEP 3: Run in Supabase
echo ========================================
echo.
echo 1. Paste the SQL into Supabase SQL Editor
echo 2. Click "Run" button (or press Ctrl+Enter)
echo 3. Wait for it to complete
echo.
pause
echo.
echo ========================================
echo STEP 4: Test in App
echo ========================================
echo.
echo Opening Practice page...
start https://skillevaluate.web.app/practice
echo.
echo 1. Select any skill (Java, Python, etc.)
echo 2. Select "Beginner" level
echo 3. Questions should load!
echo.
echo ========================================
echo DONE!
echo ========================================
echo.
echo If questions still don't show:
echo 1. Check RUN_THIS_NOW_SIMPLE.md for troubleshooting
echo 2. Or run FIX_ALL_SKILLS_COMPLETE.sql for advanced fix
echo.
pause
