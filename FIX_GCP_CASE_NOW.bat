@echo off
echo ========================================
echo   Fix GCP Case Sensitivity Issue
echo ========================================
echo.
echo Problem: Database has "GCP" but frontend expects "gcp"
echo Solution: Update all GCP questions to lowercase
echo.
echo Please run this SQL in Supabase SQL Editor:
echo.
echo fix-gcp-case-sensitivity.sql
echo.
echo Or copy this command:
echo.
echo UPDATE practice_questions SET skill = 'gcp' WHERE skill = 'GCP';
echo.
pause
