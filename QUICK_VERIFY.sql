-- Quick verification - Copy and run this now!

SELECT 
  policyname,
  cmd as operation
FROM pg_policies 
WHERE tablename = 'user_progress'
ORDER BY cmd;

-- Expected: 4 rows showing SELECT, INSERT, UPDATE, DELETE
-- If you see 4 policies, the fix worked! ✅
