# Ansible Advanced Questions - Upload Guide

## Current Status

✓ **CSV File Fixed**: BOM removed, 364 valid questions ready
✓ **File Location**: `questions/ansible-advanced.csv`
✓ **Backup Created**: `questions/ansible-advanced.csv.backup`

## Check if Questions Already Exist

### Option 1: Run SQL Query (Recommended)

Open Supabase SQL Editor and run:

```sql
-- Check practice_questions table
SELECT COUNT(*) as ansible_advanced_count
FROM practice_questions
WHERE skill = 'Ansible' AND level = 'Advanced';

-- Check questions table
SELECT COUNT(*) as ansible_advanced_count
FROM questions
WHERE skill = 'Ansible' AND level = 'Advanced';
```

Or use the provided SQL file:
```bash
# Copy contents of check-ansible-in-database.sql to Supabase SQL Editor
```

### Option 2: Check via Script

The upload script will automatically check for existing questions before uploading.

## Upload Methods

### Method 1: Automated Upload Script (Recommended)

**Run the batch file:**
```bash
UPLOAD_ANSIBLE_ADVANCED.bat
```

**Or run directly:**
```bash
npx tsx scripts/upload-ansible-advanced.ts
```

**What it does:**
1. Checks for existing Ansible Advanced questions
2. Deletes existing questions (prevents duplicates)
3. Uploads all 364 questions in batches of 50
4. Verifies the upload was successful

### Method 2: Manual Upload via Supabase Dashboard

1. Go to Supabase Dashboard → Table Editor
2. Select `practice_questions` table
3. Click "Insert" → "Insert from CSV"
4. Upload `questions/ansible-advanced.csv`
5. Map columns correctly
6. Click "Import"

**Note**: Manual upload may fail if BOM was not removed. Use the fixed file.

### Method 3: Use Existing Upload Scripts

If you have other upload scripts that work:

```bash
# Your existing upload script
npx tsx scripts/upload-csv-direct.ts questions/ansible-advanced.csv

# Or batch upload
UPLOAD_ALL_CSV_NOW.bat
```

## Expected Results

After successful upload:

```
✓ 364 Ansible Advanced questions in database
✓ All questions have proper skill='Ansible' and level='Advanced'
✓ All 16 fields populated correctly
✓ No duplicates
```

## Verification

### Quick Check
```sql
SELECT 
  skill,
  level,
  COUNT(*) as total
FROM practice_questions
WHERE skill = 'Ansible'
GROUP BY skill, level
ORDER BY level;
```

Expected output:
```
skill    | level        | total
---------|--------------|-------
Ansible  | Advanced     | 364
Ansible  | Beginner     | (varies)
Ansible  | Intermediate | (varies)
```

### Detailed Check
```sql
-- View sample questions
SELECT 
  id,
  question_text,
  correct_answer,
  topic
FROM practice_questions
WHERE skill = 'Ansible' AND level = 'Advanced'
LIMIT 10;
```

## Troubleshooting

### Issue: "0 questions uploaded"

**Cause**: BOM still present in file
**Fix**: 
```bash
# Re-run the BOM fix
npx tsx scripts/fix-ansible-csv-bom.ts
```

### Issue: "Duplicate questions"

**Cause**: Questions already exist in database
**Fix**: Delete existing first
```sql
DELETE FROM practice_questions
WHERE skill = 'Ansible' AND level = 'Advanced';
```

Then re-upload.

### Issue: "Column mismatch error"

**Cause**: CSV structure doesn't match database schema
**Fix**: Verify your database has these columns:
- skill, level, question_text
- option_a, option_b, option_c, option_d
- correct_answer, explanation, topic
- mdn_link, youtube_english, youtube_hindi, youtube_kannada, youtube_tamil, youtube_telugu

### Issue: "Permission denied"

**Cause**: RLS (Row Level Security) policies blocking insert
**Fix**: Temporarily disable RLS or use service role key
```sql
-- Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'practice_questions';

-- Temporarily disable (be careful!)
ALTER TABLE practice_questions DISABLE ROW LEVEL SECURITY;
-- Upload questions
-- Re-enable
ALTER TABLE practice_questions ENABLE ROW LEVEL SECURITY;
```

## Files Created

- ✓ `check-ansible-in-database.sql` - Check existing questions
- ✓ `scripts/upload-ansible-advanced.ts` - Upload script
- ✓ `UPLOAD_ANSIBLE_ADVANCED.bat` - Easy upload batch file
- ✓ `ANSIBLE_UPLOAD_GUIDE.md` - This guide

## Next Steps

1. **Check database** using `check-ansible-in-database.sql`
2. **If questions don't exist**: Run `UPLOAD_ANSIBLE_ADVANCED.bat`
3. **If questions exist**: Decide whether to:
   - Keep existing (do nothing)
   - Replace with new (delete then upload)
   - Add new (may create duplicates)
4. **Verify upload** using SQL queries above

## Summary

Your Ansible Advanced CSV file is now:
- ✓ BOM-free (no parsing errors)
- ✓ Properly formatted (364 valid questions)
- ✓ Ready for database upload

The upload script will handle everything automatically, including checking for duplicates and verifying the upload.
