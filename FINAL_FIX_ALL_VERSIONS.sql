-- ============================================
-- FINAL FIX - Try these in order until one works
-- ============================================

-- ============================================
-- VERSION 1: question_text + correct_answer
-- ============================================
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
  question_text as question,
  options,
  correct_answer,
  explanation,
  topic
FROM practice_questions
WHERE NOT EXISTS (
  SELECT 1 FROM questions q WHERE q.question = practice_questions.question_text
);

-- ============================================
-- If VERSION 1 fails, try VERSION 2
-- ============================================
-- VERSION 2: question_text + answer
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
  question_text as question,
  options,
  answer as correct_answer,
  explanation,
  topic
FROM practice_questions
WHERE NOT EXISTS (
  SELECT 1 FROM questions q WHERE q.question = practice_questions.question_text
);
*/

-- ============================================
-- If VERSION 2 fails, try VERSION 3
-- ============================================
-- VERSION 3: text + answer
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
  text as question,
  options,
  answer as correct_answer,
  explanation,
  topic
FROM practice_questions
WHERE NOT EXISTS (
  SELECT 1 FROM questions q WHERE q.question = practice_questions.text
);
*/

-- ============================================
-- If VERSION 3 fails, try VERSION 4
-- ============================================
-- VERSION 4: Minimal (no explanation, no topic)
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
  question_text as question,
  options,
  answer as correct_answer
FROM practice_questions
WHERE NOT EXISTS (
  SELECT 1 FROM questions q WHERE q.question = practice_questions.question_text
);
*/

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
