# CSV Upload Guide - 25,000 Questions

## 🎯 Goal
Upload 25,000 questions for 8 OGL careers using CSV format.

---

## 📋 Step-by-Step Process

### Step 1: Install Dependencies

```bash
npm install papaparse
npm install --save-dev @types/papaparse
```

### Step 2: Generate Questions with ChatGPT

Use the prompts from `CHATGPT_PROMPTS_FOR_QUESTIONS.md`:

1. Open ChatGPT
2. Copy prompt for "OGL Developer - BASIC - Batch 1"
3. Paste and get 100 questions in CSV format
4. Save as `ogl-developer-basic-1.csv`
5. Repeat 10 times for 1,000+ questions
6. Repeat for INTERMEDIATE and ADVANCED
7. Repeat for all 8 careers

### Step 3: Combine CSV Files

```bash
# Windows (PowerShell)
Get-Content *.csv | Set-Content all-questions.csv

# Or manually combine in Excel/Google Sheets
```

### Step 4: Validate CSV Format

Your CSV must have these columns:
```
skill,level,type,question,option_a,option_b,option_c,option_d,correct_answer,explanation
```

Example row:
```
HTML,BASIC,mcq,What does HTML stand for?,Hyper Text Markup Language,High Tech Modern Language,Home Tool Markup Language,Hyperlinks and Text Markup Language,Hyper Text Markup Language,HTML stands for Hyper Text Markup Language.
```

### Step 5: Upload to Supabase

```bash
npx tsx scripts/upload-csv-to-supabase.ts all-questions-25000.csv
```

**Output:**
```
🚀 Starting CSV to Supabase Upload
📊 Found 25000 questions in CSV

📦 Processing batch 1/250 (100 questions)
  ✅ Uploaded 100 questions
  📊 Progress: 0% (100/25000)

📦 Processing batch 2/250 (100 questions)
  ✅ Uploaded 100 questions
  📊 Progress: 1% (200/25000)

...

✅ Upload Complete!
   Total uploaded: 25000
   Total skipped: 0
   Success rate: 100%
```

---

## 📊 CSV Template

See `questions-template.csv` for the exact format.

**Required Columns:**
- `skill` - Skill name (HTML, CSS, JavaScript, etc.)
- `level` - BASIC, INTERMEDIATE, or ADVANCED
- `type` - Question type (mcq, multi_select, coding, etc.)
- `question` - The question text
- `option_a` - First option
- `option_b` - Second option
- `option_c` - Third option
- `option_d` - Fourth option
- `correct_answer` - Must match one of the options exactly
- `explanation` - Explanation of the answer

---

## 🎯 Generation Strategy

### Batch Approach (Recommended)

**For each career:**
1. Generate 100 questions at a time
2. Save each batch as separate CSV
3. Review and validate
4. Combine all batches
5. Upload combined file

**Benefits:**
- ✅ Easier to manage
- ✅ Can review in smaller chunks
- ✅ Can fix errors before uploading all
- ✅ Progress tracking

### Time Estimate

- **Generate 100 questions:** ~5 minutes with ChatGPT
- **Review and save:** ~2 minutes
- **Total per batch:** ~7 minutes
- **Total batches needed:** 250 batches (25,000 ÷ 100)
- **Total time:** ~29 hours of ChatGPT interaction

**Optimization:**
- Use multiple ChatGPT sessions in parallel
- Use ChatGPT Plus for faster responses
- Prepare prompts in advance
- Use templates to speed up

---

## 🚀 Quick Commands

```bash
# Install dependencies
npm install papaparse @types/papaparse

# Upload CSV
npx tsx scripts/upload-csv-to-supabase.ts questions.csv

# Check upload progress in Supabase
# Go to: https://supabase.com/dashboard/project/ksjgsgebjnpwyycnptom/editor/17524

# Count questions in database
# Run in Supabase SQL Editor:
SELECT skill, level, COUNT(*) as count 
FROM questions 
GROUP BY skill, level 
ORDER BY skill, level;
```

---

## 📈 Progress Tracking

Create a spreadsheet to track your progress:

| Career | Level | Batch | Questions | Generated | Reviewed | Uploaded |
|--------|-------|-------|-----------|-----------|----------|----------|
| OGL Developer | BASIC | 1 | 100 | ✅ | ✅ | ✅ |
| OGL Developer | BASIC | 2 | 100 | ✅ | ✅ | ⏳ |
| OGL Developer | BASIC | 3 | 100 | ✅ | ⏳ | ⏳ |

---

## 🔍 Validation Checklist

Before uploading, verify:

- [ ] CSV has correct headers
- [ ] All rows have all columns
- [ ] No empty cells
- [ ] Skill names are correct
- [ ] Levels are BASIC, INTERMEDIATE, or ADVANCED
- [ ] correct_answer matches one of the options
- [ ] No duplicate questions
- [ ] Explanations are clear

---

## 🛠️ Troubleshooting

### Error: "Invalid CSV format"
- Check that headers match exactly
- Ensure no extra commas in text
- Use quotes around text with commas

### Error: "correct_answer doesn't match options"
- Verify correct_answer is exactly the same as one option
- Check for extra spaces
- Check capitalization

### Error: "Upload timeout"
- Reduce batch size in script (change BATCH_SIZE to 50)
- Upload in smaller files (5,000 questions at a time)

### Questions not appearing
- Check Supabase Table Editor
- Verify RLS policies allow inserts
- Check for error messages in console

---

## 💡 Pro Tips

1. **Start small:** Generate and upload 100 questions first to test
2. **Use templates:** Create question templates for consistency
3. **Batch review:** Review 500 questions at a time
4. **Backup:** Keep all CSV files as backup
5. **Version control:** Name files with dates (questions-2024-01-22.csv)

---

## 📊 Expected Results

After uploading 25,000 questions:

```sql
-- Check total count
SELECT COUNT(*) FROM questions;
-- Result: 25000

-- Check distribution by career
SELECT skill, COUNT(*) as count 
FROM questions 
GROUP BY skill;
-- Each skill should have ~3,126 questions

-- Check distribution by level
SELECT level, COUNT(*) as count 
FROM questions 
GROUP BY level;
-- Each level should have ~8,336 questions
```

---

## 🎉 Success Criteria

- ✅ 25,000 questions uploaded
- ✅ All 8 careers covered
- ✅ All 3 levels covered
- ✅ Questions are unique
- ✅ All questions have explanations
- ✅ CSV format is correct
- ✅ Database queries work

---

## 📞 Next Steps After Upload

1. **Verify in Supabase:** Check table editor
2. **Test API:** Generate questions via API
3. **Test frontend:** Start an evaluation
4. **Monitor usage:** Track which questions are used
5. **Add more:** Generate additional questions as needed

---

**You're ready to generate and upload 25,000 questions!** 🚀
