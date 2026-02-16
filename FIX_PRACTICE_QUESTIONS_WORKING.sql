-- ============================================
-- FIX PRACTICE PAGE - WORKING VERSION
-- ============================================
-- This version checks what columns exist first
-- Run this in Supabase SQL Editor

-- ============================================
-- STEP 1: CHECK practice_questions TABLE STRUCTURE
-- ============================================
SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'practice_questions'
ORDER BY ordinal_position;

-- ============================================
-- STEP 2: SEE SAMPLE DATA
-- ============================================
SELECT * FROM practice_questions LIMIT 3;

-- ============================================
-- STEP 3: CHECK WHAT SKILLS YOU HAVE
-- ============================================
SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM practice_questions
GROUP BY skill, level
ORDER BY skill, level;

-- ============================================
-- STEP 4: COPY QUESTIONS (VERSION 1 - If type column exists)
-- ============================================
-- Try this first:

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
  LOWER(TRIM(REPLACE(skill, ' ', ''))) as skill,
  CASE 
    WHEN level ILIKE 'beginner' THEN 'easy'
    WHEN level ILIKE 'intermediate' THEN 'medium'
    WHEN level ILIKE 'advanced' THEN 'hard'
    ELSE LOWER(TRIM(level))
  END as level,
  COALESCE(NULLIF(pq.type, ''), 'mcq') as type,
  question,
  options,
  correct_answer,
  explanation,
  topic
FROM practice_questions pq
WHERE NOT EXISTS (
  SELECT 1 FROM questions q 
  WHERE q.question = pq.question
);

-- ============================================
-- STEP 4 ALTERNATIVE: COPY QUESTIONS (VERSION 2 - If type column DOESN'T exist)
-- ============================================
-- If the above fails, use this instead:

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
  LOWER(TRIM(REPLACE(skill, ' ', ''))) as skill,
  CASE 
    WHEN level ILIKE 'beginner' THEN 'easy'
    WHEN level ILIKE 'intermediate' THEN 'medium'
    WHEN level ILIKE 'advanced' THEN 'hard'
    ELSE LOWER(TRIM(level))
  END as level,
  'mcq' as type,  -- Always set to 'mcq'
  question,
  options,
  correct_answer,
  explanation,
  topic
FROM practice_questions
WHERE NOT EXISTS (
  SELECT 1 FROM questions q 
  WHERE q.question = practice_questions.question
);
*/

-- ============================================
-- STEP 5: VERIFY QUESTIONS WERE COPIED
-- ============================================
SELECT 
  skill,
  level,
  type,
  COUNT(*) as question_count
FROM questions
GROUP BY skill, level, type
ORDER BY skill, level;

-- ============================================
-- STEP 6: COMPARE COUNTS
-- ============================================
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

-- ============================================
-- INSTRUCTIONS
-- ============================================
-- 1. Run STEP 1 to see what columns exist
-- 2. Run STEP 2 to see sample data
-- 3. Run STEP 3 to see your skills
-- 4. If STEP 4 fails, uncomment and run STEP 4 ALTERNATIVE
-- 5. Run STEP 5 to verify
-- 6. Run STEP 6 to compare counts
-- ============================================
