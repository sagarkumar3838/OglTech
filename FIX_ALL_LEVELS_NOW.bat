@echo off
echo ========================================
echo FIX ALL LEVELS TO easy/medium/hard
echo ========================================
echo.
echo This will convert ALL skills in your questions table:
echo   Basic/Beginner      --^> easy
echo   Intermediate        --^> medium
echo   Advanced            --^> hard
echo.
echo ========================================
echo INSTRUCTIONS:
echo ========================================
echo.
echo 1. Open Supabase Dashboard
echo 2. Go to SQL Editor
echo 3. Copy and paste: FIX_ALL_LEVELS_TO_EASY_MEDIUM_HARD.sql
echo 4. Click RUN
echo.
echo The SQL will show:
echo   - BEFORE: Current level names
echo   - AFTER: All converted to easy/medium/hard
echo   - Breakdown by skill
echo   - Devtools verification
echo.
echo ========================================
echo VERIFICATION:
echo ========================================
echo.
echo After running, you can verify with:
echo   CHECK_ALL_SKILLS_LEVELS.sql
echo.
echo This will show all skills and their levels.
echo You should see ONLY: easy, medium, hard
echo.
pause
