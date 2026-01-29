@echo off
echo ============================================
echo Killing Process on Port 5001
echo ============================================
echo.

echo Finding process on port 5001...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5001') do (
    echo Found PID: %%a
    echo Killing process...
    taskkill /F /PID %%a
)

echo.
echo Done! Port 5001 should now be free.
echo.
pause
