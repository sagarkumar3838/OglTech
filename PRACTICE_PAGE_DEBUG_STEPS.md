# Practice Page Debug - Step by Step

## Problem
Questions not showing on http://localhost:3001/practice

## Quick Diagnosis Tool

I've created a debug page to help identify the issue:

### Access Debug Page
1. Go to: **http://localhost:3001/practice-debug**
2. This will run automatic diagnostics and show you exactly what's wrong

The debug page will check:
- ✅ Authentication status
- ✅ Supabase connection
- ✅ Total questions in database
- ✅ JavaScript easy MCQ questions (what Practice page loads)
- ✅ Available skills and levels
- ✅ Sample questions

---

## Most Common Issues & Fixes

### Issue 1: No Questions in Database (Most Likely)
**Symptom**: Debug page shows "Total Questions: 0"

**Solution**: Upload questions to database
```bash
# You have CSV files in questions/ folder
# Need to upload them to Supabase
```

### Issue 2: RLS Policy Blocking Access
**Symptom**: Debug page shows "permission denied" error

**Solution**: Run this SQL in Supabase SQL Editor:
```sql
-- File: FIX_PRACTICE_PAGE_NOW.sql (already created)
-- This fixes RLS policies
```

### Issue 3: Wrong Level Format
**Symptom**: Questions exist but Practice page shows 0

**Explanation**: 
- Practice page uses: beginner/intermediate/advanced
- Database might have: easy/medium/hard
- Code maps: beginner→easy, intermediate→medium, advanced→hard

**Check**: Look at "Available Levels" in debug page

### Issue 4: Not Logged In
**Symptom**: Debug page shows "Not logged in"

**Solution**: Go to /login and sign in first

---

## Step-by-Step Debugging

### Step 1: Run Debug Page
```
http://localhost:3001/practice-debug
```

### Step 2: Check Results
Look for ❌ (red X) marks - these indicate problems

### Step 3: Fix Based on Results

#### If "Total Questions" = 0:
→ Database is empty, need to upload questions

#### If "JavaScript Easy MCQ" = 0 but "Total Questions" > 0:
→ Questions exist but wrong skill/level/type values
→ Check "Available Skills" and "Available Levels" sections

#### If errors mention "permission denied":
→ RLS policy issue
→ Run: FIX_PRACTICE_PAGE_NOW.sql

#### If "Not logged in":
→ Go to /login

### Step 4: Fix and Retest
After applying fix:
1. Click "🔄 Run Again" on debug page
2. Check if issues are resolved
3. Go to Practice page to verify

---

## Files Created for Debugging

1. **PracticeDebug.tsx** - Debug page component
2. **DEBUG_PRACTICE_PAGE.md** - Detailed debugging guide
3. **FIX_PRACTICE_PAGE_NOW.sql** - SQL to fix RLS policies
4. **diagnose-practice-questions.sql** - SQL diagnostics
5. **test-practice-query.js** - Browser console test

---

## Quick Test in Browser Console

Open Practice page and run in console:
```javascript
// Test query
const { data, error } = await supabase
  .from('questions')
  .select('*')
  .eq('skill', 'javascript')
  .eq('level', 'easy')
  .eq('type', 'mcq')
  .limit(10);

console.log('Questions:', data?.length || 0);
console.log('Error:', error);
```

---

## Next Steps

1. **First**: Go to http://localhost:3001/practice-debug
2. **Check**: What the diagnostics show
3. **Report**: Tell me what you see (especially any ❌ marks)
4. **Fix**: I'll help you fix the specific issue

The debug page will tell us exactly what's wrong!
