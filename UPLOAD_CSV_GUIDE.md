# CSV Upload Guide (No Duplicates)

## Quick Start

Upload new CSV files without creating duplicates in the database.

## Usage

### 1. Upload All CSV Files
```bash
UPLOAD_CSV_NO_DUPLICATES.bat
```
Uploads all CSV files from the `questions/` directory and skips any duplicates.

### 2. Upload Specific File
```bash
UPLOAD_CSV_NO_DUPLICATES.bat questions/react-advanced.csv
```

### 3. Upload Multiple Files
```bash
UPLOAD_CSV_NO_DUPLICATES.bat questions/react-beginner.csv questions/react-intermediate.csv questions/react-advanced.csv
```

## How It Works

1. **Reads CSV file** - Parses the CSV content
2. **Checks for duplicates** - Queries database for existing questions with same text, skill, and level
3. **Filters duplicates** - Removes questions that already exist
4. **Uploads new questions** - Only inserts questions that don't exist
5. **Reports results** - Shows uploaded, skipped, and error counts

## CSV File Format

Files must follow this naming convention:
```
{skill}-{level}.csv
```

Examples:
- `react-beginner.csv`
- `python-intermediate.csv`
- `kubernetes-advanced.csv`

### Required Columns

Your CSV must have these columns (in any order):

```csv
question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic
```

### Optional Columns

```csv
mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu
```

### Alternative Column Names

The script also supports these legacy column names:
- `Question` → `question_text`
- `Concept1` → `option_a`
- `Concept2` → `option_b`
- `Concept3` → `option_c`
- `Concept4` → `option_d`
- `AnswerType` → `correct_answer`
- `Answer` → `explanation`
- `Category` → `topic`
- `DocLink` → `mdn_link`
- `YoutubeSearchEN` → `youtube_english`
- `YoutubeSearchHindi` → `youtube_hindi`
- `YoutubeSearchKannada` → `youtube_kannada`
- `YoutubeSearchTamil` → `youtube_tamil`
- `YoutubeSearchTelugu` → `youtube_telugu`

## Example CSV

```csv
question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic
"What is React?","A library","A framework","A language","A database","A","React is a JavaScript library for building user interfaces","Basics"
"What is JSX?","JavaScript XML","Java Syntax","JSON Extension","JavaScript Extra","A","JSX is a syntax extension for JavaScript","JSX"
```

## Output Example

```
🚀 CSV Upload Tool (No Duplicates)

======================================================================
📁 Found 5 CSV files in questions directory

📄 react-beginner.csv
   Skill: react | Level: beginner
   📊 Found 100 questions in CSV
   ⏭️  Skipping 20 duplicate questions
   ⬆️  Uploading 80 new questions...
   ✅ Successfully uploaded 80 questions

❌ python-advanced.csv
   ERROR: Invalid filename format
   💡 Expected format: skill-level.csv
   💡 Examples: python-beginner.csv, react-advanced.csv

📄 javascript-intermediate.csv
   Skill: javascript | Level: intermediate
   📊 Found 100 questions in CSV
   ⚠️  Found 3 validation issue(s):
      - Row 15: Missing option_a
      - Row 42: Invalid correct_answer (must be A, B, C, or D)
      - Row 78: Missing question_text
   ⬆️  Uploading 100 new questions...
   ✅ Successfully uploaded 100 questions

📄 typescript-beginner.csv
   Skill: typescript | Level: beginner
   📊 Found 50 questions in CSV
   ❌ FILE ERROR: Unexpected token in JSON
   💡 CSV format issue. Check for:
      - Proper comma separation
      - Quotes around text with commas
      - Matching column count in all rows

📄 vue-advanced.csv
   Skill: vue | Level: advanced
   📊 Found 100 questions in CSV
   ℹ️  All questions already exist in database

======================================================================
📊 SUMMARY
======================================================================
✅ Uploaded:  180 new questions
⏭️  Skipped:   120 duplicates
❌ Errors:    2 failed
======================================================================

⚠️  FILES WITH ISSUES:
======================================================================
❌ python-advanced.csv
   Issue: Invalid filename format
❌ typescript-beginner.csv
   Issue: Upload failed - check file format and content
======================================================================

💡 Fix these files and run the command again.
```

## Duplicate Detection

The script checks for duplicates based on:
- **Skill name** (e.g., "react")
- **Level** (beginner, intermediate, advanced)
- **Question text** (exact match)

If a question with the same text already exists for that skill and level, it will be skipped.

## Troubleshooting

### Invalid filename format
- File must be named: `{skill}-{level}.csv`
- Level must be: beginner, intermediate, or advanced
- Examples: `react-beginner.csv`, `python-advanced.csv`

### No questions uploaded
- Check CSV file format
- Verify column names match expected format
- Ensure file has data rows (not just headers)

### Validation issues
The script checks for:
- Missing question_text
- Missing option_a or option_b
- Invalid correct_answer (must be A, B, C, or D)
- Empty required fields

### CSV format errors
Common issues:
- Text with commas not wrapped in quotes
- Inconsistent column count across rows
- Special characters not properly escaped
- File encoding (must be UTF-8)

### All questions skipped
- Questions already exist in database
- This is normal if you're re-uploading the same file

### Connection errors
- Check `.env` file has correct Supabase credentials:
  - `VITE_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY` or `VITE_SUPABASE_ANON_KEY`

## Environment Setup

Make sure your `.env` file contains:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Benefits

✅ **No duplicates** - Automatically skips existing questions
✅ **Safe** - Won't overwrite or delete existing data
✅ **Fast** - Batch uploads for better performance
✅ **Flexible** - Upload one file or all files at once
✅ **Informative** - Clear reporting of what was uploaded/skipped
✅ **Error detection** - Identifies file format and validation issues
✅ **Helpful messages** - Provides specific guidance for fixing problems
✅ **Supports multiple formats** - Works with different CSV column names

## Next Steps

After uploading, verify your questions:

```sql
-- Check total questions by skill and level
SELECT skill, level, COUNT(*) as total
FROM practice_questions
GROUP BY skill, level
ORDER BY skill, level;

-- Check recently added questions
SELECT skill, level, question_text, created_at
FROM practice_questions
ORDER BY created_at DESC
LIMIT 20;
```
