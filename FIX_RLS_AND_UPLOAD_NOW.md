# Fix RLS and Upload Questions - 2 Simple Steps

## The Problem

Your Supabase table has **Row Level Security (RLS)** enabled, which is blocking the uploads.

Error: `new row violates row-level security policy for table "practice_questions"`

## The Solution (2 Steps)

### Step 1: Disable RLS in Supabase

Go to **Supabase SQL Editor** and run this SQL:

```sql
-- Disable RLS
ALTER TABLE practice_questions DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON practice_questions TO anon;
GRANT ALL ON practice_questions TO authenticated;
GRANT ALL ON practice_questions TO service_role;
```

**Or use the file I created:**
- Open `DISABLE_RLS_AND_UPLOAD.sql`
- Copy all the SQL
- Paste in Supabase SQL Editor
- Click "Run"

### Step 2: Upload Questions

Now run the upload:

```bash
UPLOAD_VALID_QUESTIONS.bat
```

Or:

```bash
npx tsx scripts/upload-valid-questions-only.ts
```

This will upload all 9,554 questions!

---

## After Upload (Optional)

If you want to re-enable RLS later for security:

```sql
-- Re-enable RLS
ALTER TABLE practice_questions ENABLE ROW LEVEL SECURITY;

-- Add a policy to allow public read access
CREATE POLICY "Allow public read access" 
ON practice_questions FOR SELECT 
USING (true);

-- Add a policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" 
ON practice_questions FOR INSERT 
TO authenticated
WITH CHECK (true);
```

---

## Quick Summary

1. ✅ Run SQL in Supabase to disable RLS
2. ✅ Run `UPLOAD_VALID_QUESTIONS.bat`
3. ✅ Wait 3-5 minutes
4. ✅ Verify: `SELECT COUNT(*) FROM practice_questions;`
5. ✅ Done! You'll have 9,554 questions

---

## Why This Happened

Supabase enables RLS by default for security. This prevents unauthorized access, but it also blocks uploads unless you have the right policies or disable RLS temporarily.

For a questions database that should be publicly readable, it's safe to disable RLS or add a permissive read policy.

---

**Ready?** Just run the SQL in Supabase, then run the batch file!
