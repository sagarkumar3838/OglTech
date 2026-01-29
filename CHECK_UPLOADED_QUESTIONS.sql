-- ============================================
-- SQL Queries to Check Uploaded Questions
-- ============================================

-- 1. TOTAL COUNT - How many questions in total?
-- ============================================
SELECT COUNT(*) as total_questions
FROM questions;


-- 2. COUNT BY SKILL - How many questions per skill?
-- ============================================
SELECT 
  skill,
  COUNT(*) as count
FROM questions
GROUP BY skill
ORDER BY skill;


-- 3. COUNT BY SKILL AND LEVEL - Breakdown by skill and difficulty
-- ============================================
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM questions
GROUP BY skill, level
ORDER BY skill, level;


-- 4. COUNT BY QUESTION TYPE - How many MCQ vs Fill in the Blank?
-- ============================================
SELECT 
  type,
  COUNT(*) as count
FROM questions
GROUP BY type
ORDER BY type;


-- 5. DETAILED BREAKDOWN - Skill, Level, and Type
-- ============================================
SELECT 
  skill,
  level,
  type,
  COUNT(*) as count
FROM questions
GROUP BY skill, level, type
ORDER BY skill, level, type;


-- 6. RECENT UPLOADS - Last 10 questions uploaded
-- ============================================
SELECT 
  question_id,
  skill,
  level,
  type,
  LEFT(question, 50) as question_preview,
  created_at
FROM questions
ORDER BY created_at DESC
LIMIT 10;


-- 7. SAMPLE QUESTIONS - View a few questions from each skill
-- ============================================
SELECT 
  skill,
  level,
  type,
  question,
  correct_answer
FROM questions
WHERE skill = 'HTML'
LIMIT 5;

-- Change 'HTML' to 'CSS', 'JavaScript', 'jQuery', or 'OGL' to see other skills


-- 8. CHECK FOR DUPLICATES - Find potential duplicate questions
-- ============================================
SELECT 
  skill,
  level,
  question,
  COUNT(*) as duplicate_count
FROM questions
GROUP BY skill, level, question
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;


-- 9. FILL IN THE BLANK QUESTIONS - View all fill-in-the-blank questions
-- ============================================
SELECT 
  skill,
  level,
  question,
  correct_answer,
  explanation
FROM questions
WHERE type = 'fill_blank'
ORDER BY skill, level
LIMIT 20;


-- 10. MCQ QUESTIONS - View sample MCQ questions with options
-- ============================================
SELECT 
  skill,
  level,
  question,
  options,
  correct_answer
FROM questions
WHERE type = 'mcq'
ORDER BY skill, level
LIMIT 10;


-- 11. QUESTIONS WITHOUT OPTIONS - Should only be fill_blank type
-- ============================================
SELECT 
  skill,
  level,
  type,
  question,
  options
FROM questions
WHERE options = '[]'::jsonb OR options IS NULL
LIMIT 10;


-- 12. SUMMARY REPORT - Complete overview
-- ============================================
SELECT 
  'Total Questions' as metric,
  COUNT(*)::text as value
FROM questions

UNION ALL

SELECT 
  'Total Skills' as metric,
  COUNT(DISTINCT skill)::text as value
FROM questions

UNION ALL

SELECT 
  'Total Levels' as metric,
  COUNT(DISTINCT level)::text as value
FROM questions

UNION ALL

SELECT 
  'MCQ Questions' as metric,
  COUNT(*)::text as value
FROM questions
WHERE type = 'mcq'

UNION ALL

SELECT 
  'Fill in the Blank Questions' as metric,
  COUNT(*)::text as value
FROM questions
WHERE type = 'fill_blank'

UNION ALL

SELECT 
  'Questions with Explanations' as metric,
  COUNT(*)::text as value
FROM questions
WHERE explanation IS NOT NULL AND explanation != '';


-- 13. VERIFY DATA QUALITY - Check for missing data
-- ============================================
SELECT 
  'Questions without skill' as issue,
  COUNT(*) as count
FROM questions
WHERE skill IS NULL OR skill = ''

UNION ALL

SELECT 
  'Questions without level' as issue,
  COUNT(*) as count
FROM questions
WHERE level IS NULL OR level = ''

UNION ALL

SELECT 
  'Questions without type' as issue,
  COUNT(*) as count
FROM questions
WHERE type IS NULL OR type = ''

UNION ALL

SELECT 
  'Questions without correct_answer' as issue,
  COUNT(*) as count
FROM questions
WHERE correct_answer IS NULL OR correct_answer::text = ''

UNION ALL

SELECT 
  'MCQ without options' as issue,
  COUNT(*) as count
FROM questions
WHERE type = 'mcq' AND (options = '[]'::jsonb OR options IS NULL);


-- 14. QUESTIONS BY CREATION DATE - When were questions uploaded?
-- ============================================
SELECT 
  DATE(created_at) as upload_date,
  COUNT(*) as questions_uploaded
FROM questions
GROUP BY DATE(created_at)
ORDER BY upload_date DESC;


-- 15. SEARCH SPECIFIC QUESTION - Find questions containing specific text
-- ============================================
SELECT 
  skill,
  level,
  type,
  question,
  correct_answer
FROM questions
WHERE question ILIKE '%HTML%'  -- Change search term here
LIMIT 10;
