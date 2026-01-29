# Fix 406 Error - User Profile Loading Issue

## Problem
```
Failed to load resource: the server responded with a status of 406 ()
Error fetching user profile: Object
```

## Root Causes

### 1. Missing Accept Headers
The Supabase client wasn't sending proper `Accept` headers, causing the API to return 406 (Not Acceptable).

### 2. RLS Policy Issues
Row Level Security policies might be too restrictive or misconfigured.

### 3. Single vs MaybeSingle
Using `.single()` throws an error if no rows are found, while `.maybeSingle()` returns null gracefully.

## Solutions Applied

### ✅ 1. Updated Supabase Client Configuration
**File**: `client/src/config/supabase.ts`

Added proper headers:
```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Prefer': 'return=representation'
    }
  }
});
```

### ✅ 2. Updated User Profile Service
**File**: `client/src/services/userProfileService.ts`

Changed from `.single()` to `.maybeSingle()`:
```typescript
async getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle(); // ← Changed from .single()

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception fetching user profile:', err);
    return null;
  }
}
```

### ✅ 3. Added Logo and Home Button to AdminLayout
**File**: `client/src/components/AdminLayout.tsx`

Added header with logo and home button:
```tsx
{/* Logo and Home Button Row */}
<div className="flex items-center justify-between py-3 border-b border-gray-100">
  <div className="flex items-center space-x-2">
    <BarChart className="w-8 h-8 text-blue-600" />
    <span className="text-2xl font-bold text-blue-600">OGL SkillEval</span>
  </div>
  <Link to="/" className="flex items-center gap-2 px-4 py-2 ...">
    <Home className="w-4 h-4" />
    Home
  </Link>
</div>
```

### ✅ 4. Fixed RLS Policies (Optional)
**File**: `fix-user-profiles-rls.sql`

Run this SQL in Supabase SQL Editor if the error persists:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT TO authenticated
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own profile"
ON user_profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE TO authenticated
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Public can view profiles"
ON user_profiles FOR SELECT TO authenticated
USING (true);
```

## Testing

1. **Clear browser cache and reload**
   - Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

2. **Check browser console**
   - Open DevTools (F12)
   - Look for any remaining 406 errors
   - Should see successful API calls now

3. **Test user profile loading**
   - Navigate to `/dashboard`
   - Profile should load without errors
   - Logo and Home button should be visible

## Expected Results

### Before Fix
```
❌ 406 Error
❌ "Error fetching user profile"
❌ Profile doesn't load
❌ No logo/home button in navigation
```

### After Fix
```
✅ No 406 errors
✅ Profile loads successfully
✅ Logo visible: "📊 OGL SkillEval"
✅ Home button works
✅ Clean console (no errors)
```

## Visual Changes

### Navigation Bar (AdminLayout)
```
┌─────────────────────────────────────────────────────────┐
│  📊 OGL SkillEval                        [🏠 Home]      │
├─────────────────────────────────────────────────────────┤
│  [Dashboard] [Careers] [Practice] [Learning Path] ...   │
└─────────────────────────────────────────────────────────┘
```

## Troubleshooting

### Still getting 406 errors?

1. **Check Supabase URL and Keys**
   ```bash
   # In .env file
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **Run RLS Fix SQL**
   - Go to Supabase Dashboard → SQL Editor
   - Run `fix-user-profiles-rls.sql`

3. **Check user_profiles table exists**
   ```sql
   SELECT * FROM user_profiles LIMIT 1;
   ```

4. **Verify user authentication**
   - Make sure user is logged in
   - Check `auth.users` table has the user

5. **Restart dev server**
   ```bash
   npm run dev
   ```

## Files Modified

- ✅ `client/src/config/supabase.ts` - Added headers
- ✅ `client/src/services/userProfileService.ts` - Changed to maybeSingle()
- ✅ `client/src/components/AdminLayout.tsx` - Added logo and home button
- ✅ `fix-user-profiles-rls.sql` - RLS policy fixes

## Next Steps

1. Test the dashboard at `http://localhost:3001/dashboard`
2. Verify no console errors
3. Check that profile loads correctly
4. Test navigation with the new Home button
5. If issues persist, run the RLS fix SQL script
