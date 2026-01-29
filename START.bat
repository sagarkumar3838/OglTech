@echo off
echo ========================================
echo Starting Skill Evaluation Platform
echo ========================================
echo.

echo [1/3] Starting Backend Server...
start "Backend Server" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend Client...
start "Frontend Client" cmd /k "cd client && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo ✅ Application Started!
echo ========================================
echo.
echo Backend:  http://localhost:5001
echo Frontend: http://localhost:5173
echo.
echo Press any key to open browser...
pause >nul

start http://localhost:5173

echo.
echo To stop the servers, close the terminal windows.
echo.
