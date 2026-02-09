# Setup Practice Questions Database - Complete Guide

## Overview
This guide will help you create a new "Practice Questions" database in Supabase and upload all questions from your CSV files with multimedia support.

## Database Features
- ✅ Support for all three difficulty levels (beginner, intermediate, advanced)
- ✅ Multiple question types (MCQ, Fill in the Blank, Code, True/False)
- ✅ Multimedia learning resources (MDN links, YouTube videos in 5 languages)
- ✅ Row Level Security (RLS) enabled
- ✅ Optimized indexes for fast queries
- ✅ Automatic timestamps

## CSV Format Supported
```csv
skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu
```

## Step-by-Step Setup

### Step 1: Create the Database Table
1. Open your Supabase dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `create-practice-questions-database.sql`
4. Click "Run" to execute

This will create:
- `practice_questions` table with all columns
- Indexes for performance
- RLS policies for security
- Triggers for auto-updating timestamps
- A statistics view

### Step 2: Verify Your Environment
Make sure your `.env` file has:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Step 3: Upload All Questions
Run the batch file:
```bash
UPLOAD_ALL_PRACTICE_QUESTIONS.bat
```

This will:
1. Install required dependencies (csv-parse)
2. Compile the TypeScript upload script
3. Upload all CSV files from the `questions/` folder
4. Show progress for each file
5. Display a summary at the end

### Step 4: Verify Upload
Run this SQL query in Supabase:
```sql
-- Check total questions uploaded
SELECT COUNT(*) as total_questions FROM practice_questions;

-- Check breakdown by skill and level
SELECT 
    skill,
    level,
    COUNT(*) as question_count
FROM practice_questions
GROUP BY skill, level
ORDER BY skill, level;

-- Check questions with multimedia resources
SELECT 
    COUNT(*) as total,
    COUNT(mdn_link) as with_mdn,
    COUNT(youtube_english) as with_english_video,
    COUNT(youtube_hindi) as with_hindi_video
FROM practice_questions;
```

## What Gets Uploaded

### Skills Covered (33 technologies × 3 levels = 99 files)
- Frontend: HTML, CSS, JavaScript, TypeScript, React, Vue, Angular
- Backend: Node.js, Python, Java, Go, PHP, Ruby, C#, C++
- Databases: MongoDB, PostgreSQL, Oracle, Redis, SQL
- DevOps: Docker, Kubernetes, Ansible, Terraform, Git
- Cloud: AWS, Azure, GCP
- Mobile: Flutter, React Native, Swift, Kotlin
- Testing: Jest, Cypress, Selenium
- Graphics: OpenGL, GLSL, Unity, Unreal
- Tools: VSCode, DevTools, Webpack

### Difficulty Levels
- **Beginner**: Fundamental concepts, basic syntax
- **Intermediate**: Practical applications, common patterns
- **Advanced**: Complex scenarios, optimization, best practices

## Database Schema

### Main Columns
- `id`: UUID primary key
- `skill`: Technology/topic name
- `level`: beginner/intermediate/advanced
- `type`: mcq/fillblank/code/truefalse
- `question_text`: The question
- `option_a/b/c/d`: Multiple choice options
- `correct_answer`: The correct answer
- `explanation`: Detailed explanation

### Multimedia Columns
- `mdn_link`: MDN documentation link
- `youtube_english`: English tutorial video
- `youtube_hindi`: Hindi tutorial video
- `youtube_kannada`: Kannada tutorial video
- `youtube_tamil`: Tamil tutorial video
- `youtube_telugu`: Telugu tutorial video

### Metadata
- `topic`: Main topic category
- `subtopic`: Specific subtopic
- `difficulty_score`: 1-10 rating
- `points`: Points awarded
- `time_limit`: Seconds to answer
- `tags`: Array of tags
- `is_active`: Enable/disable questions

## Querying Examples

### Get questions for a specific skill and level
```sql
SELECT * FROM practice_questions
WHERE skill = 'javascript' 
  AND level = 'beginner'
  AND is_active = true
ORDER BY RANDOM()
LIMIT 10;
```

### Get questions with video resources
```sql
SELECT 
    skill,
    level,
    question_text,
    youtube_english,
    youtube_hindi
FROM practice_questions
WHERE youtube_english IS NOT NULL
  AND skill = 'react';
```

### Get statistics
```sql
SELECT * FROM practice_questions_stats
ORDER BY skill, level;
```

## Troubleshooting

### Issue: Upload fails with "relation does not exist"
**Solution**: Run `create-practice-questions-database.sql` first

### Issue: Permission denied errors
**Solution**: Check your Supabase keys in `.env` file

### Issue: Duplicate questions
**Solution**: The table has no unique constraints, so duplicates are allowed. To remove:
```sql
DELETE FROM practice_questions a
USING practice_questions b
WHERE a.id > b.id
  AND a.question_text = b.question_text
  AND a.skill = b.skill
  AND a.level = b.level;
```

### Issue: CSV parsing errors
**Solution**: Ensure CSV files are UTF-8 encoded and properly formatted

## Next Steps

After uploading:
1. ✅ Verify data in Supabase dashboard
2. ✅ Test queries in SQL Editor
3. ✅ Update your frontend to use `practice_questions` table
4. ✅ Add multimedia player components for video links
5. ✅ Implement language selection for videos

## Files Created
- `create-practice-questions-database.sql` - Database schema
- `scripts/upload-all-questions.ts` - Upload script
- `UPLOAD_ALL_PRACTICE_QUESTIONS.bat` - Easy run batch file
- `verify-practice-questions.sql` - Verification queries

## Support
If you encounter issues:
1. Check Supabase logs in dashboard
2. Verify CSV file format matches template
3. Ensure all dependencies are installed
4. Check console output for specific errors
