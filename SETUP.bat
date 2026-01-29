@echo off
echo ========================================
echo Setup Skill Evaluation Platform
echo ========================================
echo.

echo [1/4] Installing root dependencies...
call npm install
echo.

echo [2/4] Installing server dependencies...
cd server
call npm install
cd ..
echo.

echo [3/4] Installing client dependencies...
cd client
call npm install
cd ..
echo.

echo [4/4] Seeding careers to Supabase...
echo Please run this SQL in Supabase Dashboard:
echo https://supabase.com/dashboard
echo.
type seed-careers.sql
echo.

echo ========================================
echo ✅ Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Go to Supabase Dashboard SQL Editor
echo 2. Copy and run the SQL above
echo 3. Run START.bat to launch the app
echo.
pause
