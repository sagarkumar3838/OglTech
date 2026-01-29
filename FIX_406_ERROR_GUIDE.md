# Fix 406 Error - Complete Guide

## What's Causing the 406 Error?

The **406 (Not Acceptable)** error from Supabase happens when:

1. **Tables don't exist** - The `media` or `user_progress` tables haven't been created
2. **RLS policies are missing/incorrect** - Row Level Security is blocking access
3. **Missing permissions** - The anon/authenticated roles don't have proper grants

## Your Specific Errors:

```
❌ /rest/v1/media?select=*&usage_type=eq.hero&is_active=eq.true
❌ /rest/v1/user_progress?select=*&user_id=eq.3912d92f-bc36-4f9f-afd5-730a16c4d38d
```

## Quick Fix (3 Steps):

### Step 1: Diagnose the Issue

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Run the diagnostic script: `diagnose-406-error.sql`

This will tell you:
- ✅ Do the tables exist?
- ✅ Is RLS enabled?
- ✅ Are policies configured?

### Step 2: Apply the Complete Fix

1. In the same **SQL Editor**
2. Run the complete fix: `fix-406-complete.sql`

This will:
- ✅ Create `media` and `user_progress` tables (if missing)
- ✅ Enable RLS on both tables
- ✅ Create proper policies for public/authenticated access
- ✅ Add indexes for performance
- ✅ Grant necessary permissions

### Step 3: Verify the Fix

1. Refresh your application
2. Check the browser console - the 406 errors should be gone
3. If you still see errors, check the console for more details

## Understanding the Fix:

### Media Table Policies:
```sql
-- Anyone (even not logged in) can read active media
"media_public_read" - SELECT for public users

-- Authenticated users can manage media
"media_admin_all" - ALL operations for authenticated users
```

### User Progress Table Policies:
```sql
-- Users can only see their own progress
"user_progress_own_read" - SELECT where user_id = auth.uid()

-- Users can create/update their own progress
"user_progress_own_write" - INSERT where user_id = auth.uid()
"user_progress_own_update" - UPDATE where user_id = auth.uid()
```

## Common Issues:

### Issue 1: "Table doesn't exist"
**Solution:** Run `fix-406-complete.sql` - it creates the tables

### Issue 2: "RLS policy violation"
**Solution:** The fix creates proper policies for public and authenticated access

### Issue 3: "Still getting 406 after fix"
**Possible causes:**
- Browser cache - Hard refresh (Ctrl+Shift+R)
- Old session - Log out and log back in
- Wrong Supabase URL/Key - Check `client/.env`

## Testing After Fix:

Open browser console and check:
```javascript
// Should work now
fetch('https://ksjgsgebjnpwyycnptom.supabase.co/rest/v1/media?select=*', {
  headers: {
    'apikey': 'YOUR_ANON_KEY',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  }
})
```

## Need More Help?

If you still see 406 errors after running the fix:

1. Check the browser Network tab for the exact error response
2. Run `diagnose-406-error.sql` again to verify setup
3. Check Supabase logs in Dashboard > Logs > API Logs
