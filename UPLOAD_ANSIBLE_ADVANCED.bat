@echo off
echo ========================================
echo Upload Ansible Advanced Questions
echo ========================================
echo.
echo This will:
echo 1. Check for existing Ansible Advanced questions
echo 2. Delete existing questions (if any)
echo 3. Upload 364 new questions from CSV
echo.
echo Press Ctrl+C to cancel, or
pause

echo.
echo Running upload script...
npx tsx scripts/upload-ansible-advanced.ts

echo.
echo ========================================
echo Done!
echo ========================================
echo.
echo To verify, run this SQL in Supabase:
echo   SELECT COUNT(*) FROM practice_questions 
echo   WHERE skill = 'Ansible' AND level = 'Advanced';
echo.
pause
