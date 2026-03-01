# Azure Advanced Duplicate Questions Fix

## Problem
The database shows **693 Azure Advanced questions** when there should only be around **72 unique questions**.

This happened because the questions were uploaded multiple times, creating duplicates.

## Solution

### Step 1: Diagnose the Problem
Run `diagnose-azure-duplicates.sql` in Supabase SQL Editor to see:
- Total questions vs unique questions
- Which questions are duplicated
- How many times they were uploaded

### Step 2: Remove Duplicates
Run `CLEAN_AZURE_DUPLICATES_SAFE.sql` in Supabase SQL Editor.

This script will:
- Keep the FIRST occurrence of each unique question (lowest ID)
- Delete all duplicate copies
- Verify the cleanup was successful

### Step 3: Verify
After running the cleanup, you should see:
- Total questions = Unique questions (no duplicates)
- Around 72 Azure Advanced questions remaining

## Files Created

1. **diagnose-azure-duplicates.sql** - Check for duplicates
2. **CLEAN_AZURE_DUPLICATES_SAFE.sql** - Remove duplicates safely
3. **remove-azure-duplicates.sql** - Alternative removal method
4. **FIX_AZURE_DUPLICATES.bat** - Quick reference guide

## Why This Happened

The CSV file was likely uploaded multiple times, either:
- Running the upload script multiple times
- Previous uploads weren't cleared before new uploads
- The duplicate check in the upload script didn't work properly

## Prevention

To prevent this in the future:
1. Always check the database before uploading
2. Use the verification scripts after each upload
3. Consider adding a unique constraint on (skill, level, question_text)

## Expected Results

After cleanup:
- Azure Basic: ~50-100 questions
- Azure Intermediate: ~50-100 questions  
- Azure Advanced: ~72 questions

All should be unique with no duplicates.
