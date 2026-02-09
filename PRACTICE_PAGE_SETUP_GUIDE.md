# Practice Page Setup Guide

## Current Status

The Practice page has been updated to show MCQ questions with:
- ✅ 10 questions per test at each level
- ✅ Voice input support (say "A", "B", "Option 1", "First", etc.)
- ✅ Marks display after submission
- ✅ Personalized learning recommendations based on score
- ✅ Job role recommendations
- ✅ Multimedia learning resources (MDN docs, YouTube videos in 5 languages)

## Important: Questions Table Format

The Practice page now uses the `questions` table which expects MCQ format:

```sql
{
  "id": 1,
  "skill": "javascript",
  "level": "beginner",
  "question_text": "What is JavaScript?",
  "options": {
    "a": "A programming language",
    "b": "A markup language",
    "c": "A database",
    "d": "An operating system"
  },
  "correct_answer": "a",
  "explanation": "JavaScript is a programming language...",
  "topic": "Basics",
  "mdn_link": "https://developer.mozilla.org/...",
  "youtube_english": "https://youtube.com/...",
  "youtube_hindi": "https://youtube.com/...",
  "youtube_kannada": "https://youtube.com/...",
  "youtube_tamil": "https://youtube.com/...",
  "youtube_telugu": "https://youtube.com/..."
}
```

## Check Current Questions

Run this SQL to check if you have questions:

```sql
-- Check questions count by skill and level
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM questions
GROUP BY skill, level
ORDER BY skill, level;
```

## If No Questions Available

You have two options:

### Option 1: Use Existing Questions (if available)
If you already have questions in the `questions` table, just refresh the browser at http://localhost:3000/practice

### Option 2: Add MCQ Questions
You need to add MCQ format questions to the `questions` table. You can:

1. **Convert practice_questions to MCQ format** (if you want to use those 2,670 questions)
2. **Upload new MCQ questions** using CSV files with proper format
3. **Manually add questions** through SQL inserts

## Note About practice_questions Table

The `practice_questions` table (2,670 questions) has a different format:
- `option_a`, `option_b`, `option_c`, `option_d` are CATEGORIES, not MCQ options
- These are descriptive questions, not multiple choice
- They cannot be used directly for the Practice page MCQ format

## Next Steps

1. Run `check-old-questions-table.sql` to see what's in your questions table
2. If empty, decide which option above to use
3. Refresh browser at http://localhost:3000/practice
4. Test with any skill/level combination that has questions

## Testing the Practice Page

1. Go to http://localhost:3000/practice
2. Select a skill (e.g., JavaScript)
3. Select a level (e.g., Beginner)
4. Answer 10 MCQ questions
5. Click "Submit Test"
6. See your score, recommendations, and learning resources

## Voice Input Usage

Users can answer by:
- Clicking the option button
- Using the microphone and saying:
  - "A", "B", "C", "D"
  - "Option A", "Option B"
  - "1", "2", "3", "4"
  - "First", "Second", "Third", "Fourth"
  - Part of the answer text (e.g., "programming language")
