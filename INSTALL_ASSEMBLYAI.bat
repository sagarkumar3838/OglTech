@echo off
echo ========================================
echo Installing AssemblyAI Dependencies
echo ========================================
echo.

cd functions
echo Installing backend dependencies...
call npm install
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Get your API key from: https://www.assemblyai.com/dashboard/signup
echo 2. Add to .env file: ASSEMBLYAI_API_KEY=your_key_here
echo 3. Add to functions/.env file: ASSEMBLYAI_API_KEY=your_key_here
echo 4. Deploy: firebase deploy --only functions
echo.
echo See ASSEMBLYAI_QUICK_START.md for details
echo.
pause
