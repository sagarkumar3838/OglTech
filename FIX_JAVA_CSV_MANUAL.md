# Manual Fix for Java Beginner CSV Issues

## The 3 Problems

### Row 54 (Line 55 in file)
**Issue**: Extra field - has 16 fields instead of 15
**Problem**: The explanation field has an extra comma or the YouTube link is split

### Row 67 (Line 68 in file)  
**Issue**: Malformed trailing quote
**Problem**: Question text ends with `?` followed by newline inside quotes

### Row 90 (Line 91 in file)
**Issue**: Malformed trailing quote  
**Problem**: Question text ends with `?` followed by newline inside quotes

## Quick Fix Options

### Option 1: Use the Script (RECOMMENDED)
```
FIX_JAVA_CSV.bat
```

This will:
- Create a backup (java-beginner.csv.backup)
- Fix line breaks within quoted fields
- Merge split lines back together
- Save the fixed CSV

### Option 2: Manual Edit

Open `questions/java-beginner.csv` in a text editor and:

1. **Row 67** - Remove the line break after the question mark:
   ```
   Before: "What is the value of x after: int x = 8; x >>= 2; ?
   ","2","4"...
   
   After: "What is the value of x after: int x = 8; x >>= 2; ?","2","4"...
   ```

2. **Row 90** - Remove the line break after the question mark:
   ```
   Before: "After executing: int x = 16; x >>>= 2; what is x?",
   "4","8"...
   
   After: "After executing: int x = 16; x >>>= 2; what is x?","4","8"...
   ```

3. **Row 54** - Check if there's an extra comma in the YouTube links

### Option 3: Skip These 3 Rows

If you want to upload quickly, you can:
1. Delete rows 54, 67, and 90 from the CSV
2. Upload the remaining 99 questions
3. Add these 3 questions manually later via SQL

## After Fixing

1. Go to Supabase Table Editor
2. Select `practice_questions` table
3. Click "Insert" → "Import data from CSV"
4. Upload the fixed `java-beginner.csv`
5. Map columns correctly
6. Click "Import"

Should show: "102 rows will be added" with NO issues

## Verify Upload

Run this SQL:
```sql
SELECT COUNT(*) FROM practice_questions WHERE skill = 'Java' AND level = 'Basic';
```

Expected: 102 questions
