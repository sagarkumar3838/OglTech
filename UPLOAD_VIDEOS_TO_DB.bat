@echo off
echo ========================================
echo   Upload Local Videos to Database
echo ========================================
echo.
echo This will add videos from client/dist/assets/images
echo to your Supabase database.
echo.
echo Make sure you have:
echo 1. Run create-videos-table.sql in Supabase
echo 2. Set up your .env file with Supabase credentials
echo.
pause

echo.
echo Installing dependencies...
call npm install

echo.
echo Running upload script...
call npx ts-node scripts/upload-local-videos.ts

echo.
echo ========================================
echo   Upload Complete!
echo ========================================
pause
