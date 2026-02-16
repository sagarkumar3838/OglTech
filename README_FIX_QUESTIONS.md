# 🚨 QUICK FIX: Questions Not Showing in Practice Page

## Problem
You added questions but they're not visible in the Practice page (e.g., OpenGL Beginner shows "No questions available").

## Solution (2 Steps)

### Step 1: Fix Question Format in Database

1. Go to Supabase: https://ksjgsgebjnpwyycnptom.supabase.co
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the entire content of `FIX_QUESTIONS_NOW.sql`
5. Click "Run" or press Ctrl+Enter

**This will:**
- Convert all skill names to lowercase without spaces
- Convert levels (beginner→easy, intermediate→medium, advanced→hard)
- Set all question types to 'mcq'
- Show you the results

### Step 2: Verify Questions Exist

After running the SQL, check the results at the bottom.

**If you see OpenGL questions:**
```
skill   | level | type | question_count
--------|-------|------|---------------
opengl  | easy  | mcq  | 10
opengl  | medium| mcq  | 10
opengl  | hard  | mcq  | 10
```
✅ **Great!** Questions exist. Go test the app.

**If you see 0 questions for OpenGL:**
```
(no rows returned)
```
❌ **Questions don't exist.** You need to upload them first.

---

## If Questions Don't Exist (0 count)

### Option A: Upload from CSV Files

1. Check if CSV files exist:
   ```
   questions/opengl-beginner.csv
   questions/opengl-intermediate.csv
   questions/opengl-advanced.csv
   ```

2. If they exist, run:
   ```bash
   UPLOAD_OPENGL_QUESTIONS.bat
   ```

3. If they don't exist, create them first (see `ADD_MORE_QUESTIONS_GUIDE.md`)

### Option B: Add Questions Manually in Supabase

1. Go to Supabase → Table Editor → questions
2. Click "Insert row"
3. Fill in:
   - `skill`: opengl (lowercase, no spaces)
   - `level`: easy (not beginner)
   - `type`: mcq
   - `question`: Your question text
   - `options`: ["Option A", "Option B", "Option C", "Option D"]
   - `correct_answer`: 0 (for first option) or 1, 2, 3
   - `explanation`: Explanation text
   - `topic`: Topic name

4. Repeat for 10+ questions

---

## Test the Fix

1. Open: https://skillevaluate.web.app/practice
2. Select "OpenGL" from dropdown
3. Select "Beginner" level
4. Questions should now load! 🎉

---

## Still Not Working?

### Check Browser Console

1. Press F12 to open DevTools
2. Go to "Console" tab
3. Look for errors (red text)
4. Common errors:
   - "No questions found" → Questions don't exist
   - "Permission denied" → RLS policy issue
   - "Network error" → Supabase connection issue

### Check Authentication

Make sure you're logged in:
1. Click your profile icon
2. If not logged in, click "Login"
3. Sign in with your account
4. Try loading questions again

### Check RLS Policies

If you see "Permission denied" errors:

```sql
-- Run this in Supabase SQL Editor
-- Check if RLS is blocking access
SELECT * FROM questions WHERE skill = 'opengl' LIMIT 1;

-- If you get an error, fix the policy:
DROP POLICY IF EXISTS "Allow authenticated users to read questions" ON questions;

CREATE POLICY "Allow authenticated users to read questions"
ON questions FOR SELECT
TO authenticated
USING (true);
```

---

## Quick Reference

### Expected Database Format

```
skill: opengl (lowercase, no spaces)
level: easy, medium, or hard (not beginner/intermediate/advanced)
type: mcq
options: ["A", "B", "C", "D"] or {"a": "A", "b": "B", "c": "C", "d": "D"}
correct_answer: 0, 1, 2, or 3 (for array) or "a", "b", "c", "d" (for object)
```

### Practice Page Mapping

```
Practice Page → Database
--------------------------
Beginner      → easy
Intermediate  → medium
Advanced      → hard
```

### Skill Name Format

```
Practice Page → Database
--------------------------
OpenGL        → opengl
JavaScript    → javascript
Node.js       → nodejs
C++           → cpp
C#            → csharp
```

---

## Files to Use

1. **FIX_QUESTIONS_NOW.sql** - Run this first to fix format
2. **check-opengl-questions.sql** - Check if questions exist
3. **UPLOAD_OPENGL_QUESTIONS.bat** - Upload questions from CSV
4. **DIAGNOSE_AND_FIX_QUESTIONS.md** - Detailed troubleshooting

---

## Summary

**Most common fix (90% of cases):**

1. Run `FIX_QUESTIONS_NOW.sql` in Supabase SQL Editor
2. Refresh the Practice page
3. Questions should now appear

**If questions still don't show:**

1. Check if questions exist (count > 0)
2. If count = 0, upload questions from CSV
3. If still issues, check browser console for errors

---

**Need help?** Check `DIAGNOSE_AND_FIX_QUESTIONS.md` for detailed troubleshooting.
