@echo off
echo ========================================
echo Fix Database Level Names
echo ========================================
echo.
echo You have 2 options:
echo.
echo 1. Update old "easy" to "Basic" (keeps old data)
echo 2. Delete ALL and re-upload fresh (recommended)
echo.
echo ========================================
echo.
choice /C 12 /M "Choose option (1 or 2)"

if errorlevel 2 goto delete_all
if errorlevel 1 goto update_old

:update_old
echo.
echo ========================================
echo Option 1: Update Old Data
echo ========================================
echo.
echo Run this SQL in Supabase SQL Editor:
echo.
echo UPDATE practice_questions SET level = 'Basic' WHERE level = 'easy';
echo UPDATE practice_questions SET level = 'Intermediate' WHERE level = 'medium';
echo UPDATE practice_questions SET level = 'Advanced' WHERE level = 'hard';
echo.
echo Then press any key to upload new questions...
pause
goto upload

:delete_all
echo.
echo ========================================
echo Option 2: Delete All and Start Fresh
echo ========================================
echo.
echo Run this SQL in Supabase SQL Editor:
echo.
echo DELETE FROM practice_questions;
echo.
echo Then press any key to upload all 9,464 questions...
pause
goto upload

:upload
echo.
echo ========================================
echo Starting Upload...
echo ========================================
echo.
npx tsx scripts/upload-valid-questions-only.ts
echo.
echo ========================================
echo Done!
echo ========================================
echo.
echo Verify in Supabase:
echo SELECT level, COUNT(*) FROM practice_questions GROUP BY level;
echo.
pause
