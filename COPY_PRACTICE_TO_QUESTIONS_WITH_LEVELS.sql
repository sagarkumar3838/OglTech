-- ========================================
-- COPY ALL DATA: practice_questions → questions
-- Convert levels: Basic/Intermediate/Advanced → easy/medium/hard
-- ========================================

-- STEP 1: Clear questions table
DELETE FROM questions;

-- STEP 2: Copy all data with level conversion
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

-- STEP 3: Verify total count
SELECT '=== TOTAL QUESTIONS ===' as status;
SELECT COUNT(*) as total_questions FROM questions;

-- STEP 4: Verify levels
SELECT '=== LEVELS BREAKDOWN ===' as status;
SELECT level, COUNT(*) as count
FROM questions
GROUP BY level
ORDER BY CASE level 
  WHEN 'easy' THEN 1
  WHEN 'medium' THEN 2
  WHEN 'hard' THEN 3
END;

-- STEP 5: Verify devtools
SELECT '=== DEVTOOLS VERIFICATION ===' as status;
SELECT level, COUNT(*) as count
FROM questions
WHERE LOWER(skill) = 'devtools'
GROUP BY level
ORDER BY CASE level 
  WHEN 'easy' THEN 1
  WHEN 'medium' THEN 2
  WHEN 'hard' THEN 3
END;

-- STEP 6: Show all skills
SELECT '=== ALL SKILLS ===' as status;
SELECT skill, level, COUNT(*) as count
FROM questions
GROUP BY skill, level
ORDER BY skill, CASE level 
  WHEN 'easy' THEN 1
  WHEN 'medium' THEN 2
  WHEN 'hard' THEN 3
END;

-- ========================================
-- EXPECTED RESULT:
-- Total: 9,464 questions
-- Levels: easy, medium, hard
-- Devtools: easy, medium, hard (all questions visible)
-- ========================================
