-- ============================================
-- FIX USER PROFILES RLS POLICIES
-- Run this in Supabase SQL Editor to fix 406 errors
-- ============================================

-- First, let's see what policies exist
SELECT policyname FROM pg_policies WHERE tablename = 'user_profiles';

-- Drop ALL existing policies (with all possible name variations)
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON user_profiles;
DROP POLICY IF EXISTS "Public can view profiles" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON user_profiles;

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create new policies with proper permissions

-- 1. Allow users to view their own profile
CREATE POLICY "user_profiles_select_own"
ON user_profiles
FOR SELECT
TO authenticated
USING (auth.uid()::text = user_id);

-- 2. Allow users to insert their own profile
CREATE POLICY "user_profiles_insert_own"
ON user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id);

-- 3. Allow users to update their own profile
CREATE POLICY "user_profiles_update_own"
ON user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- 4. Allow authenticated users to view all profiles (for leaderboard)
CREATE POLICY "user_profiles_select_all"
ON user_profiles
FOR SELECT
TO authenticated
USING (true);

-- Verify policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY policyname;

-- Test query (should work now)
SELECT COUNT(*) FROM user_profiles;
