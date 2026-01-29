-- ============================================
-- SIMPLE CAREER SELECTION
-- Just select a career to see the dashboard
-- No sample test data needed
-- ============================================

-- STEP 1: Get your user ID from one of these queries
-- Run each until you find your user_id:

-- Option A: From user_progress
SELECT DISTINCT user_id FROM user_progress LIMIT 1;

-- Option B: From evaluations  
SELECT DISTINCT user_id FROM evaluations LIMIT 1;

-- Option C: From submissions
SELECT DISTINCT user_id FROM submissions LIMIT 1;

-- ============================================
-- STEP 2: Once you have your user_id, replace it below and run
-- ============================================

-- Replace 'PASTE_YOUR_USER_ID_HERE' with the user_id from Step 1
DO $$
DECLARE
  v_user_id TEXT := 'PASTE_YOUR_USER_ID_HERE';  -- REPLACE THIS!
  v_career_id UUID;
  v_career_name TEXT := 'OGL Content Developer';  -- Change this if you want a different career
BEGIN
  -- Validate
  IF v_user_id = 'PASTE_YOUR_USER_ID_HERE' THEN
    RAISE EXCEPTION 'Please replace PASTE_YOUR_USER_ID_HERE with your actual user ID from Step 1';
  END IF;

  -- Get career ID
  SELECT id INTO v_career_id FROM careers WHERE name = v_career_name;

  IF v_career_id IS NULL THEN
    RAISE EXCEPTION 'Career "%" not found. Available careers: OGL Content Developer, OGL Tester, OGL Frontend Developer, OGL Backend Developer, OGL DevOps Developer, OGL Cloud Developer, OGL QA Developer, OGL Developer', v_career_name;
  END IF;

  -- Insert career selection
  INSERT INTO user_career_selections (user_id, career_id, career_name, is_active, priority)
  VALUES (v_user_id, v_career_id, v_career_name, true, 1)
  ON CONFLICT (user_id, career_id) 
  DO UPDATE SET is_active = true, selected_at = NOW();

  RAISE NOTICE 'Success! Career "%" selected for user %', v_career_name, v_user_id;
  RAISE NOTICE 'Go to http://localhost:3000/dashboard to see your career requirements';
  RAISE NOTICE 'Click "Start Test" on any skill to begin tracking your progress';
END $$;

-- ============================================
-- VERIFY: Check your career selection
-- ============================================
SELECT 
  user_id,
  career_name,
  selected_at,
  is_active
FROM user_career_selections
WHERE user_id = 'PASTE_YOUR_USER_ID_HERE';  -- Replace this too!

-- ============================================
-- AVAILABLE CAREERS
-- ============================================
SELECT 
  name as career_name,
  description,
  experience_level
FROM careers
ORDER BY name;
