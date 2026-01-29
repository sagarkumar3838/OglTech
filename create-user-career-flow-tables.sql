-- Create tables for user career flow and recommendations

-- 1. User Career Selections Table
CREATE TABLE IF NOT EXISTS public.user_career_selections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id)