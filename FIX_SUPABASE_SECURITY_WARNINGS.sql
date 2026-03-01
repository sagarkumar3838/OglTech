-- FIX ALL SUPABASE SECURITY WARNINGS
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. FIX: Exposed Auth Users
-- ============================================
-- This prevents unauthorized access to auth.users table

-- Revoke public access to auth.users
REVOKE ALL ON auth.users FROM public;
REVOKE ALL ON auth.users FROM anon;
REVOKE ALL ON auth.users FROM authenticated;

-- Only allow service_role to access auth.users
GRANT SELECT ON auth.users TO service_role;

-- ============================================
-- 2. FIX: RLS Not Enabled on Public Tables
-- ============================================

-- Enable RLS on public.user_dashboard_stats
ALTER TABLE public.user_dashboard_stats ENABLE ROW LEVEL SECURITY;

-- Enable RLS on public.practice_questions
ALTER TABLE public.practice_questions ENABLE ROW LEVEL SECURITY;

-- Enable RLS on public.practice_questions_stats (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'practice_questions_stats') THEN
        ALTER TABLE public.practice_questions_stats ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Enable RLS on public.practice_questions_multimedia_stats (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'practice_questions_multimedia_stats') THEN
        ALTER TABLE public.practice_questions_multimedia_stats ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- ============================================
-- 3. CREATE SECURE RLS POLICIES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own dashboard stats" ON public.user_dashboard_stats;
DROP POLICY IF EXISTS "Users can insert their own dashboard stats" ON public.user_dashboard_stats;
DROP POLICY IF EXISTS "Users can update their own dashboard stats" ON public.user_dashboard_stats;
DROP POLICY IF EXISTS "Users can delete their own dashboard stats" ON public.user_dashboard_stats;

DROP POLICY IF EXISTS "Anyone can view practice questions" ON public.practice_questions;
DROP POLICY IF EXISTS "Service role can manage practice questions" ON public.practice_questions;

-- ============================================
-- POLICY 1: user_dashboard_stats
-- ============================================

-- Users can only see their own stats
CREATE POLICY "Users can view their own dashboard stats"
ON public.user_dashboard_stats
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own stats
CREATE POLICY "Users can insert their own dashboard stats"
ON public.user_dashboard_stats
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own stats
CREATE POLICY "Users can update their own dashboard stats"
ON public.user_dashboard_stats
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own stats
CREATE POLICY "Users can delete their own dashboard stats"
ON public.user_dashboard_stats
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- POLICY 2: practice_questions
-- ============================================

-- Anyone (including anonymous) can view practice questions
CREATE POLICY "Anyone can view practice questions"
ON public.practice_questions
FOR SELECT
TO public
USING (true);

-- Only service role can insert/update/delete questions
CREATE POLICY "Service role can manage practice questions"
ON public.practice_questions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- 4. FIX: Security Definer Views
-- ============================================

-- Drop and recreate views with proper security

-- Drop existing views if they exist
DROP VIEW IF EXISTS public.user_dashboard_stats CASCADE;
DROP VIEW IF EXISTS public.practice_questions_stats CASCADE;
DROP VIEW IF EXISTS public.practice_questions_multimedia_stats CASCADE;

-- Note: If these are tables, not views, the above commands will fail safely
-- The RLS policies above will secure them

-- ============================================
-- 5. VERIFY SECURITY SETTINGS
-- ============================================

-- Check which tables have RLS enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check all policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================
-- 6. ADDITIONAL SECURITY MEASURES
-- ============================================

-- Ensure anon and authenticated roles have proper permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.practice_questions TO anon, authenticated;
GRANT ALL ON public.user_dashboard_stats TO authenticated;

-- Revoke unnecessary permissions
REVOKE ALL ON auth.users FROM public, anon, authenticated;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Run these to verify everything is secure:

-- 1. Check RLS is enabled on all public tables
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = false;
-- Should return 0 rows

-- 2. Check auth.users is not accessible
SELECT has_table_privilege('anon', 'auth.users', 'SELECT');
-- Should return false

-- 3. Check policies exist
SELECT COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public';
-- Should return > 0

COMMIT;
