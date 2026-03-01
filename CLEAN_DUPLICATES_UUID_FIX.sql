-- CLEAN ALL DUPLICATES - UUID Compatible Version
-- Works with UUID primary keys

-- ============================================================
-- STEP 1: DIAGNOSE
-- ============================================================

SELECT 
  'Current State' as status,
  COUNT(*) as total_questions,
  COUNT(DISTINCT (skill, level, question_text)) as unique_questions,
  COUNT(*) - COUNT(DISTINCT (skill, level, question_text)) as duplicates_to_remove
FROM practice_questions;

-- ============================================================
-- STEP 2: DELETE DUPLICATES USING ROW_NUMBER
-- ============================================================

-- Delete duplicates, keeping the first occurrence based on created_at
DELETE FROM practice_questions
WHERE id IN (
  SELECT id
  FROM (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY skill, level, question_text 
        ORDER BY created_at, id
      ) as row_num
    FROM practice_questions
  ) ranked
  WHERE row_num > 1
);

-- ============================================================
-- STEP 3: VERIFY CLEANUP
-- ============================================================

SELECT 
  'After Cleanup' as status,
  COUNT(*) as total_questions,
  COUNT(DISTINCT (skill, level, question_text)) as unique_questions,
  CASE 
    WHEN COUNT(*) = COUNT(DISTINCT (skill, level, question_text)) 
    THEN '✅ All duplicates removed'
    ELSE '⚠️ Still has duplicates'
  END as result
FROM practice_questions;

-- Show count by skill
SELECT 
  skill,
  level,
  COUNT(*) as question_count
FROM practice_questions
GROUP BY skill, level
ORDER BY skill, 
  CASE level
    WHEN 'Basic' THEN 1
    WHEN 'Intermediate' THEN 2
    WHEN 'Advanced' THEN 3
    ELSE 4
  END;

-- ============================================================
-- STEP 4: ADD UNIQUE CONSTRAINT
-- ============================================================

ALTER TABLE practice_questions
ADD CONSTRAINT unique_question_per_skill_level 
UNIQUE (skill, level, question_text);

-- Verify constraint
SELECT 
  '✅ Constraint Added' as status,
  constraint_name
FROM information_schema.table_constraints
WHERE table_name = 'practice_questions'
  AND constraint_name = 'unique_question_per_skill_level';

-- ============================================================
-- FINAL SUMMARY
-- ============================================================

SELECT 
  '✅ CLEANUP COMPLETE' as status,
  COUNT(*) as total_questions,
  COUNT(DISTINCT skill) as total_skills
FROM practice_questions;
