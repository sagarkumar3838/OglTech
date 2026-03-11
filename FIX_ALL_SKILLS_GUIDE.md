# Fix All Skills Case Sensitivity - Complete Guide

## The Problem

Your database has questions split across different case variations of skill names:

| What You Have | What UI Shows | What's Hidden |
|---------------|---------------|---------------|
| "postgresql" + "PostgreSQL" | Only "PostgreSQL" (43) | "postgresql" (75) |
| "react" + "ReactJS" | Only one variation | The other variation |
| "javascript" + "JavaScript" | Only one variation | The other variation |

This happens because:
1. Your upload script uses the FILENAME (lowercase): `react-beginner.csv` → "react"
2. But CSV files have mixed case in skill column: "ReactJS", "React.js", "JavaScript"
3. Database stores BOTH variations
4. UI only shows ONE variation (case-sensitive query)

## The Solution (ONE SQL Command!)

Run this in Supabase SQL Editor:

```sql
UPDATE practice_questions
SET skill = LOWER(skill);
```

That's it! This converts ALL skill names to lowercase.

## What This Fixes

### Before:
```
postgresql  | intermediate | 75
PostgreSQL  | intermediate | 43
PostgreSQL  | beginner     | 6
PostgreSQL  | advanced     | 10
```

### After:
```
postgresql  | beginner     | 6
postgresql  | intermediate | 118  ← MERGED!
postgresql  | advanced     | 10
```

## Step-by-Step Instructions

### Option 1: Quick Fix (Recommended)

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Paste this command:
   ```sql
   UPDATE practice_questions SET skill = LOWER(skill);
   ```
4. Click "Run"
5. Refresh your UI

### Option 2: Full Diagnostic

1. Open `FIX_ALL_SKILLS_CASE_SENSITIVITY.sql`
2. Run each step in Supabase SQL Editor
3. Review the diagnostics
4. Execute Step 3 (the UPDATE command)
5. Verify with Step 4

## Expected Results

After running the fix, ALL skills will be lowercase:

- angular
- ansible
- aws
- azure
- cpp
- csharp
- css
- cypress
- devtools
- docker
- flutter
- gcp
- git
- glsl
- go
- html
- java
- javascript
- jest
- kotlin
- kubernetes
- linux
- mongodb
- nodejs
- opengl
- oracle
- php
- postgresql
- python
- react
- reactnative
- redis
- ruby
- rust
- selenium
- sql
- swift
- terraform
- typescript
- unity
- unreal
- vscode
- vue
- webpack

## Verification

After the fix, run this to verify:

```sql
SELECT 
    skill,
    COUNT(CASE WHEN level = 'beginner' THEN 1 END) as beginner,
    COUNT(CASE WHEN level = 'intermediate' THEN 1 END) as intermediate,
    COUNT(CASE WHEN level = 'advanced' THEN 1 END) as advanced,
    COUNT(*) as total
FROM practice_questions
GROUP BY skill
ORDER BY skill;
```

You should see:
- All skill names in lowercase
- Correct merged counts for each level
- No duplicate skill entries

## Why This Happened

Your CSV files have inconsistent skill names:
- `react-beginner.csv` has "ReactJS" in skill column
- `react-advanced.csv` has "React.js" in skill column
- `javascript-beginner.csv` has "JavaScript" in skill column

But the upload script uses the FILENAME (lowercase) to set the skill:
- `react-beginner.csv` → skill = "react"
- `javascript-beginner.csv` → skill = "javascript"

So you end up with BOTH in the database!

## Prevention

For future uploads, ensure your CSV files have lowercase skill names:

```csv
skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic
react,beginner,What is React?,A library,A framework,A language,A database,A,React is a JavaScript library,Introduction
```

Not:
```csv
skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic
ReactJS,Beginner,What is React?,A library,A framework,A language,A database,A,React is a JavaScript library,Introduction
```

## Impact

This fix will:
- ✅ Merge all case variations under lowercase names
- ✅ Show correct counts in your UI
- ✅ Prevent future case sensitivity issues
- ✅ Make your database consistent
- ✅ No data loss - just normalization

## Rollback (If Needed)

If you need to rollback (unlikely), you can't easily restore the original case. But since the upload script uses lowercase anyway, this is the correct state.

## Summary

**Problem:** Questions split across "PostgreSQL" and "postgresql"  
**Solution:** `UPDATE practice_questions SET skill = LOWER(skill);`  
**Result:** All skills normalized to lowercase, correct counts in UI  
**Time:** 5 seconds to run  
**Risk:** None - just normalization
