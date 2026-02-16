@echo off
echo ========================================
echo COPY ALL QUESTIONS TO MAIN TABLE
echo ========================================
echo.
echo PROBLEM: Your questions are in the WRONG table!
echo.
echo   practice_questions = 9,464 questions (uploaded here)
echo   questions          = 0 questions (app reads from here)
echo.
echo SOLUTION: Copy from practice_questions to questions
echo.
echo ========================================
echo INSTRUCTIONS:
echo ========================================
echo.
echo 1. Open Supabase Dashboard
echo 2. Go to SQL Editor
echo 3. Copy this file: COPY_PRACTICE_TO_QUESTIONS_WITH_LEVELS.sql
echo 4. Paste and click RUN
echo.
echo ========================================
echo WHAT IT DOES:
echo ========================================
echo.
echo 1. Clears questions table
echo 2. Copies all 9,464 questions
echo 3. Converts levels: Basic -^> easy, Intermediate -^> medium, Advanced -^> hard
echo 4. Shows verification results
echo.
echo ========================================
echo AFTER RUNNING:
echo ========================================
echo.
echo Your app will show ALL questions:
echo   - Devtools: 453 questions
echo   - HTML: questions visible
echo   - JavaScript: questions visible
echo   - All 123 skills working!
echo.
pause
