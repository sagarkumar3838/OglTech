# Complete Fix Guide - All Errors

## Issues Found

1. ✅ **user_id=undefined** - Fixed by changing `user.uid` to `user.id`
2. ⚠️ **406 Error** - RLS policy issue with user_progress table
3. ⚠️ **AI Generation Error** - Wrong method name in hybridQuestionService
4. ⚠️ **OGLProgress import error** - Build cache issue

## Fixes Applied

### 1. Fixed user.uid → user.id (COMPLETED)
Changed in these files:
- ✅ client/src/pages/CareerDetail.tsx
- ✅ client/src/pages/OGLProgress.tsx
- ✅ client/src/pages/Analytics.tsx (3 places)
- ✅ client/src/pages/AIAssistant.tsx

### 2. Fixed AI Generation Method (COMPLETED)
- ✅ server/src/services/hybridQuestionService.ts
  - Changed: `this.aiManager.generateCompletion()` → `this.aiManager.generateQuestions()`

### 3. Fix RLS Policies (ACTION REQUIRED)

Run this SQL in your Supabase SQL Editor:

```sql
-- Enable RLS on user_progress table
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON user_progress;

-- Create new policies for authenticated users
CREATE POLICY "Users can view their own progress"
ON user_progress FOR SELECT TO authenticated
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own progress"
ON user_progress FOR INSERT TO authenticated
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own progress"
ON user_progress FOR UPDATE TO authenticated
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- Add missing column
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS overall_completion INTEGER DEFAULT 0;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON user_progress TO authenticated;
```

### 4. Clear Build Cache (ACTION REQUIRED)

```bash
# Stop the dev server (Ctrl+C)

# Clear client build cache
cd client
rmdir /s /q node_modules\.vite
rmdir /s /q dist

# Restart dev server
npm run dev
```

## Step-by-Step Instructions

### Step 1: Run SQL Fixes
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the SQL from `fix-user-progress-rls.sql`
4. Click "Run"
5. Copy and paste the SQL from `add-overall-completion-column.sql`
6. Click "Run"

### Step 2: Restart Backend Server
```bash
# In the server directory
cd server
npm run dev
```

### Step 3: Clear Frontend Cache and Restart
```bash
# In the client directory
cd client

# Clear cache
rmdir /s /q node_modules\.vite
rmdir /s /q dist

# Restart
npm run dev
```

### Step 4: Clear Browser Data
1. Open DevTools (F12)
2. Go to Application tab
3. Clear Storage → Clear site data
4. Refresh page (Ctrl+Shift+R)

### Step 5: Test
1. Log out and log back in
2. Navigate to a career page
3. Click "AI Generated" or "From Database"
4. Check console - should see no errors

## Expected Results

✅ No more `user_id=eq.undefined` errors
✅ No more 406 errors from Supabase
✅ AI generation works (or falls back to database gracefully)
✅ User progress loads correctly
✅ OGLProgress page works

## Troubleshooting

### Still seeing 406 errors?
- Make sure you ran the RLS SQL scripts
- Check that you're logged in with a valid Supabase user
- Verify the user_id in the URL matches your auth.uid()

### Still seeing "OGLProgress is not defined"?
- Clear browser cache completely
- Delete node_modules\.vite folder
- Restart dev server

### AI generation still failing?
- Check if backend server is running on port 5001
- Verify you have at least one AI API key configured in server/.env
- Check server console for detailed error messages

## Files Created
- fix-user-progress-rls.sql
- add-overall-completion-column.sql
- FIX_ALL_ERRORS_NOW.md (this file)
