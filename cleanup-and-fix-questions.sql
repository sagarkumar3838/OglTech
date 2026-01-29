-- ============================================
-- Cleanup and Fix Questions Database
-- ============================================

-- Step 1: Delete unwanted skills (typescript, reactjs, python, nodejs, etc.)
DELETE FROM questions 
WHERE skill NOT IN ('html', 'css', 'javascript', 'jquery', 'devtools', 'oglknowledge');

-- Step 2: Convert level names to match the app
UPDATE questions SET level = 'easy' WHERE level IN ('BASIC', 'basic');
UPDATE questions SET level = 'medium' WHERE level IN ('INTERMEDIATE', 'intermediate');
UPDATE questions SET level = 'hard' WHERE level IN ('ADVANCED', 'advanced');

-- Step 3: Standardize skill names to lowercase
UPDATE questions SET skill = LOWER(skill);

-- Step 4: Remove any duplicate questions (same question text)
DELETE FROM questions a
USING questions b
WHERE a.id > b.id 
AND a.question = b.question 
AND a.skill = b.skill 
AND a.level = b.level;

-- Step 5: Verify the cleanup
SELECT 
  skill, 
  level, 
  COUNT(*) as question_count 
FROM questions 
GROUP BY skill, level 
ORDER BY skill, level;

-- Step 6: Show total count
SELECT COUNT(*) as total_questions FROM questions;

-- Step 7: Show breakdown by skill
SELECT 
  skill, 
  COUNT(*) as total_questions,
  COUNT(CASE WHEN level = 'easy' THEN 1 END) as easy_count,
  COUNT(CASE WHEN level = 'medium' THEN 1 END) as medium_count,
  COUNT(CASE WHEN level = 'hard' THEN 1 END) as hard_count,
  COUNT(CASE WHEN level = 'advanced' THEN 1 END) as advanced_count
FROM questions 
GROUP BY skill 
ORDER BY skill;
