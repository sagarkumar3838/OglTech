-- ============================================
-- FINAL WORKING SQL - CORRECTED!
-- ============================================
-- Columns are: option_a, option_b, option_c, option_d (singular!)

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
  'mcq' as type,
  question_text as question,
  jsonb_build_array(option_a, option_b, option_c, option_d) as options,
  correct_answer,
  explanation,
  topic
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
-- CHECK SAMPLE QUESTIONS
-- ============================================
SELECT 
  skill,
  level,
  LEFT(question, 50) as question_preview,
  jsonb_typeof(options) as options_format,
  jsonb_array_length(options) as num_options,
  correct_answer
FROM questions
LIMIT 5;
