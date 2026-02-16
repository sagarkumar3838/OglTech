-- ============================================
-- AUTO-GENERATE THE CORRECT COPY SQL
-- ============================================
-- This will show you the exact SQL to run based on your table structure

-- ============================================
-- STEP 1: Show all columns in practice_questions
-- ============================================
SELECT 
  '-- Your practice_questions table has these columns:' as info
UNION ALL
SELECT 
  '-- ' || column_name || ' (' || data_type || ')'
FROM information_schema.columns 
WHERE table_name = 'practice_questions'
ORDER BY ordinal_position;

-- ============================================
-- STEP 2: Show all columns in questions table
-- ============================================
SELECT 
  '-- Your questions table expects these columns:' as info
UNION ALL
SELECT 
  '-- ' || column_name || ' (' || data_type || ')'
FROM information_schema.columns 
WHERE table_name = 'questions'
ORDER BY ordinal_position;

-- ============================================
-- STEP 3: See sample data from practice_questions
-- ============================================
SELECT 
  '=== SAMPLE DATA FROM practice_questions ===' as info;

SELECT * FROM practice_questions LIMIT 1;

-- ============================================
-- STEP 4: See sample data from questions
-- ============================================
SELECT 
  '=== SAMPLE DATA FROM questions ===' as info;

SELECT * FROM questions LIMIT 1;

-- ============================================
-- STEP 5: Compare column names
-- ============================================
-- Find matching columns
SELECT 
  'Matching columns:' as info,
  pq.column_name
FROM information_schema.columns pq
INNER JOIN information_schema.columns q 
  ON pq.column_name = q.column_name
WHERE pq.table_name = 'practice_questions'
AND q.table_name = 'questions'
ORDER BY pq.ordinal_position;

-- Find columns only in practice_questions
SELECT 
  'Only in practice_questions:' as info,
  pq.column_name
FROM information_schema.columns pq
LEFT JOIN information_schema.columns q 
  ON pq.column_name = q.column_name AND q.table_name = 'questions'
WHERE pq.table_name = 'practice_questions'
AND q.column_name IS NULL;

-- Find columns only in questions
SELECT 
  'Only in questions (need to map):' as info,
  q.column_name
FROM information_schema.columns q
LEFT JOIN information_schema.columns pq 
  ON q.column_name = pq.column_name AND pq.table_name = 'practice_questions'
WHERE q.table_name = 'questions'
AND pq.column_name IS NULL
AND q.column_name NOT IN ('id', 'created_at', 'updated_at');

-- ============================================
-- AFTER RUNNING THIS
-- ============================================
-- Share the output and I'll create the exact SQL you need!
-- Or look at the sample data and create the mapping yourself
-- ============================================
