@echo off
echo ============================================
echo Dashboard Demo Setup
echo ============================================
echo.
echo This will help you set up the dashboard with sample data.
echo.
echo STEP 1: Setup Database Tables
echo ---------------------------------------------
echo 1. Open your Supabase SQL Editor
echo 2. Copy the contents of: create-career-skill-requirements.sql
echo 3. Paste and run it in Supabase
echo.
pause
echo.
echo STEP 2: Get Your User ID
echo ---------------------------------------------
echo Option A - From Browser Console:
echo   1. Open http://localhost:3000
echo   2. Press F12 to open console
echo   3. Type: localStorage.getItem('user')
echo   4. Copy the 'id' value
echo.
echo Option B - From Supabase:
echo   Run this query in Supabase SQL Editor:
echo   SELECT DISTINCT user_id FROM user_progress LIMIT 1;
echo.
pause
echo.
echo STEP 3: Add Sample Data (Optional)
echo ---------------------------------------------
echo 1. Open: seed-sample-dashboard-data.sql
echo 2. Replace 'YOUR_USER_ID' with your actual user ID
echo 3. Copy and paste into Supabase SQL Editor
echo 4. Run the query
echo.
pause
echo.
echo STEP 4: View Dashboard
echo ---------------------------------------------
echo 1. Go to: http://localhost:3000/dashboard
echo 2. You should see:
echo    - Career name and qualification status
echo    - Skill progress with scores
echo    - Weak areas (CSS Intermediate - failed twice)
echo    - Test history (7 tests total)
echo.
echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo What the sample data shows:
echo - Career: OGL Content Developer
echo - Progress: 2/5 skills completed
echo - HTML: Basic (85%%) + Intermediate (75%% - passed on 2nd try)
echo - CSS: Basic (80%%) + Intermediate (65%% - failed twice)
echo - JavaScript: Basic (90%%)
echo - jQuery: Not started
echo - OGL Knowledge: Not started
echo.
echo Weak Area Highlighted:
echo - CSS Intermediate (2 failed attempts, best score 65%%)
echo.
pause
