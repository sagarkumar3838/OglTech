-- ============================================
-- CREATE PRACTICE QUESTIONS DATABASE
-- ============================================
-- This script creates a complete database for practice questions
-- with all three difficulty levels (beginner, intermediate, advanced)

-- Drop existing table if needed (uncomment if you want fresh start)
-- DROP TABLE IF EXISTS practice_questions CASCADE;

-- Create the practice_questions table
CREATE TABLE IF NOT EXISTS practice_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced', 'BASIC', 'INTERMEDIATE', 'ADVANCED')),
    type TEXT NOT NULL DEFAULT 'mcq' CHECK (type IN ('mcq', 'fillblank', 'code', 'truefalse')),
    question_text TEXT NOT NULL,
    option_a TEXT,
    option_b TEXT,
    option_c TEXT,
    option_d TEXT,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    topic TEXT,
    subtopic TEXT,
    
    -- Multimedia learning resources
    mdn_link TEXT,
    youtube_english TEXT,
    youtube_hindi TEXT,
    youtube_kannada TEXT,
    youtube_tamil TEXT,
    youtube_telugu TEXT,
    
    -- Additional metadata
    difficulty_score INTEGER DEFAULT 1 CHECK (difficulty_score BETWEEN 1 AND 10),
    points INTEGER DEFAULT 10,
    time_limit INTEGER DEFAULT 60,
    tags TEXT[],
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_practice_questions_skill ON practice_questions(skill);
CREATE INDEX IF NOT EXISTS idx_practice_questions_level ON practice_questions(level);
CREATE INDEX IF NOT EXISTS idx_practice_questions_type ON practice_questions(type);
CREATE INDEX IF NOT EXISTS idx_practice_questions_skill_level ON practice_questions(skill, level);
CREATE INDEX IF NOT EXISTS idx_practice_questions_active ON practice_questions(is_active);
CREATE INDEX IF NOT EXISTS idx_practice_questions_tags ON practice_questions USING GIN(tags);

-- Enable Row Level Security (RLS)
ALTER TABLE practice_questions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
DROP POLICY IF EXISTS "Allow public read access to practice questions" ON practice_questions;
CREATE POLICY "Allow public read access to practice questions"
    ON practice_questions
    FOR SELECT
    USING (is_active = TRUE);

-- Create RLS policy for authenticated users to read all questions
DROP POLICY IF EXISTS "Allow authenticated users to read all questions" ON practice_questions;
CREATE POLICY "Allow authenticated users to read all questions"
    ON practice_questions
    FOR SELECT
    TO authenticated
    USING (TRUE);

-- Create RLS policy for service role to manage questions
DROP POLICY IF EXISTS "Allow service role full access" ON practice_questions;
CREATE POLICY "Allow service role full access"
    ON practice_questions
    FOR ALL
    TO service_role
    USING (TRUE)
    WITH CHECK (TRUE);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_practice_questions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_practice_questions_updated_at_trigger ON practice_questions;
CREATE TRIGGER update_practice_questions_updated_at_trigger
    BEFORE UPDATE ON practice_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_practice_questions_updated_at();

-- Create view for question statistics
CREATE OR REPLACE VIEW practice_questions_stats AS
SELECT 
    skill,
    level,
    type,
    COUNT(*) as total_questions,
    COUNT(DISTINCT topic) as total_topics
FROM practice_questions
WHERE is_active = TRUE
GROUP BY skill, level, type
ORDER BY skill, level, type;

-- Grant permissions
GRANT SELECT ON practice_questions TO anon, authenticated;
GRANT ALL ON practice_questions TO service_role;
GRANT SELECT ON practice_questions_stats TO anon, authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Practice Questions Database created successfully!';
    RAISE NOTICE 'Table: practice_questions';
    RAISE NOTICE 'Ready to import questions from CSV files';
END $$;
