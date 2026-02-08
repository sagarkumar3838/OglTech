@echo off
echo ========================================
echo Testing AssemblyAI Locally
echo ========================================
echo.

echo Starting backend server...
echo.

start "Backend Server" cmd /k "cd functions && npm run serve"

timeout /t 5 /nobreak >nul

echo.
echo Backend server started!
echo.
echo Now start your frontend:
echo   cd client
echo   npm run dev
echo.
echo Then test:
echo 1. Go to http://localhost:5173
echo 2. Navigate to evaluation page
echo 3. Click microphone button
echo 4. Speak your answer
echo 5. Check if text appears
echo.
echo Backend logs will show in the other window
echo.
pause
