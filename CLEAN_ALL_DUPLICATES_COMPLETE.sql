-- COMPLETE DUPLICATE CLEANUP FOR ALL SKILLS
-- This removes ALL duplicate questions across the entire database

-- ============================================================
-- STEP 1: DIAGNOSE ALL DUPLICATES
-- ============================================================

-- Count duplicates by skill
SELECT 
  skill,
  level,
  COUNT(*) as total_questions,
  COUNT(DISTINCT question_text) as unique_questions,
  COUNT(*) - COUNT(DISTINCT question_text) as duplicates
FROM practice_questions
GROUP BY skill, level
HAVING COUNT(*) > COUNT(DISTINCT question_text)
ORDER BY COUNT(*) - COUNT(DISTINCT question_text) DESC;

-- Total duplicates across entire database
SELECT 
  'Database-wide duplicates' as info,
  COUNT(*) as total_rows,
  COUNT(DISTINCT (skill, level, question_text)) as unique_questions,
  COUNT(*) - COUNT(DISTINCT (skill, level, question_text)) as duplicates_to_remove
FROM practice_questions;

-- Show top duplicate questions
SELECT 
  skill,
  level,
  LEFT(question_text, 80) as question,
  COUNT(*) as duplicate_count
FROM practice_questions
GROUP BY skill, level, question_text
HAVING COUNT(*) > 1
ORDER BY COUNT(*) DESC
LIMIT 20;

-- ============================================================
-- STEP 2: DELETE ALL DUPLICATES (KEEPS FIRST OCCURRENCE)
-- ============================================================

-- This will delete ALL duplicate questions across ALL skills
-- Keeps only the row with the smallest ID (by created_at or ctid) for each unique question
DELETE FROM practice_questions
WHERE ctid IN (
  SELECT p1.ctid
  FROM practice_questions p1
  WHERE EXISTS (
    -- Check if there's an earlier row with the same question
    SELECT 1
    FROM practice_questions p2
    WHERE p2.skill = p1.skill
      AND p2.level = p1.level
      AND p2.question_text = p1.question_text
      AND p2.ctid < p1.ctid  -- Keep the first physical row
  )
);

-- ============================================================
-- STEP 3: VERIFY THE CLEANUP
-- ============================================================

-- Check if any duplicates remain
SELECT 
  'After Cleanup - Remaining Duplicates' as status,
  COUNT(*) as total_rows,
  COUNT(DISTINCT (skill, level, question_text)) as unique_questions,
  COUNT(*) - COUNT(DISTINCT (skill, level, question_text)) as remaining_duplicates,
  CASE 
    WHEN COUNT(*) = COUNT(DISTINCT (skill, level, question_text)) THEN '✅ All duplicates removed'
    ELSE '⚠️ Still has duplicates'
  END as result
FROM practice_questions;

-- Show count by skill and level
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
-- STEP 4: ADD UNIQUE CONSTRAINT (PREVENTS FUTURE DUPLICATES)
-- ============================================================

-- Now that duplicates are removed, add the constraint
ALTER TABLE practice_questions
ADD CONSTRAINT unique_question_per_skill_level 
UNIQUE (skill, level, question_text);

-- Verify constraint was added
SELECT 
  'Constraint Added' as status,
  constraint_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'practice_questions'
  AND constraint_name = 'unique_question_per_skill_level';

-- ============================================================
-- FINAL SUMMARY
-- ============================================================

SELECT 
  '✅ CLEANUP COMPLETE' as status,
  COUNT(*) as total_questions,
  COUNT(DISTINCT skill) as total_skills,
  COUNT(DISTINCT (skill, level)) as total_skill_levels
FROM practice_questions;
