-- ============================================
-- COPY THIS SQL AND RUN IN SUPABASE
-- ============================================
-- Go to: https://ksjgsgebjnpwyycnptom.supabase.co
-- Click: SQL Editor → New Query
-- Copy everything below and click Run

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
-- VERIFY (Run this after the INSERT above)
-- ============================================
SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM questions
GROUP BY skill, level
ORDER BY skill, level;

-- You should see all your skills with question counts!
-- Then test at: https://skillevaluate.web.app/practice
