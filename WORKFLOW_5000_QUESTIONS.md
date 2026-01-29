# Workflow: Build 5000 Unique Questions

## Goal
Build a master file with 5000 unique HTML easy questions by generating batches of 500 from DeepSeek and merging them.

## Master File
`client/dist/assets/html_easy_questions_unique.csv` - Your main file that stores all unique questions

## Workflow

### Step 1: Generate Questions from DeepSeek
1. Go to DeepSeek AI
2. Use this prompt:
   ```
   Generate 500 unique HTML easy level multiple choice questions in CSV format.
   Format: skill,level,type,question,option_a,option_b,option_c,option_d,correct_answer,explanation
   Skill: HTML
   Level: BASIC
   Make sure all questions are unique and different from each other.
   ```
3. Copy the generated CSV data

### Step 2: Create New Batch File
1. Create a new file: `new_batch_1.csv` (or any name)
2. Paste the 500 questions from DeepSeek
3. Save the file

### Step 3: Merge and Deduplicate
Run the script to merge new questions into your master file:

```bash
npx tsx scripts/merge-and-deduplicate.ts client/dist/assets/html_easy_questions_unique.csv new_batch_1.csv
```

Or use the batch file:
```bash
ADD_NEW_BATCH.bat
```

### Step 4: Repeat Until You Have 5000
Repeat Steps 1-3 until your master file has 5000 unique questions.

## Quick Reference

### Current Status
Check how many questions you have:
```bash
# Count lines in master file (subtract 1 for header)
```

### Add New Batch
```bash
# Method 1: Command line
npx tsx scripts/merge-and-deduplicate.ts client/dist/assets/html_easy_questions_unique.csv new_batch.csv

# Method 2: Batch file
ADD_NEW_BATCH.bat
```

### What Happens
1. ✅ Script reads your master file (current unique questions)
2. ✅ Script reads your new batch file (500 new questions)
3. ✅ Compares all questions
4. ✅ Removes duplicates automatically
5. ✅ Adds only new unique questions to master file
6. ✅ Creates backup of master file before updating
7. ✅ Shows statistics (how many added, how many duplicates)

## Example Session

### Batch 1 (First 500)
```bash
# Current: 325 questions
# Generate 500 from DeepSeek → new_batch_1.csv
npx tsx scripts/merge-and-deduplicate.ts html_easy_questions_unique.csv new_batch_1.csv
# Result: 325 + 450 new = 775 questions (50 were duplicates)
```

### Batch 2 (Next 500)
```bash
# Current: 775 questions
# Generate 500 from DeepSeek → new_batch_2.csv
npx tsx scripts/merge-and-deduplicate.ts html_easy_questions_unique.csv new_batch_2.csv
# Result: 775 + 420 new = 1195 questions (80 were duplicates)
```

### Continue...
Repeat until you reach 5000 unique questions!

## Output Example

```
🔄 Merging and Deduplicating Questions

============================================================

📖 Reading master file: html_easy_questions_unique.csv
   Found 325 existing questions

📖 Reading new file: new_batch_1.csv
   Found 500 new questions

🔍 Processing existing questions...
   Kept 325 unique questions from master file

🔍 Processing new questions...
  ✅ Added #1: "What is the purpose of the DOCTYPE declaration?..."
  ✅ Added #2: "Which HTML5 element is used for navigation?..."
  ❌ Duplicate #1: "What does HTML stand for?..."
  ✅ Added #3: "How do you create a mailto link?..."
  ...

============================================================
📊 RESULTS:
============================================================
   Master file questions: 325
   New questions provided: 500
   New questions added: 450
   Duplicates rejected: 50
   Total unique questions: 775
============================================================

💾 Backup created: html_easy_questions_unique_backup_1234567890.csv

✅ Updated master file: html_easy_questions_unique.csv
   Total questions now: 775

📝 Sample of newly added questions:
   1. What is the purpose of the DOCTYPE declaration?...
   2. Which HTML5 element is used for navigation?...
   3. How do you create a mailto link?...
   4. What is the difference between <div> and <span>?...
   5. How do you embed a YouTube video in HTML?...

✨ Done! Your master file has been updated with unique questions.
```

## Safety Features

### Automatic Backup
Every time you run the script, it creates a backup:
```
html_easy_questions_unique_backup_1234567890.csv
```

### No Data Loss
- Original master file is backed up before any changes
- If something goes wrong, restore from backup
- Duplicates are rejected, not deleted from new file

### Duplicate Detection
Duplicates are detected by comparing question text:
- Case-insensitive
- Whitespace trimmed
- Exact match required

## Tips for Generating Questions

### DeepSeek Prompts

**Batch 1-2 (Basic concepts)**
```
Generate 500 unique HTML easy level questions about basic HTML tags, 
attributes, and document structure. CSV format with multiple choice questions.
```

**Batch 3-4 (Forms and inputs)**
```
Generate 500 unique HTML easy level questions about HTML forms, 
input types, and form validation. CSV format with multiple choice questions.
```

**Batch 5-6 (Semantic HTML)**
```
Generate 500 unique HTML easy level questions about semantic HTML5 elements, 
accessibility, and best practices. CSV format with multiple choice questions.
```

**Batch 7-8 (Tables and lists)**
```
Generate 500 unique HTML easy level questions about HTML tables, 
lists, and data organization. CSV format with multiple choice questions.
```

**Batch 9-10 (Media and links)**
```
Generate 500 unique HTML easy level questions about images, videos, 
audio, and hyperlinks. CSV format with multiple choice questions.
```

### Quality Tips
1. **Review before merging**: Check the generated questions for quality
2. **Vary topics**: Use different prompts for each batch to avoid similar questions
3. **Check duplicates**: The script will show you how many duplicates were found
4. **Keep backups**: Don't delete backup files until you're sure everything is correct

## Progress Tracking

Create a log file to track your progress:

```
Batch 1: new_batch_1.csv (500 generated, 450 added) - Total: 775
Batch 2: new_batch_2.csv (500 generated, 420 added) - Total: 1195
Batch 3: new_batch_3.csv (500 generated, 380 added) - Total: 1575
Batch 4: new_batch_4.csv (500 generated, 410 added) - Total: 1985
Batch 5: new_batch_5.csv (500 generated, 390 added) - Total: 2375
Batch 6: new_batch_6.csv (500 generated, 400 added) - Total: 2775
Batch 7: new_batch_7.csv (500 generated, 385 added) - Total: 3160
Batch 8: new_batch_8.csv (500 generated, 395 added) - Total: 3555
Batch 9: new_batch_9.csv (500 generated, 405 added) - Total: 3960
Batch 10: new_batch_10.csv (500 generated, 410 added) - Total: 4370
Batch 11: new_batch_11.csv (500 generated, 420 added) - Total: 4790
Batch 12: new_batch_12.csv (500 generated, 210 added) - Total: 5000 ✅
```

## Troubleshooting

### "File not found"
Make sure file paths are correct:
```bash
# Use full path
npx tsx scripts/merge-and-deduplicate.ts C:\path\to\master.csv C:\path\to\new.csv

# Or relative path from project root
npx tsx scripts/merge-and-deduplicate.ts client/dist/assets/master.csv new_batch.csv
```

### "Too many duplicates"
This is normal! As you add more questions, duplicate rate increases:
- Batch 1-3: ~10% duplicates
- Batch 4-6: ~20% duplicates
- Batch 7-10: ~30-40% duplicates
- Batch 11+: ~50%+ duplicates

Solution: Generate more questions per batch or use more specific prompts.

### "CSV format error"
Make sure your CSV has the correct format:
```csv
skill,level,type,question,option_a,option_b,option_c,option_d,correct_answer,explanation
HTML,BASIC,Multiple Choice,Question text?,Option A,Option B,Option C,Option D,Option A,Explanation
```

## Final Steps

Once you have 5000 questions:

1. **Verify count**:
   ```bash
   # Count lines (should be 5001 including header)
   ```

2. **Upload to Supabase**:
   ```bash
   npx tsx scripts/upload-csv-to-supabase.ts client/dist/assets/html_easy_questions_unique.csv
   ```

3. **Verify in database**:
   ```sql
   SELECT COUNT(*) FROM questions WHERE skill='html' AND level='easy';
   -- Should return 5000
   ```

## Summary

✅ **Easy workflow**: Generate → Paste → Merge → Repeat
✅ **Automatic deduplication**: No manual checking needed
✅ **Safe**: Automatic backups before every merge
✅ **Progress tracking**: See exactly how many questions added
✅ **Scalable**: Works for any number of questions

Now you can easily build your 5000 question database! 🎉
