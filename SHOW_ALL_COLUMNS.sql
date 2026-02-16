-- ============================================
-- SHOW ALL COLUMNS IN BOTH TABLES
-- ============================================

-- See ALL columns in practice_questions table
SELECT 
  'practice_questions' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'practice_questions'
ORDER BY ordinal_position;

-- See ALL columns in questions table
SELECT 
  'questions' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'questions'
ORDER BY ordinal_position;

-- Compare: What columns are ONLY in practice_questions?
SELECT 
  'Only in practice_questions' as info,
  pq.column_name,
  pq.data_type
FROM information_schema.columns pq
LEFT JOIN information_schema.columns q 
  ON pq.column_name = q.column_name AND q.table_name = 'questions'
WHERE pq.table_name = 'practice_questions'
AND q.column_name IS NULL
ORDER BY pq.ordinal_position;

-- Compare: What columns are ONLY in questions?
SELECT 
  'Only in questions' as info,
  q.column_name,
  q.data_type
FROM information_schema.columns q
LEFT JOIN information_schema.columns pq 
  ON q.column_name = pq.column_name AND pq.table_name = 'practice_questions'
WHERE q.table_name = 'questions'
AND pq.column_name IS NULL
ORDER BY q.ordinal_position;

-- See sample data from practice_questions with ALL columns
SELECT * FROM practice_questions LIMIT 1;
