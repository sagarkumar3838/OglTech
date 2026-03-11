-- ============================================================================
-- FIX CASE SENSITIVITY FOR ALL SKILLS
-- ============================================================================
-- This script normalizes all skill names to lowercase to fix UI display issues
-- Run this ONCE to merge all case variations under consistent lowercase names
-- ============================================================================

-- STEP 1: Check current case sensitivity issues
-- ============================================================================
SELECT 
    skill,
    COUNT(DISTINCT skill) OVER (PARTITION BY LOWER(skill)) as variations,
    level,
    COUNT(*) as count
FROM practice_questions
GROUP BY skill, level
HAVING COUNT(DISTINCT skill) OVER (PARTITION BY LOWER(skill)) > 1
ORDER BY LOWER(skill), level;

-- This shows skills with multiple case variations


-- STEP 2: See all unique skill names (before fix)
-- ============================================================================
SELECT DISTINCT skill, COUNT(*) as total_questions
FROM practice_questions
GROUP BY skill
ORDER BY skill;


-- STEP 3: NORMALIZE ALL SKILLS TO LOWERCASE
-- ============================================================================
-- This is the main fix - converts all skill names to lowercase

UPDATE practice_questions
SET skill = LOWER(skill);

-- Expected: Updates all rows where skill has uppercase letters


-- STEP 4: Verify the fix
-- ============================================================================
SELECT 
    skill,
    level,
    COUNT(*) as count
FROM practice_questions
GROUP BY skill, level
ORDER BY skill, 
    CASE level
        WHEN 'beginner' THEN 1
        WHEN 'intermediate' THEN 2
        WHEN 'advanced' THEN 3
    END;


-- STEP 5: Check for any remaining case variations
-- ============================================================================
SELECT 
    LOWER(skill) as normalized_skill,
    COUNT(DISTINCT skill) as case_variations,
    SUM(COUNT(*)) OVER (PARTITION BY LOWER(skill)) as total_questions
FROM practice_questions
GROUP BY skill
HAVING COUNT(DISTINCT skill) > 1
ORDER BY normalized_skill;

-- Expected: 0 rows (no more case variations)


-- STEP 6: Summary by skill (after fix)
-- ============================================================================
SELECT 
    skill,
    COUNT(CASE WHEN level = 'beginner' THEN 1 END) as beginner,
    COUNT(CASE WHEN level = 'intermediate' THEN 1 END) as intermediate,
    COUNT(CASE WHEN level = 'advanced' THEN 1 END) as advanced,
    COUNT(*) as total
FROM practice_questions
GROUP BY skill
ORDER BY skill;


-- ============================================================================
-- EXPECTED SKILLS (all lowercase):
-- ============================================================================
-- angular, ansible, aws, azure, cpp, csharp, css, cypress, devtools,
-- docker, flutter, gcp, git, glsl, go, html, java, javascript, jest,
-- kotlin, kubernetes, linux, mongodb, nodejs, opengl, oracle, php,
-- postgresql, python, react, reactnative, redis, ruby, rust, selenium,
-- sql, swift, terraform, typescript, unity, unreal, vscode, vue, webpack
-- ============================================================================
