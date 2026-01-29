-- ============================================
-- CHECK user_id TYPE IN ALL TABLES
-- This will tell us exactly what type each table uses
-- ============================================

SELECT 
  table_name,
  column_name,
  data_type,
  udt_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name = 'user_id'
ORDER BY table_name;

-- Also check career_id type
SELECT 
  table_name,
  column_name,
  data_type,
  udt_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name = 'career_id'
ORDER BY table_name;
