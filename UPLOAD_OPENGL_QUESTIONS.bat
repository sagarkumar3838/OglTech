@echo off
echo ============================================
echo UPLOAD OPENGL QUESTIONS TO SUPABASE
echo ============================================
echo.

echo Checking if OpenGL question files exist...
if not exist "questions\opengl-beginner.csv" (
    echo ERROR: questions\opengl-beginner.csv not found!
    echo.
    echo Please create the file first or check the filename.
    pause
    exit /b 1
)

if not exist "questions\opengl-intermediate.csv" (
    echo WARNING: questions\opengl-intermediate.csv not found!
)

if not exist "questions\opengl-advanced.csv" (
    echo WARNING: questions\opengl-advanced.csv not found!
)

echo.
echo Files found! Starting upload...
echo.

echo Running upload script...
npx tsx scripts/upload-all-questions.ts

echo.
echo ============================================
echo UPLOAD COMPLETE
echo ============================================
echo.
echo Next steps:
echo 1. Go to Supabase SQL Editor
echo 2. Run: check-opengl-questions.sql
echo 3. Verify questions are uploaded correctly
echo 4. Test in the Practice page
echo.
pause
