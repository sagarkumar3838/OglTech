-- Create media table for both videos and images
-- This replaces the videos table with a more flexible media table

-- Drop the old videos table if you want to start fresh (OPTIONAL - comment out if you want to keep existing data)
-- DROP TABLE IF EXISTS public.videos CASCADE;

-- Create media table (supports both images and videos)
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  usage_type TEXT NOT NULL CHECK (usage_type IN ('hero', 'parallax')),
  position INTEGER NOT NULL DEFAULT 1,
  alt_text TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_media_usage_type ON public.media(usage_type);
CREATE INDEX IF NOT EXISTS idx_media_is_active ON public.media(is_active);
CREATE INDEX IF NOT EXISTS idx_media_position ON public.media(position);

-- Enable Row Level Security
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public media are viewable by everyone" ON public.media;
DROP POLICY IF EXISTS "Authenticated users can manage media" ON public.media;

-- Create RLS policies
-- Anyone can read active media
CREATE POLICY "Public media are viewable by everyone"
ON public.media FOR SELECT
USING (is_active = true);

-- Only authenticated users can insert/update/delete
CREATE POLICY "Authenticated users can manage media"
ON public.media FOR ALL
USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT SELECT ON public.media TO anon, authenticated;
GRANT ALL ON public.media TO authenticated;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_media_updated_at ON public.media;

CREATE TRIGGER update_media_updated_at
    BEFORE UPDATE ON public.media
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verify table was created
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'media'
ORDER BY ordinal_position;
