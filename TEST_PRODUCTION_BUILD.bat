@echo off
echo ========================================
echo PRODUCTION BUILD TESTING
echo ========================================
echo.
echo Build Status: SUCCESS
echo Preview Server: http://localhost:4174/
echo.
echo ========================================
echo QUICK TEST CHECKLIST
echo ========================================
echo.
echo 1. Authentication
echo    - Sign up new account
echo    - Fill profile page
echo    - Login/Logout
echo.
echo 2. Dashboard
echo    - Profile card shows real data
echo    - Recent test history (last 5 tests)
echo    - Career progress cards
echo.
echo 3. Level Unlocking
echo    - Easy always unlocked
echo    - Medium unlocks at 70%+ on Easy
echo    - Hard unlocks at 70%+ on Medium
echo.
echo 4. Scorecard
echo    - Shows all scores
echo    - Shows explanations for wrong answers
echo    - Shows learning resources for failed topics
echo.
echo 5. Analytics
echo    - Shows your rank
echo    - Shows percentile
echo    - Shows test history
echo.
echo 6. OGL Pages
echo    - Main career page
echo    - Progress, Journey, Evaluations, Courses, Hands-On
echo.
echo ========================================
echo TESTING URLS
echo ========================================
echo.
echo Home:       http://localhost:4174/
echo Dashboard:  http://localhost:4174/dashboard
echo Career:     http://localhost:4174/careers/ogl-content-developer
echo Analytics:  http://localhost:4174/analytics
echo Profile:    http://localhost:4174/profile
echo.
echo ========================================
echo IMPORTANT NOTES
echo ========================================
echo.
echo - All data must be REAL from database
echo - No dummy/fake data allowed
echo - Level unlocking must work for ALL skills
echo - Topics only show for FAILED questions
echo - Ranking based on real user scores
echo.
echo ========================================
echo BEFORE DEPLOYMENT
echo ========================================
echo.
echo 1. Test all features above
echo 2. Verify no console errors
echo 3. Check mobile responsiveness
echo 4. Test with different user accounts
echo 5. Verify database queries work
echo.
echo ========================================
echo DEPLOYMENT READY?
echo ========================================
echo.
echo If all tests pass, follow DEPLOYMENT_GUIDE.md
echo.
echo Commands:
echo   Vercel:   cd client ^&^& vercel
echo   Firebase: cd client ^&^& firebase deploy --only hosting
echo.
echo ========================================
pause
