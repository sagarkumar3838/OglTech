-- ============================================
-- COMPLETE COPY - ALL COLUMNS FROM YOUR TABLE
-- ============================================

-- First, let's see ALL your columns
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'practice_questions'
ORDER BY ordinal_position;

-- ============================================
-- COPY WITH ALL AVAILABLE COLUMNS
-- ============================================

INSERT INTO questions (
  question_id,
  skill, 
  level, 
  type, 
  question, 
  options, 
  correct_answer, 
  explanation, 
  topic,
  mdn_link,
  youtube_english,
  youtube_hindi,
  youtube_kannada,
  youtube_tamil,
  youtube_telugu
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
  COALESCE(topic, '') as topic,
  mdn_link,
  youtube_english,
  youtube_hindi,
  youtube_kannada,
  youtube_tamil,
  youtube_telugu
FROM practice_questions
WHERE NOT EXISTS (
  SELECT 1 FROM questions q 
  WHERE q.question = practice_questions.question_text
);

-- ============================================
-- IF SOME COLUMNS DON'T EXIST, USE THIS MINIMAL VERSION
-- ============================================
/*
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
*/

-- ============================================
-- VERIFY
-- ============================================
SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM questions
GROUP BY skill, level
ORDER BY skill, level;
