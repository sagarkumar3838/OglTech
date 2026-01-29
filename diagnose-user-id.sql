-- Check what type user_id actually is
SELECT 
    column_name,
    data_type,
    udt_name
FROM information_schema.columns
WHERE table_name = 'user_progress' 
AND column_name = 'user_id';

-- Check sample data
SELECT user_id FROM user_progress LIMIT 3;

-- Check auth.uid() type
SELECT auth.uid() as current_user_id, pg_typeof(auth.uid()) as type;
