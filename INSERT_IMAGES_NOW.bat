@echo off
echo ========================================
echo  INSERT ALL IMAGES TO DATABASE
echo ========================================
echo.
echo This will insert all your images into the Supabase media table.
echo.
echo STEPS:
echo 1. Open Supabase Dashboard (https://supabase.com/dashboard)
echo 2. Go to SQL Editor
echo 3. Copy the contents of: insert-all-images-to-database.sql
echo 4. Paste and run it in the SQL Editor
echo.
echo Your images are located in: client\dist\assets\images\
echo.
dir /b client\dist\assets\images\*.jpg client\dist\assets\images\*.png 2>nul
echo.
echo After running the SQL, your images will be visible in the app!
echo.
pause
