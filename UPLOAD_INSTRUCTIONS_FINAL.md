# Upload Questions to Supabase - Final Instructions

## 🎯 Goal
Upload 9,554 questions from CSV files to your Supabase database.

## ❌ Current Problem
**Row Level Security (RLS)** is blocking uploads.

## ✅ Solution (Follow These Steps)

---

### Step 1: Open Supabase Dashboard

1. Go to https://supabase.com
2. Sign in to your account
3. Select your project

---

### Step 2: Open SQL Editor

1. Click on **"SQL Editor"** in the left sidebar
2. Click **"New query"**

---

### Step 3: Disable RLS

Copy and paste this SQL:

```sql
-- Disable Row Level Security
ALTER TABLE practice_questions DISABLE ROW LEVEL SECURITY;

-- Grant permissions to all roles
GRANT ALL ON practice_questions TO anon;
GRANT ALL ON practice_questions TO authenticated;
GRANT ALL ON practice_questions TO service_role;

-- Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'practice_questions';
```

Click **"Run"** or press `Ctrl+Enter`

You should see output showing `rowsecurity = false`

---

### Step 4: Upload Questions

Now go back to your project folder and run:

**Windows:**
```bash
UPLOAD_VALID_QUESTIONS.bat
```

**Or in terminal:**
```bash
npx tsx scripts/upload-valid-questions-only.ts
```

---

### Step 5: Wait for Upload

The script will:
- Process 133 CSV files
- Upload 9,554 questions
- Take 3-5 minutes
- Show progress for each file

Expected output:
```
📄 angular-advanced.csv... Found 138 questions
   Uploading... ✅ Uploaded 138 questions

📄 python-intermediate.csv... Found 264 questions
   Uploading... ✅ Uploaded 264 questions

...

📊 SUMMARY:
Total files processed: 133
✅ Successfully uploaded: 124 files
⏭️  Skipped: 9 files
📝 Total questions uploaded: 9554
```

---

### Step 6: Verify Upload

Go back to Supabase SQL Editor and run:

```sql
-- Check total questions
SELECT COUNT(*) as total_questions FROM practice_questions;

-- Should show: 9554

-- Check by skill
SELECT skill, COUNT(*) as count 
FROM practice_questions 
GROUP BY skill 
ORDER BY count DESC
LIMIT 10;

-- Check by level
SELECT level, COUNT(*) as count 
FROM practice_questions 
GROUP BY level;
```

---

### Step 7: (Optional) Re-enable RLS

If you want security, re-enable RLS with public read access:

```sql
-- Re-enable RLS
ALTER TABLE practice_questions ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read questions
CREATE POLICY "Public read access" 
ON practice_questions FOR SELECT 
USING (true);

-- Allow authenticated users to insert (for admin)
CREATE POLICY "Authenticated insert" 
ON practice_questions FOR INSERT 
TO authenticated
WITH CHECK (true);
```

---

## 🎉 Done!

You now have 9,554 questions in your database covering:
- 41 different technologies
- 3 difficulty levels each
- Multiple language support (English, Hindi, Kannada, Tamil, Telugu)

---

## 🆘 Troubleshooting

### Still getting RLS error?
- Make sure you ran the SQL in Step 3
- Check that `rowsecurity = false` in the verification query
- Try refreshing your Supabase dashboard

### Upload is slow?
- This is normal! 9,554 questions take 3-5 minutes
- The script uploads in batches of 100 for reliability

### Some files skipped?
- 9 files (VS Code, Vue, Webpack) have no data - this is expected
- Only files with valid questions are uploaded

### Want to see what will be uploaded first?
```bash
npx tsx scripts/preview-upload.ts
```

---

## 📝 Summary

1. ✅ Disable RLS in Supabase SQL Editor
2. ✅ Run `UPLOAD_VALID_QUESTIONS.bat`
3. ✅ Wait 3-5 minutes
4. ✅ Verify with SQL query
5. ✅ (Optional) Re-enable RLS with policies

**Total time: 10 minutes**  
**Result: 9,554 questions uploaded**

---

**Need the SQL file?** Open `DISABLE_RLS_AND_UPLOAD.sql`

**Need help?** Check `FIX_RLS_AND_UPLOAD_NOW.md`
