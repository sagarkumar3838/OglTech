# GCP Duplicate Questions Issue - EXPLAINED

## 🔴 The Real Problem

You have **DUPLICATE questions** in your database:
- Some questions with skill = `"GCP"` (uppercase)
- The SAME questions with skill = `"gcp"` (lowercase)

This happened because:
1. You uploaded GCP questions with uppercase "GCP"
2. Then you (or the system) uploaded the same questions again with lowercase "gcp"
3. Now you have 2 copies of many questions

## 📊 Current State

Based on your screenshots:
- **100 questions** with skill = "GCP" (uppercase)
- **41 questions** with skill = "gcp" (lowercase)
- **Some overlap** between these two sets (duplicates)

## ❌ Why Simple UPDATE Failed

When you tried:
```sql
UPDATE practice_questions SET skill = 'gcp' WHERE skill = 'GCP';
```

It failed because:
- Your database has a UNIQUE constraint: `unique_question_per_skill_level`
- This constraint prevents duplicate questions: `(skill, level, question_text)`
- Changing "GCP" to "gcp" would create duplicates with existing "gcp" questions
- Error: "Key (skill, level, question_text)=(gcp, beginner, What are the main categories of GCP services?) already exists"

## ✅ The Solution

You need to **remove duplicates FIRST**, then update the case.

### Step 1: Diagnose (Optional)
Run `diagnose-gcp-duplicates.sql` to see the duplicate situation.

### Step 2: Fix the Duplicates
Run `SIMPLE_FIX_GCP_DUPLICATES.sql` which does:

1. **Delete uppercase "GCP" duplicates** (keep lowercase "gcp" versions)
2. **Update remaining "GCP"** to "gcp" (non-duplicates)
3. **Verify** the fix worked

### Step 3: Verify
After the fix, you should have:
- **0 questions** with skill = "GCP"
- **~100 questions** with skill = "gcp" (no duplicates)
- All questions visible in frontend

## 🎯 Quick Fix (Copy & Paste)

Run this in Supabase SQL Editor:

```sql
-- Delete uppercase GCP duplicates
DELETE FROM practice_questions
WHERE skill = 'GCP'
AND question_text IN (
  SELECT question_text
  FROM practice_questions
  WHERE skill = 'gcp'
);

-- Update remaining GCP to gcp
UPDATE practice_questions
SET skill = 'gcp'
WHERE skill = 'GCP';

-- Verify
SELECT skill, level, COUNT(*) as count
FROM practice_questions
WHERE LOWER(skill) = 'gcp'
GROUP BY skill, level;
```

## 📈 Expected Results

After running the fix:

**Before:**
```
skill | level     | count
------|-----------|------
GCP   | beginner  | 100
gcp   | beginner  | 41
```

**After:**
```
skill | level     | count
------|-----------|------
gcp   | beginner  | 100  (or slightly less if there were true duplicates)
```

## 🚨 Why This Happened

This is a common issue when:
1. CSV file has uppercase skill names
2. Multiple uploads of the same file
3. No duplicate checking before upload

## 🛡️ Prevention

To prevent this in the future:

1. **Always use lowercase** skill names in CSV files
2. **Check for duplicates** before uploading
3. **Use the unique constraint** (already in place)
4. **Verify uploads** with count queries

## 📝 Files Created

1. `diagnose-gcp-duplicates.sql` - See the duplicate situation
2. `FIX_GCP_DUPLICATES_PROPERLY.sql` - Detailed fix with steps
3. `SIMPLE_FIX_GCP_DUPLICATES.sql` - Quick fix (RECOMMENDED)
4. `GCP_DUPLICATE_ISSUE_EXPLAINED.md` - This guide

## ✅ Next Steps

1. Run `SIMPLE_FIX_GCP_DUPLICATES.sql` in Supabase
2. Verify the count is correct
3. Test in your Practice page
4. Update your CSV file to use lowercase "gcp"

---

**Issue**: Duplicate questions with case mismatch
**Solution**: Delete duplicates, standardize to lowercase
**Status**: Ready to fix
