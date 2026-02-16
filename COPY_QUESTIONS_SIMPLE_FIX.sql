-- ============================================
-- SIMPLE FIX - Copy Questions (No type column issue)
-- ============================================
-- Run this in Supabase SQL Editor

-- First, let's see what columns practice_questions has:
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'practice_questions'
ORDER BY ordinal_position;

-- ============================================
-- MAIN FIX - Copy all questions
-- ============================================
-- This version doesn't reference type from practice_questions
-- It just sets type='mcq' for all questions

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
  'mcq' as type,  -- Always set to 'mcq' (not reading from practice_questions)
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

-- ============================================
-- VERIFY IT WORKED
-- ============================================
-- Check if questions were copied
SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM questions
GROUP BY skill, level
ORDER BY skill, level;

-- ============================================
-- COMPARE TOTALS
-- ============================================
SELECT 
  'practice_questions' as table_name,
  COUNT(*) as total
FROM practice_questions
UNION ALL
SELECT 
  'questions' as table_name,
  COUNT(*) as total
FROM questions;

-- Expected: Both should have similar counts after running the INSERT
