@echo off
echo ============================================
echo SWITCH FIREBASE ACCOUNT
echo ============================================
echo.
echo This will help you switch to a different Gmail account
echo and create a new Firebase project.
echo.
echo Step 1: Logout from current account
echo ----------------------------------------
call firebase logout
echo.
echo Step 2: Login with new Gmail account
echo ----------------------------------------
echo A browser window will open.
echo Sign in with your NEW Gmail account.
echo.
pause
call firebase login
echo.
echo Step 3: Create new Firebase project
echo ----------------------------------------
echo.
echo Opening Firebase Console...
start https://console.firebase.google.com/
echo.
echo Please:
echo 1. Click "Add Project"
echo 2. Enter project name (e.g., skilleval)
echo 3. Create the project
echo 4. Copy the Project ID
echo.
pause
echo.
set /p project_id="Enter your new Firebase Project ID: "
echo.
echo Step 4: Updating configuration
echo ----------------------------------------
echo.
echo Updating .firebaserc...
(
echo {
echo   "projects": {
echo     "default": "%project_id%"
echo   }
echo }
) > .firebaserc
echo.
echo ✅ Configuration updated!
echo.
echo Step 5: Initialize Firebase services
echo ----------------------------------------
echo.
echo Do you want to initialize Firebase services now? (Y/N)
set /p init_choice=
if /i "%init_choice%"=="Y" (
    call firebase init
)
echo.
echo ============================================
echo ✅ ACCOUNT SWITCH COMPLETE!
echo ============================================
echo.
echo Your new project: %project_id%
echo.
echo Your new URLs will be:
echo Frontend: https://%project_id%.web.app
echo Backend: https://us-central1-%project_id%.cloudfunctions.net/api
echo.
echo Next steps:
echo 1. Update client/.env with new Firebase config
echo 2. Run: DEPLOY_FULLSTACK_FIREBASE.bat
echo.
pause
