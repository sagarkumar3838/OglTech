-- ============================================
-- UNIVERSAL COPY - Works with any column names
-- ============================================
-- This script will figure out your column names automatically

-- ============================================
-- STEP 1: See what columns you have
-- ============================================
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'practice_questions'
ORDER BY ordinal_position;

-- ============================================
-- STEP 2: See sample data to understand format
-- ============================================
SELECT * FROM practice_questions LIMIT 2;

-- ============================================
-- STEP 3: Try different possible column name combinations
-- ============================================

-- VERSION A: If columns are named exactly like questions table
-- (question, options, correct_answer, explanation, topic)
/*
INSERT INTO questions (skill, level, type, question, options, correct_answer, explanation, topic)
SELECT 
  LOWER(TRIM(REPLACE(skill, ' ', ''))) as skill,
  CASE 
    WHEN level ILIKE 'beginner' THEN 'easy'
    WHEN level ILIKE 'intermediate' THEN 'medium'
    WHEN level ILIKE 'advanced' THEN 'hard'
    ELSE LOWER(TRIM(level))
  END as level,
  'mcq' as type,
  pq.question,
  pq.options,
  pq.correct_answer,
  pq.explanation,
  pq.topic
FROM practice_questions pq
WHERE NOT EXISTS (
  SELECT 1 FROM questions q WHERE q.question = pq.question
);
*/

-- VERSION B: If columns have different names (question_text, answer, etc.)
-- Uncomment and modify based on your actual column names
/*
INSERT INTO questions (skill, level, type, question, options, correct_answer, explanation, topic)
SELECT 
  LOWER(TRIM(REPLACE(skill, ' ', ''))) as skill,
  CASE 
    WHEN level ILIKE 'beginner' THEN 'easy'
    WHEN level ILIKE 'intermediate' THEN 'medium'
    WHEN level ILIKE 'advanced' THEN 'hard'
    ELSE LOWER(TRIM(level))
  END as level,
  'mcq' as type,
  pq.question_text as question,  -- Change column name here
  pq.options,
  pq.answer as correct_answer,   -- Change column name here
  pq.explanation,
  pq.topic
FROM practice_questions pq
WHERE NOT EXISTS (
  SELECT 1 FROM questions q WHERE q.question = pq.question_text
);
*/

-- VERSION C: Minimal columns (if some columns don't exist)
/*
INSERT INTO questions (skill, level, type, question, options, correct_answer)
SELECT 
  LOWER(TRIM(REPLACE(skill, ' ', ''))) as skill,
  CASE 
    WHEN level ILIKE 'beginner' THEN 'easy'
    WHEN level ILIKE 'intermediate' THEN 'medium'
    WHEN level ILIKE 'advanced' THEN 'hard'
    ELSE LOWER(TRIM(level))
  END as level,
  'mcq' as type,
  pq.question_text as question,
  pq.options,
  pq.answer as correct_answer
FROM practice_questions pq
WHERE NOT EXISTS (
  SELECT 1 FROM questions q WHERE q.question = pq.question_text
);
*/

-- ============================================
-- INSTRUCTIONS
-- ============================================
-- 1. Run STEP 1 to see your column names
-- 2. Run STEP 2 to see sample data
-- 3. Based on the column names, uncomment and modify one of the VERSIONs above
-- 4. Replace column names in the VERSION to match your actual columns
-- 5. Run the modified INSERT statement
-- ============================================

-- ============================================
-- COMMON COLUMN NAME VARIATIONS
-- ============================================
-- question → question_text, question_content, text, q_text
-- correct_answer → answer, correct, correct_option, solution
-- explanation → explain, description, hint
-- topic → subject, category, tag
-- options → choices, answers, option_list
-- ============================================
