-- Show all columns in practice_questions table

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'practice_questions'
ORDER BY ordinal_position;
