-- ============================================
-- COPY ALL QUESTIONS FROM practice_questions TO questions
-- ============================================
-- Your questions are in 'practice_questions' table
-- But the app looks in 'questions' table
-- This script copies everything over

-- ============================================
-- STEP 1: CHECK WHAT'S IN practice_questions
-- ============================================
-- See what skills you have
SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM practice_questions
GROUP BY skill, level
ORDER BY skill, level;

-- ============================================
-- STEP 2: CHECK practice_questions TABLE STRUCTURE
-- ============================================
-- See what columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'practice_questions'
ORDER BY ordinal_position;

-- ============================================
-- STEP 3: SAMPLE DATA FROM practice_questions
-- ============================================
-- See a few questions to understand the format
SELECT * FROM practice_questions LIMIT 3;

-- ============================================
-- STEP 4: COPY ALL QUESTIONS TO MAIN TABLE
-- ============================================
-- This copies ALL questions from practice_questions to questions
-- with proper format normalization

INSERT INTO questions (
  skill, 
  level, 
  type, 
  question, 
  options, 
  correct_answer, 
  explanation, 
  topic
)
SELECT 
  LOWER(TRIM(REPLACE(skill, ' ', ''))) as skill,  -- Normalize skill name
  CASE 
    WHEN level ILIKE 'beginner' THEN 'easy'
    WHEN level ILIKE 'intermediate' THEN 'medium'
    WHEN level ILIKE 'advanced' THEN 'hard'
    ELSE LOWER(TRIM(level))
  END as level,  -- Normalize level name
  'mcq' as type,  -- Always set to 'mcq' (practice_questions may not have type column)
  question,
  options,
  correct_answer,
  explanation,
  topic
FROM practice_questions
WHERE NOT EXISTS (
  -- Avoid duplicates by checking if question already exists
  SELECT 1 FROM questions q 
  WHERE q.question = practice_questions.question
  AND q.skill = LOWER(TRIM(REPLACE(practice_questions.skill, ' ', '')))
);

-- ============================================
-- STEP 5: VERIFY QUESTIONS WERE COPIED
-- ============================================
-- Check if all skills are now in main questions table
SELECT 
  'Questions Table' as source,
  skill,
  level,
  COUNT(*) as question_count
FROM questions
GROUP BY skill, level
ORDER BY skill, level;

-- ============================================
-- STEP 6: COMPARE COUNTS
-- ============================================
-- Make sure all questions were copied
SELECT 
  'practice_questions' as source,
  COUNT(*) as total_questions,
  COUNT(DISTINCT skill) as unique_skills
FROM practice_questions
UNION ALL
SELECT 
  'questions' as source,
  COUNT(*) as total_questions,
  COUNT(DISTINCT skill) as unique_skills
FROM questions;

-- Expected: Both tables should have same counts

-- ============================================
-- STEP 7: SAMPLE VERIFICATION
-- ============================================
-- Check a few questions to verify format
SELECT 
  skill,
  level,
  type,
  LEFT(question, 60) as question_preview,
  jsonb_typeof(options) as options_format,
  correct_answer
FROM questions
WHERE skill IN ('java', 'python', 'javascript', 'html', 'css')
LIMIT 10;

-- ============================================
-- ROLLBACK (IF NEEDED)
-- ============================================
-- If something goes wrong, you can delete copied questions
-- CAREFUL: Only run this if you need to undo!

/*
-- Delete all questions that were copied from practice_questions
DELETE FROM questions
WHERE id IN (
  SELECT q.id 
  FROM questions q
  INNER JOIN practice_questions pq 
  ON q.question = pq.question
);
*/

-- ============================================
-- NOTES
-- ============================================
-- 1. This script preserves your practice_questions table
-- 2. It only copies questions that don't already exist in questions table
-- 3. It normalizes skill names, level names, and types
-- 4. After running, test in Practice page
-- 5. If everything works, you can keep both tables or drop practice_questions

-- ============================================
-- OPTIONAL: DROP practice_questions TABLE
-- ============================================
-- ONLY do this AFTER verifying everything works!
-- BACKUP first!

/*
-- Create backup
CREATE TABLE practice_questions_backup AS 
SELECT * FROM practice_questions;

-- Drop the original table
DROP TABLE practice_questions;
*/
