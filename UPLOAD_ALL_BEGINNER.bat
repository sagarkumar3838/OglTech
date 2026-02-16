@echo off
echo ============================================
echo UPLOAD ALL BEGINNER QUESTIONS TO DATABASE
echo ============================================
echo.
echo This will upload ALL *-beginner.csv files to practice_questions table
echo.
cd scripts
call npm install
node upload-beginner-questions.js
pause
