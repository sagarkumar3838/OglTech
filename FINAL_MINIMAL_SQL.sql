-- ============================================
-- FINAL MINIMAL SQL - ONLY CORE COLUMNS
-- ============================================
-- This works with the standard questions table structure

INSERT INTO questions (
  question_id,
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
  gen_random_uuid() as question_id,
  LOWER(TRIM(REPLACE(skill, ' ', ''))) as skill,
  CASE 
    WHEN level ILIKE 'beginner' THEN 'easy'
    WHEN level ILIKE 'intermediate' THEN 'medium'
    WHEN level ILIKE 'advanced' THEN 'hard'
    ELSE LOWER(TRIM(level))
  END as level,
  'mcq' as type,
  question_text as question,
  jsonb_build_array(option_a, option_b, option_c, option_d) as options,
  to_jsonb(correct_answer) as correct_answer,
  COALESCE(explanation, '') as explanation,
  COALESCE(topic, '') as topic
FROM practice_questions
WHERE NOT EXISTS (
  SELECT 1 FROM questions q 
  WHERE q.question = practice_questions.question_text
);

-- ============================================
-- VERIFY IT WORKED
-- ============================================
SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM questions
GROUP BY skill, level
ORDER BY skill, level;

-- ============================================
-- CHECK TOTAL
-- ============================================
SELECT COUNT(*) as total_questions FROM questions;

-- ============================================
-- VIEW SAMPLE
-- ============================================
SELECT 
  question_id,
  skill,
  level,
  LEFT(question, 60) as question_preview,
  correct_answer
FROM questions
ORDER BY created_at DESC
LIMIT 10;
