@echo off
echo ============================================
echo Starting Backend Server
echo ============================================
echo.

cd server

echo Checking if dependencies are installed...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting server in development mode...
echo Server will run on http://localhost:5001
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev
