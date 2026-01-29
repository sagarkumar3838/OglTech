-- ============================================
-- DIAGNOSE 406 ERROR
-- Run this to check what's causing the issue
-- ============================================

-- Check if tables exist
SELECT 
    'media' as table_name,
    EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'media'
    ) as exists;

SELECT 
    'user_progress' as table_name,
    EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'user_progress'
    ) as exists;

-- Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('media', 'user_progress');

-- Check policies on media table
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
AND tablename = 'media';

-- Check policies on user_progress table
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
AND tablename = 'user_progress';

-- Check if there's any data
SELECT 'media' as table_name, COUNT(*) as row_count FROM public.media;
SELECT 'user_progress' as table_name, COUNT(*) as row_count FROM public.user_progress;
