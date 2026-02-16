# Fix and Upload All CSV Files - Step by Step Guide

## Problem Identified

Many CSV files have issues:
- Duplicate headers in the middle of files
- Missing data (0 questions)
- Incomplete rows (too few fields)
- Formatting issues

## Solution: Direct SQL Upload

Instead of fixing CSV files, we'll upload the good data directly to Supabase using SQL.

---

## Step-by-Step Instructions

### Step 1: Check Your Supabase Table

First, make sure your `practice_questions` table exists with the correct structure.

Run this SQL in Supabase SQL Editor:

```sql
-- Check if table exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'practice_questions';
```

If the table doesn't exist, create it:

```sql
CREATE TABLE IF NOT EXISTS practice_questions (
  id BIGSERIAL PRIMARY KEY,
  skill TEXT NOT NULL,
  level TEXT NOT NULL,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  topic TEXT,
  mdn_link TEXT,
  youtube_english TEXT,
  youtube_hindi TEXT,
  youtube_kannada TEXT,
  youtube_tamil TEXT,
  youtube_telugu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Step 2: Upload Files with Good Data

I'll create a script that will:
1. Read each CSV file
2. Skip files with 0 or very few questions
3. Clean the data
4. Upload directly to Supabase

### Step 3: Run the Upload Script

```bash
npx tsx scripts/upload-valid-questions-only.ts
```

This will:
- ✅ Skip empty files
- ✅ Remove duplicate headers
- ✅ Validate each row has 16 fields
- ✅ Upload only valid data
- ✅ Show progress for each file

### Step 4: Verify Upload

After upload, run this SQL:

```sql
-- Count total questions
SELECT COUNT(*) as total FROM practice_questions;

-- Count by skill
SELECT skill, COUNT(*) as count 
FROM practice_questions 
GROUP BY skill 
ORDER BY count DESC;

-- Count by level
SELECT level, COUNT(*) as count 
FROM practice_questions 
GROUP BY level;
```

---

## Files with Good Data (Will be uploaded)

Based on your breakdown, these files have questions:

- angular-advanced.csv: 138 questions ✅
- angular-intermediate.csv: 24 questions ✅
- ansible-advanced.csv: 2 questions ✅
- ansible-beginner.csv: 37 questions ✅
- ansible-intermediate.csv: 26 questions ✅
- aws-advanced.csv: 22 questions ✅
- aws-beginner.csv: 117 questions ✅
- aws-intermediate.csv: 95 questions ✅
- azure-advanced.csv: 105 questions ✅
- azure-beginner.csv: 93 questions ✅
- azure-intermediate.csv: 101 questions ✅
- cpp-advanced.csv: 107 questions ✅
- cpp-beginner.csv: 91 questions ✅
- cpp-intermediate.csv: 98 questions ✅
- csharp-advanced.csv: 104 questions ✅
- csharp-intermediate.csv: 102 questions ✅
- css-intermediate.csv: 100 questions ✅
- cypress-advanced.csv: 87 questions ✅
- cypress-beginner.csv: 67 questions ✅
- cypress-intermediate.csv: 115 questions ✅
- devtools-beginner-fixed.csv: 95 questions ✅
- docker-beginner.csv: 7 questions ✅
- flutter-advanced.csv: 108 questions ✅
- flutter-beginner.csv: 126 questions ✅
- flutter-intermediate.csv: 137 questions ✅
- gcp-advanced.csv: 117 questions ✅
- gcp-beginner.csv: 41 questions ✅
- gcp-intermediate.csv: 101 questions ✅
- git-beginner.csv: 115 questions ✅
- git-intermediate.csv: 107 questions ✅
- glsl-advanced.csv: 108 questions ✅
- glsl-beginner.csv: 161 questions ✅
- glsl-intermediate.csv: 119 questions ✅
- go-intermediate.csv: 56 questions ✅
- java-advanced.csv: 117 questions ✅
- java-beginner.csv: 119 questions ✅
- java-intermediate.csv: 44 questions ✅
- javascript-intermediate.csv: 11 questions ✅
- jest-intermediate.csv: 111 questions ✅
- kotlin-intermediate.csv: 9 questions ✅
- kubernetes-beginner.csv: 8 questions ✅
- kubernetes-intermediate.csv: 102 questions ✅
- linux-advanced.csv: 14 questions ✅
- linux-beginner.csv: 18 questions ✅
- linux-intermediate.csv: 20 questions ✅
- nodejs-intermediate.csv: 108 questions ✅
- opengl-advanced.csv: 19 questions ✅
- opengl-beginner.csv: 23 questions ✅
- opengl-intermediate.csv: 19 questions ✅
- php-intermediate.csv: 23 questions ✅
- postgresql-advanced.csv: 10 questions ✅
- postgresql-beginner.csv: 6 questions ✅
- postgresql-intermediate.csv: 43 questions ✅
- python-advanced.csv: 66 questions ✅
- python-intermediate.csv: 264 questions ✅
- react-advanced.csv: 60 questions ✅
- react-beginner.csv: 3 questions ✅
- react-intermediate.csv: 47 questions ✅
- reactnative-advanced.csv: 77 questions ✅
- reactnative-beginner.csv: 8 questions ✅
- reactnative-intermediate.csv: 66 questions ✅
- redis-advanced.csv: 91 questions ✅
- redis-beginner.csv: 5 questions ✅
- ruby-advanced.csv: 77 questions ✅
- ruby-intermediate.csv: 81 questions ✅
- rust-advanced.csv: 138 questions ✅
- rust-beginner.csv: 20 questions ✅
- rust-intermediate.csv: 50 questions ✅
- selenium-advanced.csv: 29 questions ✅
- sql-advanced.csv: 39 questions ✅
- sql-beginner.csv: 53 questions ✅
- swift-advanced.csv: 94 questions ✅
- swift-beginner.csv: 12 questions ✅
- swift-intermediate.csv: 29 questions ✅
- unity-advanced.csv: 45 questions ✅
- unity-beginner.csv: 32 questions ✅

**Total: ~5,500+ valid questions**

---

## Files with No Data (Will be skipped)

These files have 0 questions and will be skipped:
- angular-beginner.csv
- csharp-beginner.csv
- css-advanced.csv
- css-beginner.csv
- devtools-advanced.csv
- devtools-beginner.csv
- devtools-intermediate.csv
- docker-advanced.csv
- docker-intermediate.csv
- git-advanced.csv
- go-advanced.csv
- go-beginner.csv
- html-advanced.csv
- html-beginner.csv
- html-intermediate.csv
- javascript-advanced.csv
- javascript-beginner.csv
- jest-advanced.csv
- jest-beginner.csv
- kotlin-advanced.csv
- kotlin-beginner.csv
- kubernetes-advanced.csv
- mongodb-advanced.csv
- mongodb-beginner.csv
- mongodb-intermediate.csv
- nodejs-advanced.csv
- nodejs-beginner.csv
- oracle-advanced.csv
- oracle-beginner.csv
- oracle-intermediate.csv
- php-advanced.csv
- php-beginner.csv
- python-beginner.csv
- redis-intermediate.csv
- ruby-beginner.csv
- selenium-beginner.csv
- selenium-intermediate.csv
- sql-intermediate.csv
- terraform-advanced.csv
- terraform-beginner.csv
- terraform-intermediate.csv
- typescript-advanced.csv
- typescript-beginner.csv
- typescript-intermediate.csv
- unity-intermediate.csv
- unreal-advanced.csv
- unreal-beginner.csv
- unreal-intermediate.csv
- vscode-advanced.csv
- vscode-beginner.csv
- vscode-intermediate.csv
- vue-advanced.csv
- vue-beginner.csv
- vue-intermediate.csv
- webpack-advanced.csv
- webpack-beginner.csv
- webpack-intermediate.csv

---

## Next Steps

1. I'll create the upload script
2. You run it
3. Verify the data in Supabase
4. Done!

The script will handle all the complexity and upload only valid data.
