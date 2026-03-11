# Step-by-Step CSV Upload Guide

## Complete Process to Upload Questions Without Duplicates

### Step 1: Prepare Your CSV Files

**File Naming Convention:**
- Format: `{skill}-{level}.csv`
- Level must be: `beginner`, `intermediate`, or `advanced`
- Examples:
  - ✅ `react-beginner.csv`
  - ✅ `python-intermediate.csv`
  - ✅ `kubernetes-advanced.csv`
  - ❌ `React-Beginner.csv` (wrong case)
  - ❌ `python_advanced.csv` (underscore instead of dash)

**CSV File Structure:**

Your CSV must have these columns (header row):
```csv
question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic
```

**Example CSV Content:**
```csv
question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic
"What is React?","A library","A framework","A language","A database","A","React is a JavaScript library for building user interfaces","Basics"
"What is JSX?","JavaScript XML","Java Syntax","JSON Extension","JavaScript Extra","A","JSX is a syntax extension for JavaScript","JSX"
```

**Important Rules:**
- Wrap text containing commas in double quotes
- `correct_answer` must be: A, B, C, or D
- Required fields: question_text, option_a, option_b, correct_answer
- Save file as UTF-8 encoding

---

### Step 2: Place Files in Questions Folder

1. Open your project folder
2. Navigate to the `questions/` directory
3. Copy your CSV files into this folder

**Folder Structure:**
```
your-project/
├── questions/
│   ├── react-beginner.csv
│   ├── react-intermediate.csv
│   ├── react-advanced.csv
│   ├── python-beginner.csv
│   └── ... (more CSV files)
├── scripts/
├── UPLOAD_CSV_NO_DUPLICATES.bat
└── ...
```

---

### Step 3: Check Environment Setup

Make sure your `.env` file has Supabase credentials:

1. Open `.env` file in your project root
2. Verify these variables exist:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Where to find these:**
- Go to [supabase.com](https://supabase.com)
- Open your project
- Go to Settings → API
- Copy the URL and service_role key

---

### Step 4: Run the Upload Command

**Option A: Double-click the batch file**
1. Find `UPLOAD_CSV_NO_DUPLICATES.bat` in your project folder
2. Double-click it
3. Wait for the process to complete

**Option B: Run from terminal**
1. Open terminal in your project folder
2. Run:
```bash
UPLOAD_CSV_NO_DUPLICATES.bat
```

---

### Step 5: Review the Output

The script will show you:

**For each file:**
```
📄 react-beginner.csv
   Skill: react | Level: beginner
   📊 Found 100 questions in CSV
   ⏭️  Skipping 20 duplicate questions
   ⬆️  Uploading 80 new questions...
   ✅ Successfully uploaded 80 questions
```

**Summary at the end:**
```
======================================================================
📊 SUMMARY
======================================================================
✅ Uploaded:  180 new questions
⏭️  Skipped:   120 duplicates
❌ Errors:    2 failed
======================================================================
```

---

### Step 6: Handle Any Errors

If you see errors, the script will tell you exactly what's wrong:

**Example Error 1: Invalid Filename**
```
❌ Python-Advanced.csv
   ERROR: Invalid filename format
   💡 Expected format: skill-level.csv
   💡 Examples: python-beginner.csv, react-advanced.csv
```

**Fix:** Rename file to `python-advanced.csv` (lowercase)

**Example Error 2: Missing Required Fields**
```
📄 javascript-beginner.csv
   ⚠️  Found 3 validation issue(s):
      - Row 15: Missing option_a
      - Row 42: Invalid correct_answer (must be A, B, C, or D)
      - Row 78: Missing question_text
```

**Fix:** Open the CSV file and fix the specific rows mentioned

**Example Error 3: CSV Format Issue**
```
❌ FILE ERROR: Unexpected token
   💡 CSV format issue. Check for:
      - Proper comma separation
      - Quotes around text with commas
      - Matching column count in all rows
```

**Fix:** 
- Make sure text with commas is wrapped in quotes
- Check all rows have the same number of columns
- Save file as UTF-8 encoding

---

### Step 7: Fix Issues and Re-run

1. Fix the problematic files based on error messages
2. Run `UPLOAD_CSV_NO_DUPLICATES.bat` again
3. The script will only upload the fixed files (skips already uploaded questions)

---

### Step 8: Verify Upload in Database

**Option A: Run SQL Query**

Open Supabase SQL Editor and run:
```sql
-- Check total questions by skill and level
SELECT skill, level, COUNT(*) as total
FROM practice_questions
GROUP BY skill, level
ORDER BY skill, level;
```

**Option B: Check in Supabase Dashboard**
1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Select `practice_questions` table
4. Browse your uploaded questions

---

## Common Issues and Solutions

### Issue 1: "No questions uploaded"
**Cause:** CSV file is empty or has wrong format
**Solution:** 
- Check file has data rows (not just headers)
- Verify column names match expected format
- Make sure file is saved as CSV (not Excel)

### Issue 2: "All questions skipped"
**Cause:** Questions already exist in database
**Solution:** This is normal! The script prevents duplicates. If you want to re-upload, delete existing questions first.

### Issue 3: "Missing Supabase credentials"
**Cause:** `.env` file missing or incomplete
**Solution:** 
- Create `.env` file in project root
- Add `VITE_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Get values from Supabase Dashboard → Settings → API

### Issue 4: "Invalid correct_answer"
**Cause:** correct_answer column has invalid values
**Solution:** Make sure correct_answer is exactly: A, B, C, or D (uppercase)

### Issue 5: "Row X: Missing question_text"
**Cause:** Some rows have empty question_text
**Solution:** 
- Open CSV file
- Go to the row number mentioned
- Fill in the missing question_text

---

## Quick Reference

### Valid CSV Example
```csv
question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic
"What is React?","A library","A framework","A language","A database","A","React is a JavaScript library","Basics"
```

### Valid Filename Examples
- ✅ `react-beginner.csv`
- ✅ `python-intermediate.csv`
- ✅ `kubernetes-advanced.csv`

### Invalid Filename Examples
- ❌ `React-Beginner.csv` (wrong case)
- ❌ `python_advanced.csv` (underscore)
- ❌ `react.csv` (missing level)
- ❌ `react-easy.csv` (wrong level name)

### Valid Levels
- `beginner`
- `intermediate`
- `advanced`

### Valid correct_answer Values
- `A`
- `B`
- `C`
- `D`

---

## What the Script Does Automatically

✅ Finds all CSV files in `questions/` folder
✅ Validates filename format
✅ Parses CSV content
✅ Checks for missing required fields
✅ Queries database for existing questions
✅ Filters out duplicates
✅ Uploads only new questions
✅ Shows detailed progress for each file
✅ Reports validation issues with row numbers
✅ Provides helpful error messages
✅ Summarizes results at the end
✅ Lists all problematic files

---

## Need Help?

If you encounter issues not covered here:

1. Check the error message carefully - it tells you exactly what's wrong
2. Look at the row numbers mentioned in validation errors
3. Verify your CSV file format matches the example
4. Make sure filename follows the pattern: `skill-level.csv`
5. Check `.env` file has correct Supabase credentials

---

## Success! What's Next?

After successful upload:

1. ✅ Questions are in the database
2. ✅ No duplicates were created
3. ✅ You can verify in Supabase Dashboard
4. ✅ Questions are ready to use in your app

You can run the command again anytime to add more questions - it will always skip duplicates!
