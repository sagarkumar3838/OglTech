-- ============================================
-- CHECK TEST RESULTS AND PROGRESS
-- See if your test data is being saved
-- ============================================

-- 1. Check scorecards (you should see your 0% HTML test here)
SELECT 
  'Scorecards' as table_name,
  skill,
  level_attempted,
  overall_score,
  correct_count,
  total_questions,
  created_at
FROM scorecards
WHERE user_id = auth.uid()::text
ORDER BY created_at DESC
LIMIT 5;

-- 2. Check submissions
SELECT 
  'Submissions' as table_name,
  evaluation_id,
  candidate_name,
  submitted_at
FROM submissions
WHERE user_id = auth.uid()::text
ORDER BY submitted_at DESC
LIMIT 5;

-- 3. Check evaluations
SELECT 
  'Evaluations' as table_name,
  skill,
  level,
  question_count,
  status,
  created_at
FROM evaluations
WHERE user_id = auth.uid()::text
ORDER BY created_at DESC
LIMIT 5;

-- 4. Check user_progress (this is probably empty)
SELECT 
  'User Progress' as table_name,
  career_id,
  skill_progress,
  overall_completion,
  created_at
FROM user_progress
WHERE user_id = auth.uid()
LIMIT 1;

-- 5. Check if user_progress exists at all
SELECT 
  'Total user_progress records' as info,
  COUNT(*) as count
FROM user_progress;
