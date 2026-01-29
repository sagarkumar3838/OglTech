@echo off
echo ========================================
echo Upload ALL Questions - All Skills & Levels
echo ========================================
echo.
echo This will upload questions for:
echo   - HTML (BASIC, MEDIUM, ADVANCED)
echo   - CSS (BASIC, MEDIUM, ADVANCED)
echo   - JavaScript (BASIC, MEDIUM, ADVANCED)
echo   - jQuery (BASIC, MEDIUM, ADVANCED)
echo   - OGL (BASIC, MEDIUM, ADVANCED)
echo.
echo Expected: ~750 questions total
echo.
echo Press Ctrl+C to cancel...
timeout /t 5
echo.

echo ========================================
echo Uploading HTML Questions...
echo ========================================
call npx tsx scripts/upload-all-levels.ts HTML
echo.

echo ========================================
echo Uploading CSS Questions...
echo ========================================
call npx tsx scripts/upload-all-levels.ts CSS
echo.

echo ========================================
echo Uploading JavaScript Questions...
echo ========================================
call npx tsx scripts/upload-all-levels.ts JavaScript
echo.

echo ========================================
echo Uploading jQuery Questions...
echo ========================================
call npx tsx scripts/upload-all-levels.ts jQuery
echo.

echo ========================================
echo Uploading OGL Questions...
echo ========================================
call npx tsx scripts/upload-all-levels.ts OGL
echo.

echo ========================================
echo ALL UPLOADS COMPLETE!
echo ========================================
echo.
echo Check Supabase dashboard to verify all questions were uploaded.
echo.
pause
