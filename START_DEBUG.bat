@echo off
echo ========================================
echo AI Chat Debug Startup
echo ========================================
echo.

echo Checking environment variables...
echo.

cd server

echo DEEPSEEK_API_KEY is set: 
if defined DEEPSEEK_API_KEY (
    echo YES
) else (
    echo NO - Loading from .env file
)

echo.
echo Starting server with debug logging...
echo.

npm run dev
