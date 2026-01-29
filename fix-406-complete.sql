-- ============================================
-- COMPLETE FIX FOR 406 ERRORS
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. CREATE MEDIA TABLE (if not exists)
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    usage_type TEXT NOT NULL CHECK (usage_type IN ('hero', 'parallax')),
    position INTEGER NOT NULL DEFAULT 0,
    alt_text TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CREATE USER_PROGRESS TABLE (if not exists)
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    career_id UUID NOT NULL,
    skill_progress JSONB DEFAULT '[]'::jsonb,
    overall_completion NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, career_id)
);

-- 3. ENABLE RLS ON BOTH TABLES
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- 4. DROP EXISTING POLICIES (if any)
DROP POLICY IF EXISTS "media_public_read" ON public.media;
DROP POLICY IF EXISTS "media_admin_all" ON public.media;
DROP POLICY IF EXISTS "user_progress_own_read" ON public.user_progress;
DROP POLICY IF EXISTS "user_progress_own_write" ON public.user_progress;
DROP POLICY IF EXISTS "user_progress_admin_all" ON public.user_progress;

-- 5. CREATE MEDIA POLICIES (PUBLIC READ ACCESS)
-- Anyone can read active media (no auth required)
CREATE POLICY "media_public_read"
ON public.media
FOR SELECT
TO public
USING (is_active = true);

-- Authenticated users can manage media (for admin features)
CREATE POLICY "media_admin_all"
ON public.media
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 6. CREATE USER_PROGRESS POLICIES
-- Users can read their own progress
CREATE POLICY "user_progress_own_read"
ON public.user_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert/update their own progress
CREATE POLICY "user_progress_own_write"
ON public.user_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_progress_own_update"
ON public.user_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admin can see all progress (optional)
CREATE POLICY "user_progress_admin_all"
ON public.user_progress
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@admin.%'
  )
);

-- 7. CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_media_usage_type ON public.media(usage_type, is_active);
CREATE INDEX IF NOT EXISTS idx_media_position ON public.media(position);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_career_id ON public.user_progress(career_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_career ON public.user_progress(user_id, career_id);

-- 8. CREATE UPDATE TRIGGER FOR updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_media_updated_at ON public.media;
CREATE TRIGGER update_media_updated_at
    BEFORE UPDATE ON public.media
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_progress_updated_at ON public.user_progress;
CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON public.user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 9. GRANT PERMISSIONS
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.media TO anon, authenticated;
GRANT ALL ON public.media TO authenticated;
GRANT ALL ON public.user_progress TO authenticated;

-- 10. VERIFY SETUP
SELECT 'Media table exists' as status, COUNT(*) as row_count FROM public.media;
SELECT 'User progress table exists' as status, COUNT(*) as row_count FROM public.user_progress;
SELECT 'RLS enabled on media' as status, relrowsecurity as enabled FROM pg_class WHERE relname = 'media';
SELECT 'RLS enabled on user_progress' as status, relrowsecurity as enabled FROM pg_class WHERE relname = 'user_progress';
