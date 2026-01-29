# Questions Database Fix Guide

## Problem
Error: "No questions available for skill='html' and level='easy'"

## Root Cause
Questions in the database have inconsistent formatting:
- Skill names: "HTML" instead of "html"
- Level names: "BASIC" instead of "easy"

## Solution

### Option 1: Automated Fix (Recommended)
Run the automated fix script that handles everything:

```bash
RUN_FIX_NOW.bat
```

This will:
1. ✅ Check current database state
2. ✅ Standardize all existing questions (HTML → html, BASIC → easy)
3. ✅ Upload HTML easy questions from CSV (if not already present)
4. ✅ Remove duplicate questions
5. ✅ Verify the fix worked

### Option 2: Manual Fix
If you prefer to do it manually:

#### Step 1: Run SQL Cleanup
Go to Supabase SQL Editor and run `fix-questions-database.sql`

#### Step 2: Upload CSV Questions
```bash
npx tsx scripts/upload-csv-to-supabase.ts client/dist/assets/html_easy_questions.csv
```

#### Step 3: Verify
```bash
npx tsx scripts/test-supabase-connection.ts
```

## Expected Results

After running the fix, you should see:
- ✅ HTML easy questions: 19+ questions
- ✅ All skill names in lowercase: "html", "css", "javascript"
- ✅ All level names standardized: "easy", "medium", "hard"
- ✅ No duplicate questions

## Verification

Check your database in Supabase SQL Editor:

```sql
-- Should return 19+ questions
SELECT COUNT(*) FROM questions 
WHERE skill = 'html' AND level = 'easy';

-- Should show all questions by skill and level
SELECT skill, level, COUNT(*) as count 
FROM questions 
GROUP BY skill, level 
ORDER BY skill, level;
```

## Troubleshooting

### Still getting "No questions available"?

1. **Check database connection**
   - Verify `.env` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

2. **Check RLS policies**
   - Questions table should allow SELECT for authenticated users
   - Run: `enable-supabase-auth-rls.sql` in Supabase SQL Editor

3. **Check question format**
   ```sql
   SELECT * FROM questions WHERE skill = 'html' AND level = 'easy' LIMIT 1;
   ```
   - Skill should be lowercase: "html" not "HTML"
   - Level should be lowercase: "easy" not "BASIC"

4. **Re-run the fix**
   ```bash
   RUN_FIX_NOW.bat
   ```

## Adding More Questions

To add questions for other skills/levels:

1. Create a CSV file with this format:
   ```csv
   skill,level,type,question,option_a,option_b,option_c,option_d,correct_answer,explanation
   html,easy,Multiple Choice,What does HTML stand for?,Option A,Option B,Option C,Option D,Option A,Explanation here
   ```

2. Upload using:
   ```bash
   npx tsx scripts/upload-csv-to-supabase.ts path/to/your/questions.csv
   ```

## Quick Reference

- **Fix everything**: `RUN_FIX_NOW.bat`
- **Upload CSV**: `npx tsx scripts/upload-csv-to-supabase.ts <file.csv>`
- **Check database**: Run `verify-questions-now.sql` in Supabase
- **Test connection**: `npx tsx scripts/test-supabase-connection.ts`

## Need Help?

Check these files:
- `QUESTIONS_SETUP_COMPLETE.md` - Full setup guide
- `QUICK_START_QUESTIONS.txt` - Quick start guide
- `CSV_UPLOAD_GUIDE.md` - CSV upload instructions
