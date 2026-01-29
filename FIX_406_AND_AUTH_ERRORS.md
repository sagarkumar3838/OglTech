# 🔧 Fix 406 and Auth Errors

You're seeing two types of errors:

## 1. ❌ Auth Error: Invalid Refresh Token

```
AuthApiError: Invalid Refresh Token: Refresh Token Not Found
```

**What it means:** Your login session expired or is invalid.

**Quick Fix:**
1. Clear browser cache and cookies for localhost
2. Log out completely
3. Log back in

**Or in browser console:**
```javascript
// Clear Supabase session
localStorage.clear();
sessionStorage.clear();
// Then refresh page and login again
```

---

## 2. ❌ 406 Errors on user_progress

```
Failed to load resource: the server responded with a status of 406
```

**What it means:** RLS (Row Level Security) policies are blocking your queries.

**Quick Fix:** Run this SQL in Supabase:

### Option 1: Fix Just user_progress (Fast)
```sql
-- Run: fix-user-progress-406-error.sql
```

### Option 2: Fix All Tables (Recommended)
```sql
-- Run: fix-all-406-errors-complete.sql
```

---

## 🚀 STEP-BY-STEP FIX

### Step 1: Fix Database (Supabase)
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy contents of **`fix-all-406-errors-complete.sql`**
4. Paste and click "Run"
5. You should see: ✅ All 406 errors should be fixed now!

### Step 2: Fix Auth (Browser)
1. Open browser DevTools (F12)
2. Go to Console tab
3. Run:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```
4. Log in again

### Step 3: Verify
1. Refresh your app
2. Check browser console (F12)
3. No more 406 errors should appear

---

## 🔍 WHY THIS HAPPENS

### 406 Errors
- RLS policies require `auth.uid()::text = user_id`
- Your tables use TEXT for user_id (Firebase UID)
- Policies need to cast UUID to TEXT: `::text`

### Auth Errors
- Refresh tokens expire
- Browser cache issues
- Session conflicts

---

## 📋 WHAT THE SQL DOES

The fix SQL:
1. ✅ Drops old/broken RLS policies
2. ✅ Creates new policies with correct type casting
3. ✅ Enables RLS on all tables
4. ✅ Allows public read for questions, careers, media
5. ✅ Restricts user data to owner only

---

## 🧪 TEST AFTER FIX

Run this in Supabase SQL Editor:
```sql
-- Check policies
SELECT tablename, COUNT(*) as policies
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename;

-- Should show policies for all tables
```

---

## 🆘 IF STILL NOT WORKING

### Check 1: Are you logged in?
```javascript
// In browser console
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user);
// Should show your user object, not null
```

### Check 2: Is RLS enabled?
```sql
-- In Supabase SQL Editor
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'user_progress';
-- rowsecurity should be 't' (true)
```

### Check 3: Do policies exist?
```sql
SELECT * FROM pg_policies
WHERE tablename = 'user_progress';
-- Should show 4 policies
```

---

## 🎯 QUICK COMMANDS

### Clear everything and start fresh:
```javascript
// Browser console
localStorage.clear();
sessionStorage.clear();
location.href = '/login';
```

### Check current user:
```javascript
// Browser console
supabase.auth.getUser().then(({data}) => console.log(data.user));
```

### Force logout:
```javascript
// Browser console
supabase.auth.signOut().then(() => location.reload());
```

---

## ✅ SUCCESS CHECKLIST

- [ ] Ran `fix-all-406-errors-complete.sql` in Supabase
- [ ] Saw success message
- [ ] Cleared browser cache/storage
- [ ] Logged out and back in
- [ ] No more 406 errors in console
- [ ] No more auth errors
- [ ] Dashboard loads properly

---

**Files to run:**
1. `fix-all-406-errors-complete.sql` (in Supabase)
2. Clear browser storage (in DevTools)
3. Re-login

**Expected result:** All errors gone, dashboard works! 🎉
