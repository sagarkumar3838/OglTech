-- ========================================
-- COPY THIS ENTIRE FILE AND RUN IN SUPABASE
-- ========================================

-- Step 1: Delete uppercase "GCP" duplicates (keep lowercase "gcp")
DELETE FROM practice_questions
WHERE skill = 'GCP'
AND question_text IN (
  SELECT question_text
  FROM practice_questions
  WHERE skill = 'gcp'
);

-- Step 2: Update any remaining "GCP" to "gcp"
UPDATE practice_questions
SET skill = 'gcp'
WHERE skill = 'GCP';

-- Step 3: Verify the fix
SELECT 
  '✅ GCP Questions Fixed!' as status,
  skill,
  level,
  COUNT(*) as question_count
FROM practice_questions
WHERE skill = 'gcp'
GROUP BY skill, level;

-- Step 4: Confirm no uppercase GCP remains
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ No uppercase GCP found - Perfect!'
    ELSE '⚠️ Still have uppercase GCP'
  END as status,
  COUNT(*) as uppercase_gcp_count
FROM practice_questions
WHERE skill = 'GCP';
