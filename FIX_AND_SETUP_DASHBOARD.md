# 🔧 Fix and Setup Dashboard - Complete Guide

## Issue
The career progression tables were created with UUID type for user_id, but your system uses Firebase authentication which uses TEXT (string) user IDs.

## Solution
Run these SQL scripts in order to fix the tables and set up sample data.

---

## Step 1: Fix All Tables (REQUIRED)

### Run this first:
**File:** `fix-all-career-tables-for-firebase.sql`

**What it does:**
- Drops and recreates all career progression tables
- Changes user_id from UUID to TEXT
- Sets up proper RLS policies for Firebase auth
- Fixes: user_career_selections, user_test_results, user_skill_progress, career_recommendations

**How to run:**
1. Open Supabase SQL Editor
2. Copy entire contents of `fix-all-career-tables-for-firebase.sql`
3. Paste and click "Run"
4. You should see: "All career progression tables fixed for Firebase auth (TEXT user_id)"

---

## Step 2: Create Career Requirements (REQUIRED)

### Run this second:
**File:** `create-career-skill-requirements.sql`

**What it does:**
- Creates career_skill_requirements table
- Seeds requirements for all 8 OGL careers
- Defines what skills and levels are needed for each career

**How to run:**
1. In Supabase SQL Editor
2. Copy entire contents of `create-career-skill-requirements.sql`
3. Paste and click "Run"
4. You should see: "Career skill requirements table created and seeded successfully!"

---

## Step 3: Get Your User ID

### Method 1: Use the Helper Tool (Easiest)
1. Open `get-user-id.html` in your browser
2. Click "Get My User ID"
3. Copy the ID shown

### Method 2: Browser Console
1. Go to http://localhost:3000
2. Press F12 to open console
3. Type: `localStorage.getItem('user')`
4. Look for the "id" field and copy it

### Method 3: From Supabase
```sql
SELECT DISTINCT user_id FROM user_progress LIMIT 1;
```

**Your user ID will look something like:**
- `abc123def456ghi789` (Firebase UID - a string)
- NOT like: `550e8400-e29b-41d4-a716-446655440000` (UUID)

---

## Step 4: Add Sample Data (OPTIONAL - For Demo)

### Run this third (optional):
**File:** `seed-sample-dashboard-data.sql`

**Before running:**
1. Open the file in a text editor
2. Find: `v_user_id TEXT := 'YOUR_USER_ID';`
3. Replace `YOUR_USER_ID` with your actual user ID from Step 3
4. Keep the quotes! Example: `v_user_id TEXT := 'abc123def456ghi789';`

**How to run:**
1. In Supabase SQL Editor
2. Copy the MODIFIED contents
3. Paste and click "Run"
4. You should see success messages with your user ID

**What sample data creates:**
- Career selection: OGL Content Developer
- 3 skills with progress (HTML, CSS, JavaScript)
- 7 test attempts (5 passed, 2 failed)
- 1 weak area (CSS Intermediate - failed twice)

---

## Step 5: View Dashboard

### Go to:
http://localhost:3000/dashboard

### What you'll see:

**With Sample Data:**
```
✅ OGL Content Developer
📊 Complete 3 more skills to qualify (40% - 2/5 Skills)

Skills Progress:
✅ HTML - Basic: 85%, Intermediate: 75% (passed on 2nd try)
⚠️ CSS - Basic: 80%, Intermediate: 65% (failed twice - WEAK AREA)
✅ JavaScript - Basic: 90%
⏰ jQuery - Not started
⏰ OGL Knowledge - Not started

⚠️ Areas Needing Improvement:
CSS - Intermediate (Best: 65%, 2 attempts)

📝 Recent Test History:
✅ JavaScript - Basic: 90%
❌ CSS - Intermediate: 65%
❌ CSS - Intermediate: 60%
...
```

**Without Sample Data:**
- Shows career requirements
- No progress yet
- Click "Start Test" to begin

---

## Troubleshooting

### Error: "column user_id is of type uuid but expression is of type text"
**Solution:** You didn't run Step 1 (`fix-all-career-tables-for-firebase.sql`)
- Run Step 1 first to fix the table types

### Error: "Career not found"
**Solution:** You didn't run Step 2 (`create-career-skill-requirements.sql`)
- Run Step 2 to create the career requirements

### Error: "Please replace YOUR_USER_ID"
**Solution:** You forgot to replace the placeholder
- Open the SQL file
- Replace `'YOUR_USER_ID'` with your actual user ID
- Keep the quotes!

### Dashboard shows "No Career Selected"
**Solution:** Either:
- Run the sample data script (Step 4), OR
- Click "Choose Career Path" and select a career manually

### Can't find my user ID
**Solution:**
- Open `get-user-id.html` in browser
- Or check browser console: `localStorage.getItem('user')`
- Make sure you're logged in first!

---

## Quick Reference

### Files to Run (in order):
1. ✅ `fix-all-career-tables-for-firebase.sql` (REQUIRED)
2. ✅ `create-career-skill-requirements.sql` (REQUIRED)
3. ✅ `seed-sample-dashboard-data.sql` (OPTIONAL - after editing)

### Helper Files:
- `get-user-id.html` - Find your user ID
- `FIX_AND_SETUP_DASHBOARD.md` - This guide
- `START_HERE_DASHBOARD_SETUP.md` - Detailed setup guide

---

## Success Checklist

- [ ] Ran `fix-all-career-tables-for-firebase.sql`
- [ ] Verified tables recreated (check Table Editor)
- [ ] Ran `create-career-skill-requirements.sql`
- [ ] Got my user ID (using helper tool or console)
- [ ] (Optional) Edited and ran `seed-sample-dashboard-data.sql`
- [ ] Dashboard shows career and requirements
- [ ] (Optional) Dashboard shows test history and weak areas

---

## What's Fixed

### Before (Broken):
```sql
user_id UUID  -- ❌ Wrong type for Firebase
```

### After (Fixed):
```sql
user_id TEXT  -- ✅ Correct type for Firebase
```

### Tables Fixed:
- ✅ user_career_selections
- ✅ user_test_results
- ✅ user_skill_progress
- ✅ career_recommendations

---

## Next Steps

After setup:
1. ✅ Dashboard shows real career requirements
2. ✅ Take tests to populate your actual data
3. ✅ Dashboard automatically tracks progress
4. ✅ Weak areas highlighted automatically
5. ✅ No dummy data - everything is real!

---

## Need Help?

If you still have issues:
1. Check you ran Step 1 first (fix tables)
2. Verify your user ID is correct (TEXT, not UUID)
3. Make sure you're logged in
4. Check browser console for errors (F12)
5. Verify tables exist in Supabase Table Editor

---

## 🎉 You're Done!

Once all steps are complete, your dashboard will show:
- ✅ Real career requirements
- ✅ Your actual test scores
- ✅ Areas where you need improvement
- ✅ Complete test history
- ✅ Progress toward qualification

**Everything is real data - no dummy information!**
