# Upload ALL Questions at Once - Quick Guide

## Method 1: Use the Batch File (Easiest)

Just double-click: **UPLOAD_ALL_QUESTIONS_NOW.bat**

This will:
1. Install dependencies
2. Upload ALL CSV files from `questions/` folder to `practice_questions` table
3. Show progress for each file

## Method 2: Manual Command

```bash
cd scripts
npm install
npx ts-node upload-all-questions.ts
```

## What Gets Uploaded

ALL 135+ CSV files including:
- All beginner files (35 files)
- All intermediate files (35 files)  
- All advanced files (35 files)
- Plus any extras (vue, vscode, webpack, etc.)

## Requirements

Your `.env` file must have:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get the service role key from:
Supabase Dashboard → Settings → API → service_role key (secret)

## After Upload

1. The script uploads to `practice_questions` table
2. Then run `CHECK_AND_FIX_QUESTIONS.sql` to copy to `questions` table
3. This maps levels correctly (Basic→easy, Intermediate→medium, Advanced→hard)

## Expected Output

```
🚀 Starting upload of all practice questions...

📁 Found 135 CSV files

📄 Processing: angular-beginner.csv
✅ Uploaded 100/100 questions from angular-beginner.csv

📄 Processing: angular-intermediate.csv
✅ Uploaded 100/100 questions from angular-intermediate.csv

... (continues for all files)

📊 UPLOAD SUMMARY
Total files processed: 135
Total questions uploaded: 13,500
✅ Upload complete!
```

## Troubleshooting

**Error: Missing Supabase credentials**
- Check your `.env` file has the correct keys
- Make sure you're using SUPABASE_SERVICE_ROLE_KEY (not ANON key)

**Error: Duplicate key value**
- Some questions already exist
- The script will skip duplicates and continue

**Error: Column does not exist**
- Make sure `practice_questions` table has all columns
- Run `create-practice-questions-database-v2.sql` first

## Time Estimate

- Upload: 5-10 minutes for all 135 files
- Copy to questions table: 1-2 minutes

Total: ~10 minutes to have all questions working!
