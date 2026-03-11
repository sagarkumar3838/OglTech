-- ============================================
-- FIX C++ SPLIT - MERGE ALL VARIATIONS
-- ============================================

-- Step 1: Check current state
SELECT 
  skill,
  COUNT(CASE WHEN level = 'beginner' THEN 1 END) as beginner,
  COUNT(CASE WHEN level = 'intermediate' THEN 1 END) as intermediate,
  COUNT(CASE WHEN level = 'advanced' THEN 1 END) as advanced,
  COUNT(*) as total
FROM practice_questions
WHERE LOWER(skill) LIKE '%c++%' OR LOWER(skill) LIKE '%cpp%'
GROUP BY skill;

-- Step 2: Delete duplicates BEFORE merging
DELETE FROM practice_questions
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY 
               LOWER(TRIM(question_text)),
               CASE 
                 WHEN LOWER(level) = 'basic' THEN 'beginner'
                 WHEN LOWER(level) = 'easy' THEN 'beginner'
                 WHEN LOWER(level) = 'medium' THEN 'intermediate'
                 WHEN LOWER(level) = 'hard' THEN 'advanced'
                 ELSE LOWER(level)
               END
             ORDER BY created_at DESC NULLS LAST, id DESC
           ) as rn
    FROM practice_questions
    WHERE LOWER(skill) LIKE '%c++%' OR LOWER(skill) LIKE '%cpp%'
  ) t
  WHERE rn > 1
);

-- Step 3: Merge all C++ variations into 'cpp'
UPDATE practice_questions
SET 
  skill = 'cpp',
  level = CASE 
    WHEN LOWER(level) = 'basic' THEN 'beginner'
    WHEN LOWER(level) = 'easy' THEN 'beginner'
    WHEN LOWER(level) = 'medium' THEN 'intermediate'
    WHEN LOWER(level) = 'hard' THEN 'advanced'
    ELSE LOWER(level)
  END
WHERE LOWER(skill) IN ('c++', 'cpp', 'cplusplus', 'c plus plus');

-- Step 4: Verify the fix
SELECT 
  skill,
  COUNT(CASE WHEN level = 'beginner' THEN 1 END) as beginner,
  COUNT(CASE WHEN level = 'intermediate' THEN 1 END) as intermediate,
  COUNT(CASE WHEN level = 'advanced' THEN 1 END) as advanced,
  COUNT(*) as total
FROM practice_questions
WHERE skill = 'cpp'
GROUP BY skill;

-- Expected result after merge:
-- skill | beginner | intermediate | advanced | total
-- cpp   | 213      | 231          | 240      | 684
