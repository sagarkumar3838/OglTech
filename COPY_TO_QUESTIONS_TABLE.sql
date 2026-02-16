-- ============================================
-- COPY FROM practice_questions TO questions
-- ============================================

-- This copies all questions and maps levels correctly:
-- Basic → easy
-- Intermediate → medium  
-- Advanced → hard

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
    WHEN LOWER(level) IN ('basic', 'beginner', 'easy') THEN 'easy'
    WHEN LOWER(level) IN ('intermediate', 'medium') THEN 'medium'
    WHEN LOWER(level) IN ('advanced', 'hard') THEN 'hard'
    ELSE 'easy'
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
-- VERIFY IT WORKED
-- ============================================

-- Check total counts
SELECT 
  'practice_questions' as table_name, 
  COUNT(*) as total 
FROM practice_questions
UNION ALL
SELECT 
  'questions' as table_name, 
  COUNT(*) as total 
FROM questions;

-- Check skills and levels
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM questions
GROUP BY skill, level
ORDER BY skill, 
  CASE level 
    WHEN 'easy' THEN 1 
    WHEN 'medium' THEN 2 
    WHEN 'hard' THEN 3 
  END;
