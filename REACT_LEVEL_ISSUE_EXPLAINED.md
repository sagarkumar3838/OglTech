# React Level Issue - Diagnosis & Fix

## The Problem

Your screenshot shows:
```
ReactJS  |  0  |  0  |  0  |  167  |  COMPLETE
         Basic  Int  Adv  Total
```

This means:
- ✅ 167 total ReactJS questions exist in database
- ❌ 0 questions showing for Basic level
- ❌ 0 questions showing for Intermediate level  
- ❌ 0 questions showing for Advanced level

## Root Cause

**Level Name Mismatch** between database and UI:

### What the UI expects (Practice.tsx):
```typescript
// UI sends: 'beginner', 'intermediate', 'advanced'
// But maps to database: 'Basic', 'Intermediate', 'Advanced'
const dbLevel = level === 'beginner' ? 'Basic' : 
                level === 'intermediate' ? 'Intermediate' : 
                level === 'advanced' ? 'Advanced' : level;
```

### What might be in your database:
- Questions stored as: `'beginner'`, `'intermediate'`, `'advanced'` (lowercase)
- Or: `'Easy'`, `'Medium'`, `'Hard'`
- Or: `'basic'`, `'BASIC'`, etc.

### What should be in database:
- `'Basic'` (capital B, rest lowercase)
- `'Intermediate'` (capital I, rest lowercase)
- `'Advanced'` (capital A, rest lowercase)

## The Fix

### Option 1: Run SQL Fix (Recommended)

1. Open Supabase Dashboard → SQL Editor
2. Run `FIX_REACT_COMPLETE.sql`
3. This will:
   - Standardize skill name to 'ReactJS'
   - Convert all level variations to: Basic, Intermediate, Advanced
   - Show before/after counts

### Option 2: Check First, Then Fix

1. Run `CHECK_REACT_ACTUAL_LEVELS.sql` to see current state
2. Then run `FIX_REACT_COMPLETE.sql` to fix

## Verification

After running the fix, run this query:

```sql
SELECT 
  level,
  COUNT(*) as count
FROM practice_questions
WHERE skill = 'ReactJS'
GROUP BY level;
```

Expected result:
```
level         | count
--------------+-------
Basic         | ~100+
Intermediate  | ~50+
Advanced      | ~17+
```

## Why This Happened

When you uploaded `react-beginner.csv`, the upload script set:
```typescript
level: 'Basic'  // ✅ Correct
```

But some questions might have been uploaded earlier with different level names, or there might be a database constraint forcing different values.

## Prevention

Going forward, always use these exact level names:
- ✅ `'Basic'` (not beginner, easy, basic)
- ✅ `'Intermediate'` (not intermediate, medium)
- ✅ `'Advanced'` (not advanced, hard)

## Quick Test

After fixing, test in your app:
1. Go to Practice page
2. Select ReactJS
3. Select Beginner level
4. You should see questions load

If questions still don't show, check browser console for errors.
