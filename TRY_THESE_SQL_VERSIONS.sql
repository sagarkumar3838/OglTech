-- ============================================
-- TRY THESE SQL VERSIONS ONE BY ONE
-- ============================================
-- Try each version until one works!

-- ============================================
-- FIRST: See your columns
-- ============================================
SELECT * FROM practice_questions LIMIT 1;

-- ============================================
-- VERSION 1: Standard column names with pq prefix
-- ============================================
-- Try this first:

INSERT INTO questions (skill, level, type, question, options, correct_answer, explanation, topic)
SELECT 
  LOWER(TRIM(REPLACE(pq.skill, ' ', ''))) as skill,
  CASE 
    WHEN pq.level ILIKE 'beginner' THEN 'easy'
    WHEN pq.level ILIKE 'intermediate' THEN 'medium'
    WHEN pq.level ILIKE 'advanced' THEN 'hard'
    ELSE LOWER(TRIM(pq.level))
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

-- ============================================
-- VERSION 2: question_text instead of question
-- ============================================
-- If VERSION 1 fails with "question" error, try this:


INSERT INTO questions (skill, level, type, question, options, correct_answer, explanation, topic)
SELECT 
  LOWER(TRIM(REPLACE(pq.skill, ' ', ''))) as skill,
  CASE 
    WHEN pq.level ILIKE 'beginner' THEN 'easy'
    WHEN pq.level ILIKE 'intermediate' THEN 'medium'
    WHEN pq.level ILIKE 'advanced' THEN 'hard'
    ELSE LOWER(TRIM(pq.level))
  END as level,
  'mcq' as type,
  pq.question_text as question,
  pq.options,
  pq.correct_answer,
  pq.explanation,
  pq.topic
FROM practice_questions pq
WHERE NOT EXISTS (
  SELECT 1 FROM questions q WHERE q.question = pq.question_text
);


-- ============================================
-- VERSION 3: answer instead of correct_answer
-- ============================================
-- If VERSION 1 fails with "correct_answer" error, try this:


INSERT INTO questions (skill, level, type, question, options, correct_answer, explanation, topic)
SELECT 
  LOWER(TRIM(REPLACE(pq.skill, ' ', ''))) as skill,
  CASE 
    WHEN pq.level ILIKE 'beginner' THEN 'easy'
    WHEN pq.level ILIKE 'intermediate' THEN 'medium'
    WHEN pq.level ILIKE 'advanced' THEN 'hard'
    ELSE LOWER(TRIM(pq.level))
  END as level,
  'mcq' as type,
  pq.question,
  pq.options,
  pq.answer as correct_answer,
  pq.explanation,
  pq.topic
FROM practice_questions pq
WHERE NOT EXISTS (
  SELECT 1 FROM questions q WHERE q.question = pq.question
);


-- ============================================
-- VERSION 4: Both question_text AND answer
-- ============================================
-- If both columns are different:

/*
INSERT INTO questions (skill, level, type, question, options, correct_answer, explanation, topic)
SELECT 
  LOWER(TRIM(REPLACE(pq.skill, ' ', ''))) as skill,
  CASE 
    WHEN pq.level ILIKE 'beginner' THEN 'easy'
    WHEN pq.level ILIKE 'intermediate' THEN 'medium'
    WHEN pq.level ILIKE 'advanced' THEN 'hard'
    ELSE LOWER(TRIM(pq.level))
  END as level,
  'mcq' as type,
  pq.question_text as question,
  pq.options,
  pq.answer as correct_answer,
  pq.explanation,
  pq.topic
FROM practice_questions pq
WHERE NOT EXISTS (
  SELECT 1 FROM questions q WHERE q.question = pq.question_text
);
*/

-- ============================================
-- VERSION 5: Minimal (no explanation, no topic)
-- ============================================
-- If explanation or topic columns don't exist:

/*
INSERT INTO questions (skill, level, type, question, options, correct_answer)
SELECT 
  LOWER(TRIM(REPLACE(pq.skill, ' ', ''))) as skill,
  CASE 
    WHEN pq.level ILIKE 'beginner' THEN 'easy'
    WHEN pq.level ILIKE 'intermediate' THEN 'medium'
    WHEN pq.level ILIKE 'advanced' THEN 'hard'
    ELSE LOWER(TRIM(pq.level))
  END as level,
  'mcq' as type,
  pq.question,
  pq.options,
  pq.correct_answer
FROM practice_questions pq
WHERE NOT EXISTS (
  SELECT 1 FROM questions q WHERE q.question = pq.question
);
*/

-- ============================================
-- VERSION 6: All different names
-- ============================================
-- If your columns are completely different:

/*
INSERT INTO questions (skill, level, type, question, options, correct_answer)
SELECT 
  LOWER(TRIM(REPLACE(pq.skill, ' ', ''))) as skill,
  CASE 
    WHEN pq.level ILIKE 'beginner' THEN 'easy'
    WHEN pq.level ILIKE 'intermediate' THEN 'medium'
    WHEN pq.level ILIKE 'advanced' THEN 'hard'
    ELSE LOWER(TRIM(pq.level))
  END as level,
  'mcq' as type,
  pq.text as question,           -- Change 'text' to your column name
  pq.choices as options,          -- Change 'choices' to your column name
  pq.answer as correct_answer     -- Change 'answer' to your column name
FROM practice_questions pq
WHERE NOT EXISTS (
  SELECT 1 FROM questions q WHERE q.question = pq.text
);
*/

-- ============================================
-- VERIFY AFTER RUNNING
-- ============================================
-- Check if it worked:

SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM questions
GROUP BY skill, level
ORDER BY skill, level;

-- ============================================
-- INSTRUCTIONS
-- ============================================
-- 1. First run: SELECT * FROM practice_questions LIMIT 1;
-- 2. Look at the column names in the result
-- 3. Try VERSION 1 first
-- 4. If it fails, uncomment and try the VERSION that matches your column names
-- 5. Keep trying until one works!
-- ============================================
