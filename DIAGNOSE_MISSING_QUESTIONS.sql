-- ============================================
-- DIAGNOSE: Why are questions not showing?
-- ============================================

-- Check 1: What's in the questions table?
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM questions
GROUP BY skill, level
ORDER BY skill, level;

-- Check 2: Specifically check for Python beginner (what you're testing)
SELECT COUNT(*) as python_beginner_count
FROM questions
WHERE skill = 'python' AND level = 'easy';

-- Check 3: What levels exist in questions table?
SELECT DISTINCT level FROM questions ORDER BY level;

-- Check 4: What skills exist in questions table?
SELECT DISTINCT skill FROM questions ORDER BY skill;

-- Check 5: Sample of what's actually in questions table
SELECT 
  id,
  skill,
  level,
  type,
  LEFT(question, 60) as question_preview
FROM questions
LIMIT 10;

-- Check 6: What's in practice_questions table?
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM practice_questions
GROUP BY skill, level
ORDER BY skill, level;

-- Check 7: Check for Python in practice_questions
SELECT COUNT(*) as python_count
FROM practice_questions
WHERE LOWER(skill) = 'python';
