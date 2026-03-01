# Debug Practice Page - Questions Not Showing

## Problem
Questions are not displaying on http://localhost:3001/practice

## Possible Causes & Solutions

### 1. Check Browser Console for Errors

Open browser DevTools (F12) and check Console tab for:
- ❌ Supabase connection errors
- ❌ Authentication errors (401/403)
- ❌ RLS policy errors
- ❌ CORS errors
- ❌ JavaScript errors

**Action**: Copy any error messages you see

---

### 2. Check Network Tab

Open DevTools > Network tab and:
1. Reload the page
2. Look for requests to Supabase (usually to `supabase.co`)
3. Check if any requests are:
   - Red (failed)
   - Returning 401/403 (permission denied)
   - Returning empty data `[]`

**Action**: Click on the Supabase request and check:
- Request URL
- Response body
- Status code

---

### 3. Test Database Query

Run this SQL in Supabase SQL Editor:

```sql
-- Check if questions exist
SELECT COUNT(*) FROM questions;

-- Check JavaScript easy MCQ questions (default on Practice page)
SELECT * FROM questions
WHERE skill = 'javascript'
  AND level = 'easy'
  AND type = 'mcq'
LIMIT 5;

-- Check all skills and levels available
SELECT skill, level, type, COUNT(*) as count
FROM questions
GROUP BY skill, level, type
ORDER BY skill, level;
```

**Expected**: Should return questions. If 0 results, database is empty.

---

### 4. Check RLS Policies

Run this SQL to check Row Level Security:

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'questions';

-- Check RLS policies
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'questions';
```

**If RLS is enabled but no policies exist**, questions won't be accessible.

**Solution**: Either disable RLS or add a policy:

```sql
-- Option A: Disable RLS (for testing only)
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;

-- Option B: Add permissive policy (recommended)
CREATE POLICY "Allow public read access to questions"
ON questions FOR SELECT
TO public
USING (true);
```

---

### 5. Check Environment Variables

Verify `.env` file in `client/` folder has:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

**Action**: 
1. Check if file exists
2. Verify values are correct
3. Restart dev server after changes

---

### 6. Test Query in Browser Console

Open browser console on Practice page and run:

```javascript
// Test if supabase is available
console.log('Supabase:', supabase);

// Test query
const { data, error } = await supabase
  .from('questions')
  .select('*')
  .eq('skill', 'javascript')
  .eq('level', 'easy')
  .eq('type', 'mcq')
  .limit(10);

console.log('Data:', data);
console.log('Error:', error);
```

**Expected**: Should return array of questions

---

### 7. Check Authentication

The Practice page requires authentication. Verify:

```javascript
// In browser console
const { data: { user } } = await supabase.auth.getUser();
console.log('Current user:', user);
```

**If user is null**: You're not logged in
**Solution**: Go to `/login` and sign in first

---

### 8. Common Issues & Fixes

#### Issue: "questions table does not exist"
**Solution**: Run the database setup SQL scripts

#### Issue: "permission denied for table questions"
**Solution**: Fix RLS policies (see step 4)

#### Issue: "No questions returned but table has data"
**Solution**: Check if skill/level/type values match exactly
- Skill should be lowercase: 'javascript' not 'JavaScript'
- Level should be: 'easy', 'medium', or 'hard'
- Type should be: 'mcq'

#### Issue: "Cannot read property 'options' of undefined"
**Solution**: Questions exist but have wrong format. Check options column:

```sql
SELECT id, question, options, correct_answer
FROM questions
WHERE skill = 'javascript' AND level = 'easy'
LIMIT 1;
```

Options should be either:
- Array: `["Option A", "Option B", "Option C", "Option D"]`
- Object: `{"a": "Option A", "b": "Option B", "c": "Option C", "d": "Option D"}`

---

## Quick Test Steps

1. **Open Practice page**: http://localhost:3001/practice
2. **Open DevTools**: Press F12
3. **Check Console**: Any red errors?
4. **Check Network**: Any failed requests?
5. **Run test query**: Copy/paste the browser console test from step 6
6. **Check database**: Run SQL queries from step 3

---

## Report Back

After checking above, report:
1. ✅ or ❌ Questions exist in database
2. ✅ or ❌ User is logged in
3. ✅ or ❌ RLS policies allow access
4. Any error messages from console
5. Response from test query in browser console
