-- ============================================
-- COPY JAVA QUESTIONS TO MAIN TABLE
-- ============================================
-- This script copies Java questions from a separate table
-- into the main 'questions' table so they appear in Practice page

-- STEP 1: FIND YOUR JAVA TABLE
-- ============================================
-- Run this first to find the table name
SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns 
        WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
AND (table_name ILIKE '%java%' OR table_name ILIKE '%practice%')
ORDER BY table_name;

-- ============================================
-- STEP 2: CHECK THE TABLE STRUCTURE
-- ============================================
-- Replace 'YOUR_JAVA_TABLE' with the actual table name from Step 1
-- Uncomment and run:

-- SELECT * FROM YOUR_JAVA_TABLE LIMIT 5;

-- ============================================
-- STEP 3: COPY QUESTIONS (STANDARD FORMAT)
-- ============================================
-- If your table has columns: skill, level, type, question, options, correct_answer, explanation, topic
-- Replace 'YOUR_JAVA_TABLE' with actual table name

/*
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
  'java' as skill,  -- Force skill to lowercase 'java'
  CASE 
    WHEN level ILIKE 'beginner' THEN 'easy'
    WHEN level ILIKE 'intermediate' THEN 'medium'
    WHEN level ILIKE 'advanced' THEN 'hard'
    ELSE LOWER(TRIM(level))
  END as level,  -- Normalize level names
  COALESCE(NULLIF(type, ''), 'mcq') as type,  -- Default to 'mcq' if empty
  question,
  options,
  correct_answer,
  explanation,
  topic
FROM YOUR_JAVA_TABLE
WHERE NOT EXISTS (
  -- Avoid duplicates by checking if question already exists
  SELECT 1 FROM questions q 
  WHERE q.question = YOUR_JAVA_TABLE.question 
  AND q.skill = 'java'
);
*/

-- ============================================
-- STEP 4: VERIFY QUESTIONS WERE COPIED
-- ============================================
-- Check if Java questions are now in main table
SELECT 
  skill, 
  level, 
  type, 
  COUNT(*) as question_count
FROM questions
WHERE skill = 'java'
GROUP BY skill, level, type
ORDER BY level;

-- Expected output:
-- skill | level  | type | question_count
-- ------|--------|------|---------------
-- java  | easy   | mcq  | 10+
-- java  | medium | mcq  | 10+
-- java  | hard   | mcq  | 10+

-- ============================================
-- STEP 5: SAMPLE QUESTIONS CHECK
-- ============================================
-- View a few Java questions to verify format
SELECT 
  skill,
  level,
  type,
  LEFT(question, 60) as question_preview,
  jsonb_typeof(options) as options_type,
  correct_answer
FROM questions
WHERE skill = 'java'
LIMIT 5;

-- ============================================
-- ALTERNATIVE: IF YOUR TABLE HAS DIFFERENT COLUMN NAMES
-- ============================================
-- Example: If your table has columns like:
-- question_text, difficulty, answer_options, correct_option, etc.

/*
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
  'java' as skill,
  CASE 
    WHEN difficulty = 'beginner' THEN 'easy'
    WHEN difficulty = 'intermediate' THEN 'medium'
    WHEN difficulty = 'advanced' THEN 'hard'
    ELSE 'easy'
  END as level,
  'mcq' as type,
  question_text as question,
  answer_options as options,
  correct_option as correct_answer,
  explanation_text as explanation,
  category as topic
FROM YOUR_JAVA_TABLE;
*/

-- ============================================
-- ROLLBACK (IF SOMETHING GOES WRONG)
-- ============================================
-- If you need to undo, run this:

/*
-- Delete Java questions from main table
DELETE FROM questions WHERE skill = 'java';
*/

-- ============================================
-- TROUBLESHOOTING
-- ============================================

-- Check if questions table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'questions'
) as questions_table_exists;

-- Check total questions in main table
SELECT COUNT(*) as total_questions FROM questions;

-- Check all skills in main table
SELECT DISTINCT skill, COUNT(*) as count
FROM questions
GROUP BY skill
ORDER BY skill;

-- ============================================
-- NOTES
-- ============================================
-- 1. Always backup before running INSERT statements
-- 2. Test with LIMIT 10 first, then remove LIMIT
-- 3. Check for duplicates before inserting
-- 4. Verify in Practice page after copying
-- 5. Keep the separate table until you confirm everything works
