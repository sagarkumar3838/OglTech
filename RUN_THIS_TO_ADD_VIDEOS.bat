@echo off
echo ============================================
echo ADD VIDEO LINKS TO QUESTIONS
echo ============================================
echo.
echo This will:
echo 1. Add 6 new columns to questions table (mdn_link, youtube links)
echo 2. Copy video/documentation links from practice_questions
echo 3. Show you how many questions now have videos
echo.
echo COPY THIS SQL AND RUN IN SUPABASE:
echo ============================================
type ADD_VIDEO_COLUMNS_AND_COPY.sql
echo.
echo ============================================
pause
