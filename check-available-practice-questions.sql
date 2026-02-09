-- Check what questions are available for Practice page
-- Practice page queries: skill + level (beginner/intermediate/advanced)

-- 1. Count questions by skill and level
SELECT 
  skill,
  level,
  type,
  COUNT(*) as count
FROM questions
WHERE type = 'mcq'  -- Practice page needs MCQ questions
GROUP BY skill, level, type
ORDER BY skill, level;

-- 2. Check specific popular skills
SELECT 
  skill,
  level,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) >= 10 THEN '✅ Ready (10+ questions)'
    WHEN COUNT(*) > 0 THEN '⚠️ Partial (' || COUNT(*) || ' questions)'
    ELSE '❌ No questions'
  END as status
FROM questions
WHERE type = 'mcq'
  AND skill IN ('html', 'css', 'javascript', 'python', 'java', 'react', 'nodejs')
  AND level IN ('easy', 'medium', 'hard')
GROUP BY skill, level
ORDER BY skill, level;

-- 3. Map database levels to Practice page levels
-- Practice page uses: beginner, intermediate, advanced
-- Database uses: easy, medium, hard
SELECT 
  skill,
  CASE 
    WHEN level = 'easy' THEN 'beginner'
    WHEN level = 'medium' THEN 'intermediate'
    WHEN level = 'hard' THEN 'advanced'
    ELSE level
  END as practice_level,
  level as db_level,
  COUNT(*) as count
FROM questions
WHERE type = 'mcq'
GROUP BY skill, level
ORDER BY skill, level;

-- 4. Sample question to verify structure
SELECT 
  id,
  skill,
  level,
  type,
  question,
  options,
  correct_answer
FROM questions
WHERE type = 'mcq'
  AND skill = 'html'
  AND level = 'easy'
LIMIT 1;
