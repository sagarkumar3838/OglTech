@echo off
echo ============================================
echo JAVA QUESTIONS QUICK FIX
echo ============================================
echo.
echo This guide will help you fix Java questions not showing.
echo.
echo STEP 1: Find Your Java Table
echo =============================
echo.
echo 1. Go to Supabase: https://ksjgsgebjnpwyycnptom.supabase.co
echo 2. Click "SQL Editor"
echo 3. Open file: FIND_JAVA_TABLE.sql
echo 4. Copy and paste into SQL Editor
echo 5. Click "Run"
echo.
echo Look for a table name like:
echo   - java_questions
echo   - practice_questions_java
echo   - questions_java
echo.
pause
echo.
echo STEP 2: Copy Questions to Main Table
echo =====================================
echo.
echo 1. Open file: COPY_JAVA_QUESTIONS.sql
echo 2. Find the section "STEP 3: COPY QUESTIONS"
echo 3. Replace 'YOUR_JAVA_TABLE' with your actual table name
echo 4. Uncomment the INSERT statement (remove /* and */)
echo 5. Copy and paste into Supabase SQL Editor
echo 6. Click "Run"
echo.
pause
echo.
echo STEP 3: Verify Questions Were Copied
echo =====================================
echo.
echo Run this in Supabase SQL Editor:
echo.
echo SELECT skill, level, type, COUNT(*) as count
echo FROM questions
echo WHERE skill = 'java'
echo GROUP BY skill, level, type;
echo.
echo You should see:
echo   java  ^| easy   ^| mcq ^| 10+
echo   java  ^| medium ^| mcq ^| 10+
echo   java  ^| hard   ^| mcq ^| 10+
echo.
pause
echo.
echo STEP 4: Test in Application
echo ============================
echo.
echo 1. Go to: https://skillevaluate.web.app/practice
echo 2. Select "Java" from dropdown
echo 3. Select "Beginner" level
echo 4. Questions should now load!
echo.
echo ============================================
echo DONE!
echo ============================================
echo.
echo If questions still don't show:
echo 1. Check browser console for errors (F12)
echo 2. Verify questions exist: SELECT COUNT(*) FROM questions WHERE skill='java';
echo 3. Check format: SELECT * FROM questions WHERE skill='java' LIMIT 1;
echo.
echo For detailed help, see: FIX_JAVA_QUESTIONS_COMPLETE_GUIDE.md
echo.
pause
