# Upload JSON Questions to Supabase - Complete Guide

## 🎯 Overview

This guide shows you how to upload questions from a JSON file to your Supabase database.

## 📋 JSON Format Required

Your JSON file must follow this structure:

```json
{
  "SkillName": {
    "LEVEL": [
      {
        "type": "mcq",
        "question": "Question text here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct_answer": "Option A",
        "explanation": "Why this is correct"
      }
    ]
  }
}
```

### Required Fields:
- `type` - Question type (mcq, multi_select, coding, fill_blank, matching)
- `question` - The question text
- `correct_answer` - The correct answer

### Optional Fields:
- `options` - Array of options (for MCQ)
- `explanation` - Explanation of the answer
- `code_snippet` - Code example
- `test_cases` - Test cases for coding questions

### Valid Levels:
- `BASIC`
- `INTERMEDIATE`
- `ADVANCED`

### Valid Skills:
- HTML
- CSS
- JavaScript
- TypeScript
- React
- Node.js
- Python
- Java
- Testing Tools
- Docker
- Kubernetes
- Cloud Platforms
- jQuery
- OGL Knowledge

## 🚀 Method 1: Using Upload Script (Recommended)

### Step 1: Prepare Your JSON File

Create a file called `my-questions.json` with your questions:

```json
{
  "JavaScript": {
    "BASIC": [
      {
        "type": "mcq",
        "question": "What is JavaScript?",
        "options": ["A programming language", "A coffee brand", "A database", "A framework"],
        "correct_answer": "A programming language",
        "explanation": "JavaScript is a programming language used for web development."
      }
    ]
  }
}
```

### Step 2: Run the Upload Script

```bash
npx tsx scripts/upload-json-to-supabase.ts my-questions.json
```

### Step 3: Verify Upload

Go to Supabase Table Editor:
```
https://supabase.com/dashboard/project/ksjgsgebjnpwyycnptom/editor/17524
```

You should see your questions in the `questions` table!

## 📝 Method 2: Manual Upload via Supabase UI

### Step 1: Convert JSON to CSV

If you prefer, you can convert your JSON to CSV format.

### Step 2: Use Supabase Table Editor

1. Go to: https://supabase.com/dashboard/project/ksjgsgebjnpwyycnptom/editor/17524
2. Click "Insert" → "Insert row"
3. Fill in the fields manually

**Note:** This is tedious for many questions. Use Method 1 instead!

## 🔧 Method 3: Using SQL (For Large Batches)

### Step 1: Convert JSON to SQL

Use the script to generate SQL:

```bash
npx tsx scripts/json-to-sql.ts my-questions.json > questions.sql
```

### Step 2: Run SQL in Supabase

1. Go to: https://supabase.com/dashboard/project/ksjgsgebjnpwyycnptom/sql/new
2. Paste the generated SQL
3. Click "Run"

## 📊 Example: Complete JSON File

See `sample-questions.json` for a complete example with multiple skills and levels.

```json
{
  "HTML": {
    "BASIC": [...],
    "INTERMEDIATE": [...],
    "ADVANCED": [...]
  },
  "CSS": {
    "BASIC": [...],
    "INTERMEDIATE": [...],
    "ADVANCED": [...]
  },
  "JavaScript": {
    "BASIC": [...],
    "INTERMEDIATE": [...],
    "ADVANCED": [...]
  }
}
```

## ✅ Validation Checklist

Before uploading, ensure:

- [ ] JSON is valid (use jsonlint.com)
- [ ] All required fields present
- [ ] Skill names match exactly (case-sensitive)
- [ ] Levels are BASIC, INTERMEDIATE, or ADVANCED
- [ ] Question types are valid (mcq, multi_select, etc.)
- [ ] Options array exists for MCQ questions
- [ ] Correct answers match one of the options

## 🎨 Question Types

### 1. Multiple Choice (MCQ)

```json
{
  "type": "mcq",
  "question": "What is React?",
  "options": ["A library", "A framework", "A language", "A database"],
  "correct_answer": "A library",
  "explanation": "React is a JavaScript library for building user interfaces."
}
```

### 2. Multi-Select (Coming Soon)

```json
{
  "type": "multi_select",
  "question": "Which are JavaScript frameworks?",
  "options": ["React", "Angular", "Vue", "Python"],
  "correct_answer": ["React", "Angular", "Vue"],
  "explanation": "React, Angular, and Vue are JavaScript frameworks."
}
```

### 3. Coding Question (Coming Soon)

```json
{
  "type": "coding",
  "question": "Write a function to reverse a string",
  "code_snippet": "function reverseString(str) {\n  // Your code here\n}",
  "test_cases": [
    {"input": "hello", "expected": "olleh"},
    {"input": "world", "expected": "dlrow"}
  ],
  "correct_answer": "function reverseString(str) { return str.split('').reverse().join(''); }",
  "explanation": "Use split, reverse, and join methods."
}
```

## 🔍 Troubleshooting

### Error: "Invalid JSON"
- Check JSON syntax at jsonlint.com
- Ensure all quotes are double quotes (")
- Check for trailing commas

### Error: "Skill not found"
- Skill names are case-sensitive
- Use exact names from the list above
- Check for typos

### Error: "Invalid level"
- Must be BASIC, INTERMEDIATE, or ADVANCED
- All uppercase
- No spaces

### Error: "Row Level Security policy violation"
- You need to be authenticated
- Check your Supabase anon key
- Verify RLS policies are set up

### Questions not appearing
- Check Supabase Table Editor
- Verify `verified` field is true
- Check skill and level match exactly

## 📈 Best Practices

### 1. Organize by Skill
Keep questions for each skill in separate files:
- `html-questions.json`
- `css-questions.json`
- `javascript-questions.json`

### 2. Use Meaningful IDs
The script auto-generates IDs, but you can add your own:
```json
{
  "question_id": "js-basic-001",
  "type": "mcq",
  ...
}
```

### 3. Add Good Explanations
Always include explanations to help users learn:
```json
{
  "explanation": "Detailed explanation of why this is correct and why others are wrong."
}
```

### 4. Test Questions First
Upload a small batch first to test:
```bash
# Upload just 5 questions to test
npx tsx scripts/upload-json-to-supabase.ts test-questions.json
```

### 5. Backup Before Upload
Keep a backup of your JSON files:
```bash
cp my-questions.json my-questions-backup.json
```

## 🎯 Quick Start Example

### 1. Create your JSON file

```bash
# Create a new file
notepad my-questions.json
```

### 2. Add questions

```json
{
  "JavaScript": {
    "BASIC": [
      {
        "type": "mcq",
        "question": "What is a variable?",
        "options": ["A container for data", "A function", "A loop", "A class"],
        "correct_answer": "A container for data",
        "explanation": "Variables store data values."
      }
    ]
  }
}
```

### 3. Upload

```bash
npx tsx scripts/upload-json-to-supabase.ts my-questions.json
```

### 4. Verify

Check Supabase Table Editor - you should see your question!

## 📊 Bulk Upload Tips

### For 100+ Questions

1. **Split into batches**: Upload 50 questions at a time
2. **Use delays**: Script has built-in delays to avoid rate limits
3. **Monitor progress**: Watch console output for errors
4. **Verify each batch**: Check Supabase after each upload

### For 1000+ Questions

1. **Use SQL method**: Faster for large batches
2. **Generate SQL file**: Convert JSON to SQL first
3. **Run in Supabase**: Execute SQL in one go
4. **Verify count**: Check total count matches

```sql
SELECT COUNT(*) FROM questions;
```

## 🔐 Security Notes

- ✅ Script uses anon key (safe for client-side)
- ✅ RLS policies protect data
- ✅ Only authenticated users can insert
- ✅ Questions are marked as verified

## 📞 Need Help?

### Common Issues

**Q: Can I upload questions for new skills?**
A: Yes! Just use the skill name in your JSON. The system will accept any skill name.

**Q: How many questions can I upload at once?**
A: Recommended: 50-100 per batch. Maximum: No limit, but use batches for reliability.

**Q: Can I update existing questions?**
A: Yes! Use the same question_id to update, or delete and re-upload.

**Q: What if upload fails midway?**
A: The script continues from where it failed. Already uploaded questions won't be duplicated.

## ✅ Summary

1. ✅ Create JSON file with your questions
2. ✅ Follow the required format
3. ✅ Run upload script
4. ✅ Verify in Supabase
5. ✅ Questions are ready to use!

---

**Your questions are now in Supabase and ready for evaluations!** 🎉
