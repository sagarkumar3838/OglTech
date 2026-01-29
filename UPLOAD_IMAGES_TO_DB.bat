@echo off
echo ========================================
echo   Upload Local Images to Database
echo ========================================
echo.
echo This will add images from client/dist/assets/images
echo to your Supabase database.
echo.
echo Make sure you have:
echo 1. Run create-media-table.sql in Supabase
echo 2. Set up your .env file with Supabase credentials
echo.
pause

echo.
echo Installing dependencies...
call npm install

echo.
echo Running upload script...
call npx ts-node scripts/upload-local-images.ts

echo.
echo ========================================
echo   Upload Complete!
echo ========================================
pause
