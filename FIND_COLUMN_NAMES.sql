-- ============================================
-- STEP 1: Find out what columns exist
-- ============================================
-- Run this FIRST to see your table structure

SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'practice_questions'
ORDER BY ordinal_position;

-- ============================================
-- STEP 2: See sample data
-- ============================================
-- This will show us the actual column names and data

SELECT * FROM practice_questions LIMIT 3;

-- ============================================
-- STEP 3: Count your questions
-- ============================================
SELECT COUNT(*) as total_questions FROM practice_questions;

-- ============================================
-- AFTER RUNNING ABOVE
-- ============================================
-- Share the results and I'll create the correct SQL
-- The column names might be different like:
-- - "question_text" instead of "question"
-- - "answer" instead of "correct_answer"
-- - etc.
