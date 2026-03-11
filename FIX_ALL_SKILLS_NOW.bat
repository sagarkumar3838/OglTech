@echo off
echo ============================================================================
echo FIX ALL SKILLS CASE SENSITIVITY
echo ============================================================================
echo.
echo This will normalize ALL skill names to lowercase in your database.
echo.
echo WHAT THIS DOES:
echo - Converts "PostgreSQL" to "postgresql"
echo - Converts "ReactJS" to "react"  
echo - Converts "JavaScript" to "javascript"
echo - Converts ALL skills to lowercase
echo.
echo WHY: Your UI only shows one case variation, causing split counts
echo.
echo ============================================================================
echo.
echo INSTRUCTIONS:
echo 1. Open Supabase SQL Editor
echo 2. Copy and paste this SQL command:
echo.
echo UPDATE practice_questions SET skill = LOWER(skill);
echo.
echo 3. Click "Run" to execute
echo 4. Refresh your UI to see correct counts
echo.
echo ============================================================================
echo.
echo Or run the full diagnostic script: FIX_ALL_SKILLS_CASE_SENSITIVITY.sql
echo.
pause
