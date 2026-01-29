# Verify 406 Error Fix

## Good News! 
The RLS policies already exist, which means your database is properly configured. The 406 error should now be fixed by the code changes we made.

## What We Fixed

### ✅ Code Changes (Already Applied)
1. **Supabase Client** - Added proper headers
2. **User Profile Service** - Changed to `.maybeSingle()` for better error handling
3. **AdminLayout** - Added logo and home button

### ✅ Database (Already Configured)
The error message shows policies already exist, which is good! No database changes needed.

## How to Verify the Fix

### Step 1: Clear Browser Cache
```
Windows: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

### Step 2: Restart Dev Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 3: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Navigate to `http://localhost:3001/dashboard`
4. Look for:
   - ✅ No 406 errors
   - ✅ Successful API calls
   - ✅ Profile loads correctly

### Step 4: Visual Check
You should see:
- ✅ "📊 OGL SkillEval" logo at the top
- ✅ "🏠 Home" button in the top right
- ✅ Your profile information loads
- ✅ Navigation works smoothly

## If You Still See 406 Errors

### Option 1: Check Existing Policies (Recommended)
Run this in Supabase SQL Editor:
```sql
-- See what policies exist
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'user_profiles';
```

### Option 2: Verify Table Access
```sql
-- Test if you can query the table
SELECT COUNT(*) FROM user_profiles;
```

### Option 3: Check Your User ID
```sql
-- Get your user ID from auth
SELECT id, email FROM auth.users LIMIT 5;
```

## Expected Console Output

### Before Fix ❌
```
Failed to load resource: 406
Error fetching user profile: Object
```

### After Fix ✅
```
(No errors)
Profile loaded successfully
```

## Troubleshooting

### Still getting 406?

1. **Check environment variables**
   ```bash
   # In client/.env
   VITE_SUPABASE_URL=https://ksjgsgebjnpwyycnptom.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   ```

2. **Verify you're logged in**
   - Check if user session exists
   - Try logging out and back in

3. **Check network tab**
   - Open DevTools → Network
   - Look at the failed request
   - Check request headers
   - Check response body

4. **Clear all browser data**
   - Settings → Privacy → Clear browsing data
   - Select "Cached images and files"
   - Select "Cookies and site data"

## Quick Test Script

Run this in Supabase SQL Editor to verify everything:
```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'user_profiles';

-- Check policies exist
SELECT COUNT(*) as policy_count 
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- Test query
SELECT COUNT(*) as profile_count 
FROM user_profiles;
```

Expected results:
- `rowsecurity`: true
- `policy_count`: 3-4 policies
- `profile_count`: Number of profiles in your database

## Success Indicators

✅ No 406 errors in console
✅ Logo visible: "OGL SkillEval"
✅ Home button works
✅ Profile loads with user data
✅ Navigation is smooth
✅ No TypeScript errors

## Files to Check

If issues persist, verify these files have the changes:

1. `client/src/config/supabase.ts`
   - Should have `headers` in the config

2. `client/src/services/userProfileService.ts`
   - Should use `.maybeSingle()` not `.single()`

3. `client/src/components/AdminLayout.tsx`
   - Should have logo and home button

## Need More Help?

Run the check script:
```bash
# In Supabase SQL Editor
-- Run: check-user-profiles-policies.sql
```

This will show you the current state of your database without making any changes.
