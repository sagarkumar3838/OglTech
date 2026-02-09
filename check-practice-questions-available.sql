-- Quick check: Do we have MCQ questions for Practice page?

-- 1. Count total questions in questions table
SELECT 
  'Total MCQ Questions' as info,
  COUNT(*) as count
FROM questions;

-- 2. Questions by skill and level
SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM questions
GROUP BY skill, level
ORDER BY skill, level;

-- 3. Sample question to verify format
SELECT 
  id,
  skill,
  level,
  question_text,
  options,
  correct_answer,
  explanation
FROM questions
LIMIT 1;

-- 4. Check if we have at least 10 questions for popular skills
SELECT 
  skill,
  level,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) >= 10 THEN '✅ Ready for Practice'
    WHEN COUNT(*) > 0 THEN '⚠️ Less than 10 questions'
    ELSE '❌ No questions'
  END as status
FROM questions
WHERE skill IN ('javascript', 'html', 'css', 'python', 'java', 'react')
GROUP BY skill, level
ORDER BY skill, level;

-- 5. If no questions, check practice_questions table
SELECT 
  'practice_questions table (descriptive format)' as info,
  COUNT(*) as count
FROM practice_questions;
