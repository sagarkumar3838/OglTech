-- ============================================
-- GET YOUR USER ID
-- Run this to find your Firebase user ID
-- ============================================

-- Method 1: From user_progress table
SELECT DISTINCT 
  'From user_progress' as source,
  user_id,
  'Copy this user_id value' as instruction
FROM user_progress 
LIMIT 1;

-- Method 2: From evaluations table
SELECT DISTINCT 
  'From evaluations' as source,
  user_id,
  'Copy this user_id value' as instruction
FROM evaluations 
LIMIT 1;

-- Method 3: From submissions table
SELECT DISTINCT 
  'From submissions' as source,
  user_id,
  'Copy this user_id value' as instruction
FROM submissions 
LIMIT 1;

-- Method 4: From scorecards table
SELECT DISTINCT 
  'From scorecards' as source,
  user_id,
  'Copy this user_id value' as instruction
FROM scorecards 
LIMIT 1;

-- If all above return empty, you need to:
-- 1. Make sure you're logged in to the app
-- 2. Take at least one test
-- 3. Or check browser console: localStorage.getItem('user')
