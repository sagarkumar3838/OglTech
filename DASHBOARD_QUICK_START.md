# 🚀 Dashboard Quick Start - 3 Simple Steps

## What You Need
Just 3 SQL scripts to run in Supabase. That's it!

---

## Step 1: Fix Tables (30 seconds)

**File:** `fix-all-career-tables-for-firebase.sql`

1. Open Supabase SQL Editor
2. Copy the ENTIRE file
3. Paste and click "Run"
4. ✅ Done! Tables are now fixed for Firebase auth

---

## Step 2: Create Requirements (30 seconds)

**File:** `create-career-skill-requirements.sql`

1. Copy the ENTIRE file
2. Paste in Supabase SQL Editor
3. Click "Run"
4. ✅ Done! Career requirements are loaded

---

## Step 3: Select Your Career (1 minute)

**File:** `select-career-simple.sql`

### 3a. Get Your User ID
Run this in Supabase SQL Editor:
```sql
SELECT DISTINCT user_id FROM user_progress LIMIT 1;
```
Copy the user_id value (it's a string like `abc123def456`)

### 3b. Select Career
1. Open `select-career-simple.sql`
2. Find line: `v_user_id TEXT := 'PASTE_YOUR_USER_ID_HERE';`
3. Replace `PASTE_YOUR_USER_ID_HERE` with your actual user ID
4. Copy and paste into Supabase
5. Click "Run"
6. ✅ Done! Career selected

---

## Step 4: View Dashboard

Go to: **http://localhost:3000/dashboard**

You'll see:
- ✅ Your chosen career
- 📊 Required skills and levels
- ⏰ "Start Test" buttons (no progress yet)

Take a test, then come back to see:
- ✅ Your scores
- ⚠️ Weak areas
- 📝 Test history

---

## Can't Find Your User ID?

### Method 1: SQL Query (Easiest)
Run in Supabase:
```sql
SELECT DISTINCT user_id FROM user_progress LIMIT 1;
```

### Method 2: Browser Console
1. Go to http://localhost:3000
2. Press F12
3. Type: `localStorage.getItem('user')`
4. Look for the "id" field

### Method 3: Use Helper File
Open `get-user-id.html` in your browser

### No Results?
If queries return empty:
1. Make sure you're logged in
2. Take at least one test first
3. Then run the query again

---

## Alternative: Skip Sample Data

Don't want to mess with user IDs? Just:

1. ✅ Run Step 1 (fix tables)
2. ✅ Run Step 2 (create requirements)
3. ✅ Go to http://localhost:3000/careers
4. ✅ Click on any career card
5. ✅ Career is automatically selected!
6. ✅ Go to dashboard

---

## Troubleshooting

### "Please replace PASTE_YOUR_USER_ID_HERE"
- You forgot to replace the placeholder
- Edit the SQL file first, THEN run it

### "No Career Selected" on dashboard
- Run Step 3, OR
- Go to /careers page and click a career card

### "Career not found"
- Run Step 2 first (create-career-skill-requirements.sql)

### Tables don't exist
- Run Step 1 first (fix-all-career-tables-for-firebase.sql)

---

## Files You Need

| Order | File | Required? | Time |
|-------|------|-----------|------|
| 1 | `fix-all-career-tables-for-firebase.sql` | ✅ Yes | 30s |
| 2 | `create-career-skill-requirements.sql` | ✅ Yes | 30s |
| 3 | `select-career-simple.sql` | Optional | 1min |

**Total time: 2 minutes**

---

## What Happens Next

### After Setup:
1. Dashboard shows your career requirements
2. Click "Start Test" on any skill
3. Take the test
4. Dashboard automatically updates with:
   - ✅ Your score
   - ✅ Pass/Fail status
   - ✅ Progress percentage
   - ⚠️ Weak areas (if you fail)
   - 📝 Test history

### Everything is Real Data:
- No dummy information
- No fake progress
- Only shows what you actually did
- Updates automatically as you test

---

## Success Checklist

- [ ] Ran `fix-all-career-tables-for-firebase.sql`
- [ ] Ran `create-career-skill-requirements.sql`
- [ ] Selected a career (via SQL or UI)
- [ ] Dashboard shows career requirements
- [ ] Ready to take tests!

---

## 🎉 You're Done!

Your dashboard is now set up and ready to track your real progress toward your chosen career!

**Next:** Take some tests and watch your dashboard come alive with real data! 🚀
