@echo off
echo ========================================
echo FIX LEVEL UNLOCKING ISSUE
echo ========================================
echo.
echo This will fix your scorecard data so that:
echo 1. Skill names match the career definitions (HTML, CSS, etc.)
echo 2. Level names are normalized to lowercase (easy, medium, hard)
echo 3. Medium level will unlock after passing Easy with 70%%+
echo.
echo ========================================
echo INSTRUCTIONS:
echo ========================================
echo 1. Open Supabase SQL Editor
echo 2. Copy and paste the contents of: fix-scorecard-skill-names.sql
echo 3. Click "Run" to execute the SQL
echo 4. Refresh your browser at: http://localhost:3001/careers/ogl-content-developer
echo 5. Medium level should now be unlocked!
echo.
echo ========================================
echo CHECKING YOUR DATA:
echo ========================================
echo To see your current scorecard data, run: check-scorecards-data.sql
echo.
pause
