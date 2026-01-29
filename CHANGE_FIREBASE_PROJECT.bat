@echo off
echo ========================================
echo 🔄 CHANGE FIREBASE PROJECT
echo ========================================
echo.
echo Current Project: mentorai1998
echo.
echo ========================================
echo STEP 1: CREATE NEW FIREBASE PROJECT
echo ========================================
echo.
echo 1. Go to: https://console.firebase.google.com/
echo 2. Click "Add Project"
echo 3. Enter project name (e.g., skilleval-app)
echo 4. Disable Google Analytics (optional)
echo 5. Click "Create Project"
echo 6. Copy your Project ID
echo.
pause
echo.
echo ========================================
echo STEP 2: SWITCH TO NEW PROJECT
echo ========================================
echo.
echo Running: firebase use --add
echo.
firebase use --add
echo.
echo ========================================
echo STEP 3: ENABLE AUTHENTICATION
echo ========================================
echo.
echo 1. Go to Firebase Console
echo 2. Authentication -^> Get Started
echo 3. Enable "Email/Password"
echo 4. Save
echo.
pause
echo.
echo ========================================
echo STEP 4: GET FIREBASE CONFIG
echo ========================================
echo.
echo 1. Firebase Console -^> Project Settings
echo 2. Scroll to "Your apps"
echo 3. Click Web app (^</^> icon)
echo 4. Register app: "SkillEval Client"
echo 5. Copy the config values
echo.
echo Update client/.env with:
echo   VITE_FIREBASE_API_KEY=...
echo   VITE_FIREBASE_AUTH_DOMAIN=...
echo   VITE_FIREBASE_PROJECT_ID=...
echo   VITE_FIREBASE_STORAGE_BUCKET=...
echo   VITE_FIREBASE_MESSAGING_SENDER_ID=...
echo   VITE_FIREBASE_APP_ID=...
echo.
pause
echo.
echo ========================================
echo STEP 5: BUILD AND DEPLOY
echo ========================================
echo.
echo Building client...
cd client
call npm run build
echo.
echo Deploying to Firebase...
call firebase deploy --only hosting
echo.
echo ========================================
echo ✅ PROJECT CHANGED!
echo ========================================
echo.
echo Check your new URL:
firebase hosting:sites:list
echo.
echo ========================================
echo STEP 6: UPDATE SUPABASE
echo ========================================
echo.
echo 1. Go to Supabase Dashboard
echo 2. Settings -^> API
echo 3. Update Site URL with your new Firebase URL
echo 4. Update Redirect URLs
echo.
echo ========================================
echo DONE!
echo ========================================
echo.
echo Your app is now on the new Firebase project!
echo.
pause
