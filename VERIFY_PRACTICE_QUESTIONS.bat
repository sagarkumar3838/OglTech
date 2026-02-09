@echo off
echo ============================================
echo VERIFY PRACTICE PAGE QUESTIONS
echo ============================================
echo.
echo This will check if you have MCQ questions in the questions table
echo.
pause

echo.
echo Running SQL check...
echo.

REM You need to run this SQL in Supabase SQL Editor:
echo Please run this SQL in Supabase SQL Editor:
echo.
echo SELECT skill, level, COUNT(*) as count
echo FROM questions
echo GROUP BY skill, level
echo ORDER BY skill, level;
echo.
echo.
echo If you see results, refresh your browser at http://localhost:3000/practice
echo If no results, you need to add MCQ questions to the questions table
echo.
pause
