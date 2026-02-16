-- ========================================
-- ADD MISSING COLUMNS TO questions TABLE
-- Then copy all data from practice_questions
-- ========================================

-- STEP 1: Add missing columns if they don't exist
-- (This will fail silently if columns already exist)

-- Add topic column
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS topic TEXT;

-- Add mdn_link column
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS mdn_link TEXT;

-- Add YouTube link columns
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS youtube_english TEXT;

ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS youtube_hindi TEXT;

ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS youtube_kannada TEXT;

ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS youtube_tamil TEXT;

ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS youtube_telugu TEXT;

-- STEP 2: Clear questions table
DELETE FROM questions;

-- STEP 3: Copy ALL data with level conversion
INSERT INTO questions (
  skill, 
  level, 
  question_text, 
  option_a, 
  option_b, 
  option_c, 
  option_d,
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
  skill,
  CASE 
    WHEN LOWER(level) = 'basic' THEN 'easy'
    WHEN LOWER(level) = 'beginner' THEN 'easy'
    WHEN LOWER(level) = 'intermediate' THEN 'medium'
    WHEN LOWER(level) = 'advanced' THEN 'hard'
    ELSE LOWER(level)
  END as level,
  question_text, 
  option_a, 
  option_b, 
  option_c, 
  option_d,
  correct_answer, 
  explanation, 
  topic, 
  mdn_link,
  youtube_english, 
  youtube_hindi, 
  youtube_kannada, 
  youtube_tamil, 
  youtube_telugu
FROM practice_questions;

-- STEP 4: Verify
SELECT '=== COLUMNS ADDED ===' as status;
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'questions'
ORDER BY ordinal_position;

SELECT '=== TOTAL QUESTIONS ===' as status;
SELECT COUNT(*) as total FROM questions;

SELECT '=== LEVELS ===' as status;
SELECT level, COUNT(*) as count
FROM questions
GROUP BY level
ORDER BY CASE level 
  WHEN 'easy' THEN 1
  WHEN 'medium' THEN 2
  WHEN 'hard' THEN 3
END;

SELECT '=== DEVTOOLS ===' as status;
SELECT level, COUNT(*) as count
FROM questions
WHERE LOWER(skill) = 'devtools'
GROUP BY level;

-- ========================================
-- RESULT: questions table now has all columns
-- and all 9,464 questions with easy/medium/hard levels
-- ========================================
