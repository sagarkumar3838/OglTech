-- Check actual level values stored for ReactJS questions

-- Show exact level values (case-sensitive)
SELECT 
  level,
  COUNT(*) as count,
  MIN(created_at) as first_added,
  MAX(created_at) as last_added
FROM practice_questions
WHERE skill = 'ReactJS'
GROUP BY level
ORDER BY count DESC;

-- Show sample questions to see the exact data
SELECT 
  id,
  skill,
  level,
  LEFT(question_text, 50) as question_preview,
  created_at
FROM practice_questions
WHERE skill = 'ReactJS'
ORDER BY created_at DESC
LIMIT 20;

-- Check if there's a level constraint
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'practice_questions'::regclass
  AND conname LIKE '%level%';
