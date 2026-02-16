-- ============================================
-- CHECK CURRENT DATABASE STATUS
-- ============================================

-- 1. Check practice_questions table
SELECT 'practice_questions' as table_name, COUNT(*) as total_rows FROM practice_questions;

-- 2. Check questions table
SELECT 'questions' as table_name, COUNT(*) as total_rows FROM questions;

-- 3. Check what skills are in practice_questions
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM practice_questions
GROUP BY skill, level
ORDER BY skill, level;

-- 4. Check what skills are in questions table
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM questions
GROUP BY skill, level
ORDER BY skill, level;

-- 5. Check if python beginner exists in practice_questions
SELECT COUNT(*) as python_basic_in_practice
FROM practice_questions
WHERE LOWER(skill) = 'python' AND LOWER(level) IN ('basic', 'beginner', 'easy');

-- 6. Check if python easy exists in questions
SELECT COUNT(*) as python_easy_in_questions
FROM questions
WHERE LOWER(skill) = 'python' AND level = 'easy';

-- 7. Sample python question from practice_questions (if exists)
SELECT skill, level, question_text, topic
FROM practice_questions
WHERE LOWER(skill) = 'python'
LIMIT 3;

-- 8. Sample python question from questions (if exists)
SELECT skill, level, question, topic
FROM questions
WHERE LOWER(skill) = 'python'
LIMIT 3;
