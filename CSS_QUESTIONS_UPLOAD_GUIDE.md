# CSS Questions Upload Guide

## What the Script Does

The `transform-css-questions.ts` script will:

1. ✅ Read your CSV file: `client/dist/assets/css_easy_questions.csv`
2. ✅ Remove duplicate questions (based on question text)
3. ✅ Transform the format:
   - `"Multiple Choice"` → `"mcq"`
   - Generate unique `question_id` for each question
   - Convert options to JSON array: `[option_a, option_b, option_c, option_d]`
   - Keep `correct_answer` as text (matching one of the options)
4. ✅ Save transformed data to JSON for review
5. ✅ Upload to Supabase in batches of 50

## Issues Fixed

### 1. Type Format
- **Before**: `type = "Multiple Choice"`
- **After**: `type = "mcq"`

### 2. Question ID
- **Before**: Missing
- **After**: Generated as `css_basic_timestamp_index`

### 3. Options Format
- **Before**: Separate columns (option_a, option_b, option_c, option_d)
- **After**: JSON array `["option1", "option2", "option3", "option4"]`

### 4. Duplicates
- **Before**: ~110+ questions with many duplicates
- **After**: Only unique questions based on question text

## How to Run

### Option 1: Using Batch File (Easiest)
```bash
UPLOAD_CSS_QUESTIONS.bat
```

### Option 2: Using npm/npx
```bash
npx tsx scripts/transform-css-questions.ts
```

## What You'll See

```
📖 Reading CSV file: client/dist/assets/css_easy_questions.csv
📊 Found 110 rows in CSV
✨ After removing duplicates: 45 unique questions

💾 Saved transformed data to: client/dist/assets/css_easy_questions_transformed.json

⚠️  Ready to upload 45 questions to Supabase
   Press Ctrl+C to cancel, or wait 3 seconds to continue...

🚀 Uploading 45 questions to Supabase...
✅ Uploaded batch 1: 45 questions

📊 Upload Summary:
   ✅ Success: 45
   ❌ Errors: 0
   📝 Total: 45

✅ Done!
```

## Review Before Upload

The script saves a JSON file before uploading:
- **Location**: `client/dist/assets/css_easy_questions_transformed.json`
- **Purpose**: Review the transformed data before it goes to Supabase

## Verify Upload

After running the script, check your Supabase dashboard:

1. Go to Table Editor → `questions` table
2. Filter by `skill = 'CSS'` and `level = 'BASIC'`
3. You should see your questions with:
   - Unique `question_id`
   - `type = 'mcq'`
   - `options` as JSON array
   - `correct_answer` as text

## Troubleshooting

### Error: Missing Supabase credentials
Make sure your `.env` file has:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Error: CSV file not found
Check that the file exists at:
```
client/dist/assets/css_easy_questions.csv
```

### Error: Duplicate question_id
The script generates unique IDs using timestamps. If you run it twice quickly, you might get duplicates. Wait a few seconds between runs.

## Next Steps

After uploading CSS questions, you can:

1. Upload more question types (HTML, JavaScript, etc.)
2. Verify questions appear in your app
3. Test the evaluation flow with CSS questions
