# Fix Learning Path Issue - Quick Steps

## 🎯 Problem
Your OGL Content Developer tests are showing up under OGL Tester in the Learning Path.

## ✅ Solution (3 Simple Steps)

### Step 1: Add career_id Column to Database
1. Open **Supabase Dashboard** → SQL Editor
2. Copy and paste this SQL:
```sql
ALTER TABLE scorecards 
ADD COLUMN IF NOT EXISTS career_id UUID REFERENCES careers(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_scorecards_career_id ON scorecards(career_id);
```
3. Click **Run**
4. You should see: ✅ Success

### Step 2: Update Your Old Test Data
1. In the same SQL Editor, run this:
```sql
-- Link your HTML/CSS/JavaScript tests to OGL Content Developer
UPDATE scorecards
SET career_id = (
  SELECT id FROM careers WHERE name = 'OGL Content Developer'
)
WHERE user_id = auth.uid()
  AND LOWER(skill) IN ('html', 'css', 'javascript', 'jquery', 'ogl knowledge')
  AND career_id IS NULL;
```
2. Click **Run**
3. You should see: ✅ Rows updated

### Step 3: Refresh Your App
1. Go to `http://localhost:3000/learning-path`
2. Press **Ctrl+Shift+R** (hard refresh)
3. You should now see your progress under **OGL Content Developer** ✅

## 🔍 Verify It Worked

Run this SQL to check:
```sql
SELECT 
  c.name as career_name,
  s.skill,
  s.level_attempted,
  s.overall_score,
  s.created_at
FROM scorecards s
LEFT JOIN careers c ON s.career_id = c.id
WHERE s.user_id = auth.uid()
ORDER BY s.created_at DESC;
```

You should see your tests linked to "OGL Content Developer"!

## 📝 What This Does

- **Step 1**: Adds a column to track which career each test belongs to
- **Step 2**: Updates your existing tests to link them to OGL Content Developer
- **Step 3**: Shows the correct progress in Learning Path

## 🎉 Done!

Your Learning Path will now correctly show:
- ✅ OGL Content Developer with your test progress
- ✅ Correct qualification status
- ✅ Accurate skill completion tracking

## 💡 For Future Tests

All new tests will automatically save the career_id, so this issue won't happen again!

---

**Need Help?** Check `FIX_LEARNING_PATH_CAREER_MATCHING.md` for detailed explanation.
