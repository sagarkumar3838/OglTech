# Upload Java Beginner Questions - Simple Steps

## Current Status
- Java Basic count: 0 (no questions uploaded yet)
- CSV file ready: `questions/java-beginner.csv` (102 questions)
- Issue: CSV has 3 formatting errors that need fixing

## Option 1: Fix CSV Then Upload via Supabase UI (EASIEST)

### Step 1: Fix the CSV
Run from project root:
```
cd scripts
npx tsx fix-java-csv-simple.ts
cd ..
```

This creates a backup and fixes the 3 formatting issues.

### Step 2: Upload via Supabase
1. Go to Supabase Dashboard → Table Editor
2. Select `practice_questions` table
3. Click "Insert" → "Import data from CSV"
4. Select the fixed `questions/java-beginner.csv`
5. Map columns (should auto-detect)
6. Click "Import"

Should show: "102 rows will be added" with NO issues ✓

## Option 2: Upload via Script

Run from project root:
```
npx tsx scripts/upload-java-beginner-fresh.ts
```

This will:
1. Delete any existing Java Basic questions
2. Upload all 102 questions from CSV
3. Show progress

## Option 3: Manual SQL Upload (10 questions only)

If you just want to test quickly, run this SQL:
```sql
-- This uploads only the first 10 questions from your earlier SQL file
-- File: UPLOAD_JAVA_BEGINNER_CORRECT.sql
```

## Verify Upload

After uploading, run this SQL:
```sql
SELECT COUNT(*) FROM practice_questions WHERE skill = 'Java' AND level = 'Basic';
```

Expected result: **102** (or 10 if you used Option 3)

## Why Count is 0

You created the CSV file but never uploaded it to the database. The CSV exists locally in your `questions/` folder, but Supabase doesn't have the data yet.

## Quick Test

To see what's currently in your database:
```sql
SELECT skill, level, COUNT(*) 
FROM practice_questions 
WHERE skill ILIKE '%java%'
GROUP BY skill, level;
```

This will show you all Java questions currently in the database (probably showing Intermediate and Advanced, but not Basic).

## Next Steps

1. Choose one of the 3 options above
2. Upload the Java beginner questions
3. Verify count = 102
4. Test in Practice page (select Java → Beginner)
5. Should see 10 random questions from the 102 uploaded
