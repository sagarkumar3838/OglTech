# 🚀 Deploy All CSV Files - Single Command Guide

## Quick Start - ONE COMMAND

### Option 1: Using Batch File (Windows)
```bash
DEPLOY_ALL_CSV.bat
```

### Option 2: Using NPM Command
```bash
npm run upload:all-csv
```

### Option 3: Direct Command
```bash
npx tsx scripts/upload-all-csv-no-duplicates.ts
```

---

## What This Does

✅ **Automatically uploads ALL CSV files** from the `questions/` folder  
✅ **Prevents duplicates** - checks before inserting each question  
✅ **Handles errors gracefully** - continues even if some questions fail  
✅ **Shows detailed progress** - file-by-file and question-by-question  
✅ **Provides summary report** - total inserted, skipped, and errors  

---

## Features

### 🔍 Duplicate Detection
- Checks if question already exists based on: `skill + level + question_text`
- Skips duplicates automatically
- No manual cleanup needed

### 📊 Progress Tracking
- Shows which file is being processed
- Displays count for each file
- Real-time status updates

### 🛡️ Error Handling
- Validates required fields
- Continues on errors
- Reports all issues at the end

### 📈 Summary Report
```
📊 UPLOAD SUMMARY
============================================================
📁 Files processed:     162
📝 Questions processed: 4860
✅ Successfully inserted: 3245
⏭️  Skipped (duplicates): 1580
❌ Errors:              35
============================================================
🎯 Total questions in database: 5420
```

---

## Prerequisites

1. **Environment Variables** - Make sure `.env` file has:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   ```

2. **Dependencies Installed**:
   ```bash
   npm install
   ```

3. **CSV Files** - Place all CSV files in `questions/` folder

---

## CSV File Format

Your CSV files should have these columns:
```csv
skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu
```

**Required columns:**
- `skill` - Technology name (e.g., "React", "Python", "Jest")
- `level` - Difficulty level (e.g., "Beginner", "Intermediate", "Advanced")
- `question_text` - The question
- `option_a`, `option_b`, `option_c`, `option_d` - Answer options
- `correct_answer` - Correct option (A, B, C, or D)
- `explanation` - Explanation of the answer

**Optional columns:**
- `mdn_link` - Link to documentation
- `youtube_english`, `youtube_hindi`, etc. - Video tutorial links

---

## Troubleshooting

### ❌ "Missing Supabase credentials"
**Solution:** Check your `.env` file has the correct Supabase URL and key

### ❌ "Questions directory not found"
**Solution:** Make sure you're running the command from the project root directory

### ❌ "Error inserting question"
**Possible causes:**
- Invalid data format
- Database constraint violation
- Network issues

**Solution:** Check the error message for specific details

### ⚠️ "Skipping invalid record"
**Cause:** Missing required fields (skill, level, or question_text)

**Solution:** Check your CSV file for empty required fields

---

## Advanced Usage

### Upload Specific Files Only
Modify the script to filter specific files:
```typescript
const csvFiles = fs.readdirSync(questionsDir)
  .filter(file => file.endsWith('.csv') && file.includes('react'));
```

### Change Batch Size
For large uploads, you can batch insert:
```typescript
// Insert in batches of 100
const batchSize = 100;
for (let i = 0; i < questions.length; i += batchSize) {
  const batch = questions.slice(i, i + batchSize);
  await supabase.from('practice_questions').insert(batch);
}
```

### Dry Run Mode
Add a flag to test without inserting:
```typescript
const DRY_RUN = true;
if (!DRY_RUN) {
  await supabase.from('practice_questions').insert([question]);
}
```

---

## File Structure

```
project-root/
├── questions/              # All CSV files here
│   ├── react-beginner.csv
│   ├── react-intermediate.csv
│   ├── python-advanced.csv
│   └── ...
├── scripts/
│   └── upload-all-csv-no-duplicates.ts  # Main script
├── DEPLOY_ALL_CSV.bat     # Windows batch file
├── .env                   # Supabase credentials
└── package.json           # NPM scripts
```

---

## Performance

- **Speed:** ~50-100 questions per minute (depends on network)
- **Memory:** Low memory footprint (processes one file at a time)
- **Network:** Uses Supabase REST API (efficient)

---

## Best Practices

1. ✅ **Test with small batch first** - Try with 1-2 CSV files
2. ✅ **Backup database** - Before large uploads
3. ✅ **Check CSV format** - Ensure all files follow the same structure
4. ✅ **Monitor progress** - Watch the console output
5. ✅ **Verify results** - Check the final count in Supabase dashboard

---

## Next Steps After Upload

1. **Verify in Supabase Dashboard:**
   - Go to Table Editor → `practice_questions`
   - Check the count matches the summary

2. **Test in Application:**
   - Navigate to Practice page
   - Select a skill and level
   - Verify questions load correctly

3. **Check for Issues:**
   ```sql
   -- Find questions with missing data
   SELECT * FROM practice_questions 
   WHERE option_a IS NULL OR option_b IS NULL;
   
   -- Count by skill and level
   SELECT skill, level, COUNT(*) 
   FROM practice_questions 
   GROUP BY skill, level 
   ORDER BY skill, level;
   ```

---

## Support

If you encounter issues:
1. Check the console output for specific error messages
2. Verify your CSV file format
3. Check Supabase connection
4. Review the troubleshooting section above

---

**That's it! One command to deploy all your questions. 🎉**
