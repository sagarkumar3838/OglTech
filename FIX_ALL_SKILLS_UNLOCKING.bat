@echo off
echo ========================================
echo FIX LEVEL UNLOCKING FOR ALL SKILLS
echo ========================================
echo.
echo This will fix level unlocking for:
echo   - HTML (Easy, Medium, Hard)
echo   - CSS (Easy, Medium, Hard)
echo   - JavaScript (Easy, Medium, Hard)
echo   - jQuery (Easy, Medium, Hard)
echo   - OGL Knowledge (Easy, Medium, Hard)
echo.
echo ========================================
echo STEP 1: RUN SQL FIX
echo ========================================
echo 1. Open Supabase SQL Editor
echo 2. Copy and paste: fix-scorecard-skill-names.sql
echo 3. Click "Run"
echo.
echo ========================================
echo STEP 2: REFRESH BROWSER
echo ========================================
echo 1. Go to: http://localhost:3001/careers/ogl-content-developer
echo 2. Press: Ctrl + Shift + R (hard refresh)
echo 3. Open Console: F12
echo.
echo ========================================
echo STEP 3: CHECK CONSOLE LOGS
echo ========================================
echo You should see:
echo   - Processing scorecard: skill="HTML", level="easy", score=XX
echo   - Unlocking medium for HTML (scored XX%% on easy)
echo   - Unlocking medium for CSS (scored XX%% on easy)
echo.
echo ========================================
echo EXPECTED RESULTS:
echo ========================================
echo If you scored 70%%+ on Easy:
echo   - Medium level will be UNLOCKED
echo   - You can click "AI Generated" or "From Database"
echo.
echo If you scored 70%%+ on Medium:
echo   - Hard level will be UNLOCKED
echo.
echo ========================================
echo For detailed guide, read: FIX_ALL_LEVEL_UNLOCKING.md
echo ========================================
echo.
pause
