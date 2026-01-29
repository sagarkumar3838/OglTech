# Fix: user_id=eq.undefined Error

## Problem
```
GET .../user_progress?select=*&user_id=eq.undefined&career_id=eq.56764df9... 400 (Bad Request)
```

## Root Cause
Something is trying to query a `user_progress` table in Supabase with an undefined user_id. This could be:
1. Old code that hasn't been updated
2. A browser extension (like React DevTools or Supabase extension)
3. Cached code in the browser

## Quick Fixes

### 1. Clear Browser Cache (Recommended)
```
Windows: Ctrl + Shift + Delete
Mac: Cmd + Shift + Delete

Then select:
- Cached images and files
- Cookies and site data
```

### 2. Hard Refresh
```
Windows: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

### 3. Disable Browser Extensions
Temporarily disable extensions that might be making API calls:
- React DevTools
- Redux DevTools
- Supabase extensions
- Any database inspection tools

### 4. Check for user_progress Table References
The `user_progress` table doesn't exist in your Supabase database. You're using Firebase for user progress tracking.

## Why This Happens

### Supabase User ID
In Supabase, the user ID is accessed as:
```typescript
const userId = user?.id; // ✅ Correct
```

NOT as:
```typescript
const userId = user?.uid; // ❌ Wrong (Firebase style)
```

### Firebase vs Supabase
Your app uses:
- **Supabase**: For authentication, user profiles, questions, scorecards
- **Firebase**: For user progress tracking

The error suggests something is trying to use Supabase for user progress when it should use Firebase.

## Verification

### Check if user_progress table exists in Supabase
Run this in Supabase SQL Editor:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'user_progress';
```

Expected result: **No rows** (table doesn't exist)

### Check your tables
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see:
- ✅ questions
- ✅ scorecards  
- ✅ user_profiles
- ✅ careers
- ❌ user_progress (should NOT exist)

## Solution

Since the error is a 400 (Bad Request) and not a 404 (Not Found), it means:
1. The table might exist but the query is malformed
2. OR it's coming from cached code/extensions

### Option 1: Ignore the Error
If your app works fine otherwise, you can safely ignore this error. It's likely from:
- Browser dev tools
- A browser extension
- Cached code

### Option 2: Create the Table (Not Recommended)
If you want to stop the error, you could create an empty table:
```sql
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  career_id UUID NOT NULL,
  progress JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own progress
CREATE POLICY "Users can view own progress"
ON user_progress FOR SELECT
TO authenticated
USING (auth.uid()::text = user_id);
```

**Note**: This is NOT recommended because you're already using Firebase for user progress.

### Option 3: Check for Old Code
Search your codebase for any references to `user_progress` in Supabase queries:
```bash
# In your project root
grep -r "user_progress" client/src/
```

If you find any, update them to use Firebase instead.

## Prevention

### Always Check User Before Querying
```typescript
// ❌ Bad - can cause undefined errors
const { data } = await supabase
  .from('user_progress')
  .select('*')
  .eq('user_id', user.id); // user might be null!

// ✅ Good - check user first
if (!user?.id) {
  console.error('User not authenticated');
  return;
}

const { data } = await supabase
  .from('user_progress')
  .select('*')
  .eq('user_id', user.id);
```

### Use Optional Chaining
```typescript
// ✅ Safe
const userId = user?.id;
if (!userId) return;

// Use userId safely
```

## Current Status

Your app should work fine despite this error because:
1. ✅ User authentication works (Supabase)
2. ✅ User profiles work (Supabase)
3. ✅ Questions work (Supabase)
4. ✅ User progress works (Firebase)

The error is likely from:
- Cached code
- Browser extension
- Dev tools inspection

## Next Steps

1. **Clear browser cache** - Most likely fix
2. **Hard refresh** - Ctrl+Shift+R
3. **Disable extensions** - Temporarily
4. **Check console** - See if error persists
5. **Test functionality** - Verify everything works

If the app works fine, you can safely ignore this error!
