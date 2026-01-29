# Why User Data Doesn't Show on Dashboard

## The Problem

Your logs show:
```
Loading dashboard data from scorecards only...
Loaded 10 questions
```

But **no user data displays** on the Dashboard.

## Root Cause

**Scorecards are NOT being saved to the Supabase database!**

Looking at your code:
1. ✅ Tests load questions correctly
2. ✅ User completes the test
3. ❌ **Scorecard is saved to `sessionStorage` only** (not database)
4. ❌ Dashboard queries database for scorecards
5. ❌ Database has no scorecards → Dashboard shows "No Progress Data"

### Evidence:

From `Scorecard.tsx`:
```typescript
// Scorecard is stored in sessionStorage
const storedScorecard = sessionStorage.getItem('latestScorecard');
```

From `Dashboard.tsx`:
```typescript
// Dashboard queries database
const { data: scorecardsData } = await supabase
  .from('scorecards')
  .select('*')
  .eq('user_id', user.id);
// Returns empty because scorecards aren't saved to database!
```

---

## The Solution

You need to **save scorecards to the Supabase database** when tests are completed.

### Option 1: Find Where Scorecard is Created

Look for where the scorecard is generated after test completion and add database save:

```typescript
// After generating scorecard
const scorecardData = {
  user_id: user.id,
  skill: skillName,
  level_attempted: level,
  overall_score: score,
  level_readiness: readiness,
  created_at: new Date().toISOString(),
  // ... other fields
};

// Save to database
await supabase
  .from('scorecards')
  .insert([scorecardData]);

// Also save to sessionStorage (for immediate display)
sessionStorage.setItem('latestScorecard', JSON.stringify(scorecardData));
```

### Option 2: Use Different Approach

Instead of relying on scorecards table, use the tables that ARE being saved:
- `evaluation_sessions` ✅ (being saved)
- `user_test_results` ✅ (being saved)
- `user_skill_progress` ✅ (being saved)

Update Dashboard to query these tables instead.

---

## Quick Fix: Check What Data EXISTS

Run this SQL to see what data you actually have:

```sql
-- Check evaluation_sessions
SELECT COUNT(*) as sessions FROM evaluation_sessions;

-- Check user_test_results  
SELECT COUNT(*) as test_results FROM user_test_results;

-- Check scorecards
SELECT COUNT(*) as scorecards FROM scorecards;

-- If scorecards = 0, that's your problem!
```

---

## Recommended Solution

**Update Dashboard to use `user_test_results` table instead of `scorecards`:**

```typescript
// In Dashboard.tsx
const { data: testResults } = await supabase
  .from('user_test_results')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });

// Build progress from test results
// (similar to how you were building from scorecards)
```

---

## Summary

❌ **Problem:** Scorecards saved to sessionStorage only  
❌ **Result:** Dashboard queries empty database table  
✅ **Solution:** Either save scorecards to database OR use tables that are being saved  

The 406 errors are fixed, but you need to fix the data persistence issue.
