-- ============================================
-- DIAGNOSE C++ ADVANCED QUESTIONS ISSUE
-- ============================================

-- Check 1: Look for C++ with different case variations
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM practice_questions
WHERE LOWER(skill) LIKE '%cpp%' OR LOWER(skill) LIKE '%c++%' OR LOWER(skill) LIKE '%c plus%'
GROUP BY skill, level
ORDER BY skill, level;

-- Check 2: Check all variations of "advanced" level
SELECT 
  skill,
  level,
  COUNT(*) as count
FROM practice_questions
WHERE LOWER(skill) IN ('cpp', 'c++', 'c plus plus')
GROUP BY skill, level
ORDER BY skill, level;

-- Check 3: Show sample C++ questions if they exist
SELECT 
  skill,
  level,
  LEFT(question_text, 100) as question_preview
FROM practice_questions
WHERE LOWER(skill) LIKE '%cpp%' OR LOWER(skill) LIKE '%c++%'
LIMIT 5;

-- Check 4: Count all C++ questions regardless of level
SELECT 
  COUNT(*) as total_cpp_questions
FROM practice_questions
WHERE LOWER(skill) IN ('cpp', 'c++', 'c plus plus', 'cplusplus');

-- Check 5: See what skill names exist that might be C++
SELECT DISTINCT skill
FROM practice_questions
WHERE skill ILIKE '%c%'
ORDER BY skill;
