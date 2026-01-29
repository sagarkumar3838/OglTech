-- Check the data type of user_id column
SELECT 
    table_name,
    column_name,
    data_type,
    udt_name
FROM information_schema.columns
WHERE table_name = 'user_progress' 
AND column_name = 'user_id';

-- Check what auth.uid() returns
SELECT auth.uid(), pg_typeof(auth.uid());

-- Check existing data in user_progress
SELECT user_id, pg_typeof(user_id) as user_id_type
FROM user_progress
LIMIT 5;
