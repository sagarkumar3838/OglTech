-- Fix Scorecards Table RLS Policies
-- This ensures users can insert their own scorecards

-- Check current RLS status
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'scorecards';

-- Check existing policies
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
WHERE tablename = 'scorecards';

-- Drop existing policies if any
DROP POLICY IF EXISTS scorecards_select_policy ON scorecards;
DROP POLICY IF EXISTS scorecards_insert_policy ON scorecards;
DROP POLICY IF EXISTS scorecards_update_policy ON scorecards;
DROP POLICY IF EXISTS scorecards_delete_policy ON scorecards;

-- Enable RLS
ALTER TABLE scorecards ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
-- Note: user_id is TEXT, auth.uid() is UUID, so we cast both to text for comparison

-- SELECT: Users can view their own scorecards
CREATE POLICY scorecards_select_policy ON scorecards
  FOR SELECT
  TO authenticated
  USING (user_id::text = (auth.uid())::text);

-- INSERT: Users can create their own scorecards
CREATE POLICY scorecards_insert_policy ON scorecards
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id::text = (auth.uid())::text);

-- UPDATE: Users can update their own scorecards
CREATE POLICY scorecards_update_policy ON scorecards
  FOR UPDATE
  TO authenticated
  USING (user_id::text = (auth.uid())::text)
  WITH CHECK (user_id::text = (auth.uid())::text);

-- DELETE: Users can delete their own scorecards
CREATE POLICY scorecards_delete_policy ON scorecards
  FOR DELETE
  TO authenticated
  USING (user_id::text = (auth.uid())::text);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON scorecards TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Verify policies were created
SELECT 
  policyname, 
  cmd,
  qual::text as using_expression,
  with_check::text as with_check_expression
FROM pg_policies 
WHERE tablename = 'scorecards'
ORDER BY cmd;

-- Test query (replace with your user_id)
-- SELECT * FROM scorecards WHERE user_id = 'your-user-id-here';
