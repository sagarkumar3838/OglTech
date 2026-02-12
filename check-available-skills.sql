-- ============================================
-- Check which skills have MCQ questions in database
-- Run this in Supabase SQL Editor
-- ============================================

-- STEP 1: Check questions table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'questions'
ORDER BY ordinal_position;

-- STEP 2: Count questions by skill and level
SELECT 
  skill,
  level,
  type,
  COUNT(*) as question_count
FROM questions
WHERE type = 'mcq'
GROUP BY skill, level, type
ORDER BY skill, level;

-- STEP 3: List all distinct skills with MCQ questions
SELECT DISTINCT skill
FROM questions
WHERE type = 'mcq'
ORDER BY skill;

-- STEP 4: Check if learning resource columns exist and have data
SELECT 
  skill,
  COUNT(*) as total_questions,
  COUNT(mdn_link) as has_mdn,
  COUNT(youtube_english) as has_video_en,
  COUNT(youtube_hindi) as has_video_hi
FROM questions
WHERE type = 'mcq'
GROUP BY skill
ORDER BY skill;
