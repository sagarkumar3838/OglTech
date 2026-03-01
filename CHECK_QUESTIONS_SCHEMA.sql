-- Check the actual schema of questions table

-- Show all columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'questions'
ORDER BY ordinal_position;

-- Show sample data to understand structure
SELECT *
FROM questions
WHERE skill = 'javascript'
LIMIT 1;

-- Check what the level values are
SELECT DISTINCT level
FROM questions
ORDER BY level;

-- Check what the skill values are
SELECT DISTINCT skill
FROM questions
ORDER BY skill;
