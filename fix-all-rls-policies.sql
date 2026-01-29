-- ============================================
-- Fix ALL RLS Policies - Complete Solution
-- ============================================

-- ============================================
-- 1. FIX USER_PROGRESS TABLE
-- ============================================

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON user_progress;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON user_progress;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON user_progress;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON user_progress;

-- Create new policies (UUID comparison)
CREATE POLICY "Users can view their own progress"
ON user_progress FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
ON user_progress FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON user_progress FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add missing column
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS overall_completion INTEGER DEFAULT 0;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON user_progress TO authenticated;

-- ============================================
-- 2. FIX MEDIA TABLE
-- ============================================

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Public read access for media" ON media;
DROP POLICY IF EXISTS "Enable read access for all users" ON media;

-- Create public read policy (media should be publicly readable)
CREATE POLICY "Public read access for media"
ON media FOR SELECT
TO authenticated, anon
USING (true);

-- Grant permissions
GRANT SELECT ON media TO authenticated, anon;

-- ============================================
-- 3. FIX OTHER COMMON TABLES
-- ============================================

-- Careers table (public read)
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access for careers" ON careers;
CREATE POLICY "Public read access for careers"
ON careers FOR SELECT TO authenticated, anon USING (true);
GRANT SELECT ON careers TO authenticated, anon;

-- Questions table (public read for verified questions)
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access for verified questions" ON questions;
CREATE POLICY "Public read access for verified questions"
ON questions FOR SELECT TO authenticated, anon
USING (verified = true);
GRANT SELECT ON questions TO authenticated, anon;

-- Evaluations table (users can only see their own)
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own evaluations" ON evaluations;
DROP POLICY IF EXISTS "Users can insert their own evaluations" ON evaluations;

CREATE POLICY "Users can view their own evaluations"
ON evaluations FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own evaluations"
ON evaluations FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT ON evaluations TO authenticated;

-- Submissions table (users can only see their own)
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own submissions" ON submissions;
DROP POLICY IF EXISTS "Users can insert their own submissions" ON submissions;

CREATE POLICY "Users can view their own submissions"
ON submissions FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own submissions"
ON submissions FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT ON submissions TO authenticated;

-- ============================================
-- 4. GRANT SEQUENCE PERMISSIONS
-- ============================================
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================
-- 5. VERIFY POLICIES
-- ============================================
SELECT 
    schemaname,
    tablename, 
    policyname, 
    cmd,
    roles
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
