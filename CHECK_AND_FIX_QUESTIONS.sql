-- ============================================
-- STEP 1: CHECK WHAT'S IN DATABASE
-- ============================================

-- Check questions table
SELECT 'questions table' as table_name, COUNT(*) as total FROM questions;

-- Check practice_questions table
SELECT 'practice_questions table' as table_name, COUNT(*) as total FROM practice_questions;

-- ============================================
-- STEP 2: IF practice_questions IS EMPTY, WE NEED TO UPLOAD CSV FILES
-- ============================================
-- You need to upload the CSV files first!
-- The CSV files are in the questions/ folder
-- Use Supabase Table Editor to import them

-- ============================================
-- STEP 3: IF practice_questions HAS DATA, COPY TO questions
-- ============================================

-- First, let's see what levels are in practice_questions
SELECT DISTINCT level FROM practice_questions;

-- Map the levels correctly:
-- CSV has: "Basic", "Intermediate", "Advanced"
-- Database needs: "easy", "medium", "hard"

-- Copy from practice_questions to questions with correct level mapping
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
-- STEP 4: VERIFY IT WORKED
-- ============================================

-- Check Python beginner questions
SELECT COUNT(*) as python_easy_count
FROM questions
WHERE skill = 'python' AND level = 'easy';

-- Check all skills and levels
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM questions
GROUP BY skill, level
ORDER BY skill, level;
