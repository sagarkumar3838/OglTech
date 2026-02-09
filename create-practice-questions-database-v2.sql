-- ============================================
-- CREATE PRACTICE QUESTIONS DATABASE V2
-- ============================================
-- Updated schema to match your CSV format:
-- skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu

-- Drop existing table if needed (uncomment if you want fresh start)
-- DROP TABLE IF EXISTS practice_questions CASCADE;

-- Create the practice_questions table
CREATE TABLE IF NOT EXISTS practice_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Core question fields
    skill TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('Basic', 'Intermediate', 'Advanced', 'beginner', 'intermediate', 'advanced', 'BASIC', 'INTERMEDIATE', 'ADVANCED')),
    question_text TEXT NOT NULL,
    
    -- Category/Topic fields (these are NOT MCQ options in your format)
    option_a TEXT,  -- Category 1
    option_b TEXT,  -- Category 2
    option_c TEXT,  -- Category 3
    option_d TEXT,  -- Additional info
    
    -- Answer and explanation
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    topic TEXT,
    
    -- Multimedia learning resources
    mdn_link TEXT,
    youtube_english TEXT,
    youtube_hindi TEXT,
    youtube_kannada TEXT,
    youtube_tamil TEXT,
    youtube_telugu TEXT,
    
    -- Additional metadata
    question_type TEXT DEFAULT 'descriptive' CHECK (question_type IN ('mcq', 'fillblank', 'code', 'truefalse', 'descriptive')),
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
CREATE INDEX IF NOT EXISTS idx_practice_questions_skill_level ON practice_questions(skill, level);
CREATE INDEX IF NOT EXISTS idx_practice_questions_active ON practice_questions(is_active);
CREATE INDEX IF NOT EXISTS idx_practice_questions_topic ON practice_questions(topic);
CREATE INDEX IF NOT EXISTS idx_practice_questions_tags ON practice_questions USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_practice_questions_created ON practice_questions(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE practice_questions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to practice questions" ON practice_questions;
DROP POLICY IF EXISTS "Allow authenticated users to read all questions" ON practice_questions;
DROP POLICY IF EXISTS "Allow service role full access" ON practice_questions;
DROP POLICY IF EXISTS "Allow anon read access" ON practice_questions;

-- Create RLS policy for anonymous read access
CREATE POLICY "Allow anon read access"
    ON practice_questions
    FOR SELECT
    TO anon
    USING (is_active = TRUE);

-- Create RLS policy for authenticated users to read all questions
CREATE POLICY "Allow authenticated users to read all questions"
    ON practice_questions
    FOR SELECT
    TO authenticated
    USING (TRUE);

-- Create RLS policy for service role to manage questions
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
    COUNT(*) as total_questions,
    COUNT(DISTINCT topic) as total_topics,
    COUNT(mdn_link) as questions_with_mdn,
    COUNT(youtube_english) as questions_with_video,
    MIN(created_at) as first_added,
    MAX(created_at) as last_added
FROM practice_questions
WHERE is_active = TRUE
GROUP BY skill, level
ORDER BY skill, level;

-- Create view for multimedia coverage
CREATE OR REPLACE VIEW practice_questions_multimedia_stats AS
SELECT 
    skill,
    COUNT(*) as total_questions,
    COUNT(mdn_link) as with_mdn,
    COUNT(youtube_english) as with_english,
    COUNT(youtube_hindi) as with_hindi,
    COUNT(youtube_kannada) as with_kannada,
    COUNT(youtube_tamil) as with_tamil,
    COUNT(youtube_telugu) as with_telugu,
    ROUND(COUNT(mdn_link) * 100.0 / COUNT(*), 2) as mdn_coverage_percent,
    ROUND(COUNT(youtube_english) * 100.0 / COUNT(*), 2) as video_coverage_percent
FROM practice_questions
WHERE is_active = TRUE
GROUP BY skill
ORDER BY skill;

-- Grant permissions
GRANT SELECT ON practice_questions TO anon, authenticated;
GRANT ALL ON practice_questions TO service_role;
GRANT SELECT ON practice_questions_stats TO anon, authenticated;
GRANT SELECT ON practice_questions_multimedia_stats TO anon, authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Practice Questions Database V2 created successfully!';
    RAISE NOTICE 'Table: practice_questions';
    RAISE NOTICE 'Views: practice_questions_stats, practice_questions_multimedia_stats';
    RAISE NOTICE 'Ready to import questions from CSV files';
    RAISE NOTICE '';
    RAISE NOTICE 'CSV Format Expected:';
    RAISE NOTICE 'skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic,mdn_link,youtube_english,youtube_hindi,youtube_kannada,youtube_tamil,youtube_telugu';
END $$;
