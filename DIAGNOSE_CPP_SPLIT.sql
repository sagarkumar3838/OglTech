-- ============================================
-- DIAGNOSE C++ SPLIT ISSUE
-- ============================================

-- View 1: Show ALL C++ variations in database
SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM practice_questions
WHERE LOWER(skill) LIKE '%c++%' OR LOWER(skill) LIKE '%cpp%'
GROUP BY skill, level
ORDER BY skill, 
  CASE level
    WHEN 'beginner' THEN 1
    WHEN 'intermediate' THEN 2
    WHEN 'advanced' THEN 3
    ELSE 4
  END;

-- View 2: Summary by skill name
SELECT 
  skill,
  COUNT(CASE WHEN level = 'beginner' THEN 1 END) as beginner_count,
  COUNT(CASE WHEN level = 'intermediate' THEN 1 END) as intermediate_count,
  COUNT(CASE WHEN level = 'advanced' THEN 1 END) as advanced_count,
  COUNT(*) as total_count
FROM practice_questions
WHERE LOWER(skill) LIKE '%c++%' OR LOWER(skill) LIKE '%cpp%'
GROUP BY skill
ORDER BY skill;

-- View 3: What the CSV file uses
SELECT 'CSV file uses: C++,Advanced,' as info;

-- View 4: What database expects
SELECT 'Database should use: cpp,advanced' as info;

-- View 5: Show exact skill names (case-sensitive)
SELECT DISTINCT 
  skill,
  '"' || skill || '"' as quoted_skill,
  LENGTH(skill) as length,
  COUNT(*) as count
FROM practice_questions
WHERE LOWER(skill) LIKE '%c++%' OR LOWER(skill) LIKE '%cpp%'
GROUP BY skill
ORDER BY skill;
