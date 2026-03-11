-- ============================================
-- FIX ANGULAR ADVANCED UPLOAD ISSUE
-- ============================================

-- Step 1: Check what's preventing the upload
-- Run the diagnose script first, then come back here

-- Step 2: If duplicates exist, remove them first
DELETE FROM practice_questions
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY skill, level, question_text ORDER BY created_at) as rn
    FROM practice_questions
    WHERE skill = 'angular' AND level = 'advanced'
  ) t
  WHERE rn > 1
);

-- Step 3: Verify current count after cleanup
SELECT 
  'After cleanup' as status,
  COUNT(*) as angular_advanced_count
FROM practice_questions
WHERE skill = 'angular' AND level = 'advanced';

-- Step 4: Check if there's a unique constraint blocking inserts
-- If you see a constraint, you may need to handle duplicates differently

-- Step 5: Manual verification - show sample questions
SELECT 
  id,
  LEFT(question_text, 100) as question_preview,
  created_at
FROM practice_questions
WHERE skill = 'angular' AND level = 'advanced'
ORDER BY created_at DESC
LIMIT 5;
