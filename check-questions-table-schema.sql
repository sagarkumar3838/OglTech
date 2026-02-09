-- Check the actual schema of the questions table
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'questions'
ORDER BY ordinal_position;

-- Sample a few rows to see the actual structure
SELECT * FROM questions LIMIT 3;
