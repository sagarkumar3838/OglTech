-- Check which tables exist in your database
SELECT 
  table_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = t.table_name AND column_name = 'user_id'
    ) THEN 'YES'
    ELSE 'NO'
  END as has_user_id_column,
  (
    SELECT data_type 
    FROM information_schema.columns 
    WHERE table_name = t.table_name AND column_name = 'user_id'
  ) as user_id_type
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  AND table_name IN (
    'user_progress',
    'scorecards',
    'evaluation_sessions',
    'evaluation_submissions',
    'user_career_selections',
    'user_test_results',
    'user_skill_progress',
    'questions',
    'careers',
    'media'
  )
ORDER BY table_name;
