# Quick Answer: Are Ansible Questions in Database?

## To Check

Run this in Supabase SQL Editor:

```sql
SELECT COUNT(*) FROM practice_questions 
WHERE skill = 'Ansible' AND level = 'Advanced';
```

**Result:**
- **0 rows** = Questions NOT in database → Need to upload
- **364 rows** = Questions already in database → Already uploaded

## To Upload (if not present)

**Easiest way:**
```bash
UPLOAD_ANSIBLE_ADVANCED.bat
```

**Or:**
```bash
npx tsx scripts/upload-ansible-advanced.ts
```

## Files Ready

✓ `questions/ansible-advanced.csv` - Fixed, BOM removed, 364 questions
✓ `scripts/upload-ansible-advanced.ts` - Upload script
✓ `UPLOAD_ANSIBLE_ADVANCED.bat` - One-click upload

## What Was Fixed

- **Problem**: UTF-8 BOM causing "0 questions" error
- **Solution**: BOM removed, file now parseable
- **Status**: Ready to upload

The script will automatically:
1. Check if questions exist
2. Delete old questions (if any)
3. Upload 364 new questions
4. Verify upload success
