# Upload Questions to Supabase - Simple Steps

## Current Status ✅

- **9,464 questions** ready to upload
- **123 CSV files** with valid data
- **9 empty files** will be skipped (vscode, vue, webpack)
- All CSV formatting issues have been fixed

## The Problem 🚫

Your Supabase table has **Row Level Security (RLS)** enabled, which blocks uploads.

## Solution (2 Steps) 🎯

### Step 1: Disable RLS in Supabase

1. Go to https://supabase.com and sign in
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New query**
5. Copy and paste this SQL:

```sql
-- Disable RLS
ALTER TABLE practice_questions DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON practice_questions TO anon;
GRANT ALL ON practice_questions TO authenticated;
GRANT ALL ON practice_questions TO service_role;

-- Verify (should show rowsecurity = false)
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'practice_questions';
```

6. Click **Run** (or press Ctrl+Enter)
7. Verify the output shows `rowsecurity = false`

### Step 2: Upload Questions

Double-click this file:

```
UPLOAD_VALID_QUESTIONS.bat
```

Or run in terminal:

```bash
npx tsx scripts/upload-valid-questions-only.ts
```

**Wait 3-5 minutes** for the upload to complete.

## Expected Output 📊

```
📄 angular-advanced.csv... Found 138 questions
   Uploading... ✅ Uploaded 138 questions

📄 python-intermediate.csv... Found 264 questions
   Uploading... ✅ Uploaded 264 questions

...

📊 SUMMARY:
Total files processed: 132
✅ Successfully uploaded: 123 files
⏭️  Skipped: 9 files
📝 Total questions uploaded: 9464
```

## Verify Upload ✅

Go back to Supabase SQL Editor and run:

```sql
-- Check total
SELECT COUNT(*) FROM practice_questions;
-- Should show: 9464

-- Check by skill
SELECT skill, COUNT(*) as count 
FROM practice_questions 
GROUP BY skill 
ORDER BY count DESC
LIMIT 10;
```

## Done! 🎉

You now have 9,464 questions covering 41 technologies with 3 difficulty levels each.

---

## Troubleshooting 🆘

**Still getting RLS error?**
- Make sure you ran the SQL in Step 1
- Refresh your Supabase dashboard
- Check that `rowsecurity = false`

**Upload is slow?**
- This is normal! Takes 3-5 minutes for 9,464 questions
- Uploads in batches of 100 for reliability

---

## Files Reference

- `DISABLE_RLS_AND_UPLOAD.sql` - SQL to disable RLS
- `UPLOAD_VALID_QUESTIONS.bat` - Upload script
- `scripts/preview-upload.ts` - Preview what will be uploaded
- `scripts/upload-valid-questions-only.ts` - Upload script source

---

**Total time: 10 minutes**  
**Result: 9,464 questions in your database**
