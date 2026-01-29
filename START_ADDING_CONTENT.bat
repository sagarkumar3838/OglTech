@echo off
echo ========================================
echo   Topic Content Setup Helper
echo ========================================
echo.
echo This will help you add content to your topics.
echo.
echo STEP 1: Database Setup
echo ----------------------
echo 1. Open Supabase Dashboard
echo 2. Go to SQL Editor
echo 3. Run these files in order:
echo    - evaluation-tracking-system.sql
echo    - seed-topic-references.sql
echo    - seed-complete-topic-content-ALL.sql
echo.
pause
echo.
echo STEP 2: Start Your App
echo ----------------------
cd client
start cmd /k "npm run dev"
echo.
echo App starting at: http://localhost:5173
echo.
pause
echo.
echo STEP 3: Open Admin Interface
echo ----------------------------
start http://localhost:5173/admin/topics
echo.
echo Admin interface opened in browser!
echo.
echo STEP 4: Add Your First Topic
echo ----------------------------
echo 1. Enter topic slug (e.g., html-forms)
echo 2. Add content sections
echo 3. Add videos
echo 4. Verify at /topics/[slug]
echo.
echo.
echo Quick Reference:
echo ---------------
echo - Admin UI: http://localhost:5173/admin/topics
echo - Browse Topics: http://localhost:5173/topics
echo - Weak Topics: http://localhost:5173/weak-topics
echo.
echo Documentation:
echo --------------
echo - COMPLETE_MANUAL_SETUP_GUIDE.md (Start here!)
echo - MANUAL_TOPIC_CONTENT_GUIDE.md (Detailed guide)
echo - FINAL_IMPLEMENTATION_SUMMARY.md (Overview)
echo.
echo.
echo Ready to add content!
echo.
pause
