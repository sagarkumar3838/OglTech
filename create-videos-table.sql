-- Create videos table for storing hero and parallax videos
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  video_type TEXT NOT NULL CHECK (video_type IN ('hero', 'parallax')),
  position INTEGER DEFAULT 0,
  alt_text TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_videos_type_active ON public.videos(video_type, is_active);
CREATE INDEX IF NOT EXISTS idx_videos_position ON public.videos(position);

-- Enable Row Level Security
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access to videos"
  ON public.videos
  FOR SELECT
  USING (is_active = true);

-- Create policy for authenticated users to manage videos (admin only)
CREATE POLICY "Allow authenticated users to manage videos"
  ON public.videos
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert default videos
INSERT INTO public.videos (title, description, video_url, video_type, position, alt_text) VALUES
  ('Hero Background Video', 'Main hero section background video', '/assets/images/206779_small.mp4', 'hero', 1, 'Team collaboration and learning'),
  ('Coding Development', 'Parallax video showing coding and development', 'https://cdn.pixabay.com/video/2022/11/07/138680-768748035_tiny.mp4', 'parallax', 1, 'Coding and development'),
  ('Technical Assessment', 'Parallax video showing technical assessment', 'https://cdn.pixabay.com/video/2023/04/28/160827-822725703_tiny.mp4', 'parallax', 2, 'Technical assessment'),
  ('Team Collaboration', 'Parallax video showing team collaboration', 'https://cdn.pixabay.com/video/2022/12/05/142408-779071817_tiny.mp4', 'parallax', 3, 'Team collaboration'),
  ('Developer Workspace', 'Parallax video showing developer workspace', 'https://cdn.pixabay.com/video/2023/08/08/175206-853155969_tiny.mp4', 'parallax', 4, 'Developer workspace')
ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE public.videos IS 'Stores video URLs for hero and parallax sections';
COMMENT ON COLUMN public.videos.video_type IS 'Type of video: hero (main background) or parallax (scrolling videos)';
COMMENT ON COLUMN public.videos.position IS 'Display order for parallax videos';
