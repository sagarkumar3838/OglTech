-- ============================================
-- SEED SAMPLE DASHBOARD DATA
-- Creates sample data to demonstrate dashboard features
-- ============================================

-- IMPORTANT: Replace 'YOUR_USER_ID' with your actual Firebase user ID
-- You can find it by:
-- 1. Opening browser console and typing: localStorage.getItem('user')
-- 2. Or checking the user_progress table for your user_id
-- 3. Or opening get-user-id.html in your browser

-- NOTE: Make sure you've run fix-all-career-tables-for-firebase.sql first!

-- ============================================
-- STEP 1: Get Career ID for OGL Content Developer
-- ============================================

DO $$
DECLARE
  v_user_id TEXT := 'YOUR_USER_ID'; -- REPLACE THIS WITH YOUR ACTUAL USER ID (keep the quotes!)
  v_career_id UUID;
BEGIN
  -- Validate user_id is not placeholder
  IF v_user_id = 'YOUR_USER_ID' THEN
    RAISE EXCEPTION 'Please replace YOUR_USER_ID with your actual Firebase user ID';
  END IF;

  -- Get OGL Content Developer career ID
  SELECT id INTO v_career_id FROM careers WHERE name = 'OGL Content Developer';

  IF v_career_id IS NULL THEN
    RAISE EXCEPTION 'Career not found. Please run create-career-skill-requirements.sql first.';
  END IF;

  -- ============================================
  -- STEP 2: Create Career Selection
  -- ============================================
  INSERT INTO user_career_selections (user_id, career_id, career_name, is_active, priority)
  VALUES (v_user_id, v_career_id, 'OGL Content Developer', true, 1)
  ON CONFLICT (user_id, career_id) DO NOTHING;

  -- ============================================
  -- STEP 3: Create Skill Progress
  -- ============================================
  
  -- HTML - Completed Basic, Failed Intermediate once, then passed
  INSERT INTO user_skill_progress (
    user_id, career_id, skill_name,
    easy_completed, easy_score,
    medium_completed, medium_score,
    hard_completed, hard_score,
    overall_completion
  ) VALUES (
    v_user_id, v_career_id, 'HTML',
    true, 85,
    true, 75,
    false, 0,
    67
  ) ON CONFLICT (user_id, career_id, skill_name) DO UPDATE SET
    easy_completed = EXCLUDED.easy_completed,
    easy_score = EXCLUDED.easy_score,
    medium_completed = EXCLUDED.medium_completed,
    medium_score = EXCLUDED.medium_score,
    overall_completion = EXCLUDED.overall_completion;

  -- CSS - Completed Basic, Failed Intermediate (still failing)
  INSERT INTO user_skill_progress (
    user_id, career_id, skill_name,
    easy_completed, easy_score,
    medium_completed, medium_score,
    hard_completed, hard_score,
    overall_completion
  ) VALUES (
    v_user_id, v_career_id, 'CSS',
    true, 80,
    false, 65,
    false, 0,
    33
  ) ON CONFLICT (user_id, career_id, skill_name) DO UPDATE SET
    easy_completed = EXCLUDED.easy_completed,
    easy_score = EXCLUDED.easy_score,
    medium_completed = EXCLUDED.medium_completed,
    medium_score = EXCLUDED.medium_score,
    overall_completion = EXCLUDED.overall_completion;

  -- JavaScript - Only completed Basic
  INSERT INTO user_skill_progress (
    user_id, career_id, skill_name,
    easy_completed, easy_score,
    medium_completed, medium_score,
    hard_completed, hard_score,
    overall_completion
  ) VALUES (
    v_user_id, v_career_id, 'JavaScript',
    true, 90,
    false, 0,
    false, 0,
    33
  ) ON CONFLICT (user_id, career_id, skill_name) DO UPDATE SET
    easy_completed = EXCLUDED.easy_completed,
    easy_score = EXCLUDED.easy_score,
    overall_completion = EXCLUDED.overall_completion;

  -- jQuery - Not started yet
  -- (No entry means not started)

  -- OGL Knowledge - Not started yet
  -- (No entry means not started)

  -- ============================================
  -- STEP 4: Create Test Results History
  -- ============================================

  -- HTML Tests
  -- First attempt - Basic - Passed
  INSERT INTO user_test_results (
    user_id, career_id, skill_name, level,
    score, total_questions, percentage, passed,
    time_taken, completed_at
  ) VALUES (
    v_user_id, v_career_id, 'HTML', 'easy',
    17, 20, 85, true,
    600, NOW() - INTERVAL '10 days'
  );

  -- Second attempt - Intermediate - Failed
  INSERT INTO user_test_results (
    user_id, career_id, skill_name, level,
    score, total_questions, percentage, passed,
    time_taken, completed_at
  ) VALUES (
    v_user_id, v_career_id, 'HTML', 'medium',
    13, 20, 65, false,
    720, NOW() - INTERVAL '8 days'
  );

  -- Third attempt - Intermediate - Passed
  INSERT INTO user_test_results (
    user_id, career_id, skill_name, level,
    score, total_questions, percentage, passed,
    time_taken, completed_at
  ) VALUES (
    v_user_id, v_career_id, 'HTML', 'medium',
    15, 20, 75, true,
    680, NOW() - INTERVAL '5 days'
  );

  -- CSS Tests
  -- First attempt - Basic - Passed
  INSERT INTO user_test_results (
    user_id, career_id, skill_name, level,
    score, total_questions, percentage, passed,
    time_taken, completed_at
  ) VALUES (
    v_user_id, v_career_id, 'CSS', 'easy',
    16, 20, 80, true,
    550, NOW() - INTERVAL '7 days'
  );

  -- Second attempt - Intermediate - Failed
  INSERT INTO user_test_results (
    user_id, career_id, skill_name, level,
    score, total_questions, percentage, passed,
    time_taken, completed_at
  ) VALUES (
    v_user_id, v_career_id, 'CSS', 'medium',
    12, 20, 60, false,
    800, NOW() - INTERVAL '4 days'
  );

  -- Third attempt - Intermediate - Failed again
  INSERT INTO user_test_results (
    user_id, career_id, skill_name, level,
    score, total_questions, percentage, passed,
    time_taken, completed_at
  ) VALUES (
    v_user_id, v_career_id, 'CSS', 'medium',
    13, 20, 65, false,
    750, NOW() - INTERVAL '2 days'
  );

  -- JavaScript Tests
  -- First attempt - Basic - Passed with high score
  INSERT INTO user_test_results (
    user_id, career_id, skill_name, level,
    score, total_questions, percentage, passed,
    time_taken, completed_at
  ) VALUES (
    v_user_id, v_career_id, 'JavaScript', 'easy',
    18, 20, 90, true,
    500, NOW() - INTERVAL '3 days'
  );

  RAISE NOTICE 'Sample data created successfully!';
  RAISE NOTICE 'User ID: %', v_user_id;
  RAISE NOTICE 'Career: OGL Content Developer';
  RAISE NOTICE 'Progress: 2/5 skills completed (HTML, CSS Basic)';
  RAISE NOTICE 'Weak Area: CSS Intermediate (failed twice)';
  RAISE NOTICE 'Total Tests: 7 (5 passed, 2 failed)';

END $$;

-- ============================================
-- VERIFY THE DATA
-- ============================================

-- Check career selection
SELECT 
  'Career Selection' as data_type,
  career_name,
  is_active
FROM user_career_selections
WHERE user_id = 'YOUR_USER_ID';

-- Check skill progress
SELECT 
  'Skill Progress' as data_type,
  skill_name,
  easy_completed,
  easy_score,
  medium_completed,
  medium_score,
  overall_completion
FROM user_skill_progress
WHERE user_id = 'YOUR_USER_ID'
ORDER BY skill_name;

-- Check test results
SELECT 
  'Test Results' as data_type,
  skill_name,
  level,
  percentage,
  passed,
  completed_at
FROM user_test_results
WHERE user_id = 'YOUR_USER_ID'
ORDER BY completed_at DESC;

-- Summary
SELECT 
  'Summary' as info,
  COUNT(*) as total_tests,
  SUM(CASE WHEN passed THEN 1 ELSE 0 END) as passed_tests,
  SUM(CASE WHEN NOT passed THEN 1 ELSE 0 END) as failed_tests,
  ROUND(AVG(percentage), 2) as avg_score
FROM user_test_results
WHERE user_id = 'YOUR_USER_ID';
