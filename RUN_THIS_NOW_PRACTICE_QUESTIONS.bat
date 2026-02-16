@echo off
echo ============================================
echo FIX PRACTICE QUESTIONS - QUICK GUIDE
echo ============================================
echo.
echo Your questions are in: practice_questions table
echo The app looks in: questions table
echo.
echo Solution: Copy all questions to the correct table
echo.
echo ============================================
echo STEP 1: Go to Supabase
echo ============================================
echo.
echo 1. Open: https://ksjgsgebjnpwyycnptom.supabase.co
echo 2. Click "SQL Editor" in left sidebar
echo 3. Click "New Query"
echo.
pause
echo.
echo ============================================
echo STEP 2: Copy and Run SQL
echo ============================================
echo.
echo 1. Open file: COPY_PRACTICE_QUESTIONS_TO_MAIN.sql
echo 2. Copy the SQL from STEP 4 section
echo 3. Paste into Supabase SQL Editor
echo 4. Click "Run" (or press Ctrl+Enter)
echo.
echo The SQL will:
echo   - Copy ALL questions from practice_questions to questions
echo   - Fix skill names (Java -^> java)
echo   - Fix level names (beginner -^> easy)
echo   - Avoid duplicates
echo.
pause
echo.
echo ============================================
echo STEP 3: Verify
echo ============================================
echo.
echo Run this in Supabase SQL Editor:
echo.
echo SELECT skill, COUNT(*) as count
echo FROM questions
echo GROUP BY skill
echo ORDER BY skill;
echo.
echo You should see all your skills with question counts.
echo.
pause
echo.
echo ============================================
echo STEP 4: Test in App
echo ============================================
echo.
echo 1. Go to: https://skillevaluate.web.app/practice
echo 2. Select any skill (Java, Python, etc.)
echo 3. Select "Beginner" level
echo 4. Questions should load!
echo.
echo ============================================
echo DONE!
echo ============================================
echo.
echo If questions still don't show:
echo 1. Check browser console (F12) for errors
echo 2. Verify questions exist: SELECT COUNT(*) FROM questions;
echo 3. Check format: SELECT * FROM questions LIMIT 1;
echo.
echo For detailed help, see: FIX_PRACTICE_QUESTIONS_SIMPLE.md
echo.
pause
