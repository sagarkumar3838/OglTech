# CSS Questions CSV Analysis

## File Analyzed
`client/dist/assets/css_easy_questions.csv`

## Current Structure

### Headers
```
skill, level, type, question, option_a, option_b, option_c, option_d, correct_answer, explanation
```

### Sample Row
```csv
CSS,BASIC,Multiple Choice,Which property is used to change the background color of an element?,background-color,color,border,margin,background-color,The `background-color` property sets the background color of an element.
```

## Issues Found

### ❌ Issue 1: Type Format Mismatch
- **Your CSV**: `type = "Multiple Choice"`
- **Supabase Expects**: `type = "mcq"`
- **Impact**: Upload will fail due to CHECK constraint
- **Fix**: Script converts "Multiple Choice" → "mcq"

### ❌ Issue 2: Missing question_id
- **Your CSV**: No question_id column
- **Supabase Requires**: Unique question_id (TEXT, NOT NULL, UNIQUE)
- **Impact**: Upload will fail
- **Fix**: Script generates unique IDs like `css_basic_1737849600000_0`

### ❌ Issue 3: Options Format
- **Your CSV**: Separate columns (option_a, option_b, option_c, option_d)
- **Supabase Expects**: JSONB array `["opt1", "opt2", "opt3", "opt4"]`
- **Impact**: Data structure mismatch
- **Fix**: Script combines into JSON array

### ❌ Issue 4: Correct Answer Format
- **Your CSV**: Plain text (e.g., "background-color")
- **Supabase Expects**: JSONB (but can accept text for mcq type)
- **Impact**: Should work, but inconsistent with schema
- **Fix**: Script keeps as text (valid for mcq type)

### ⚠️ Issue 5: Duplicate Questions
- **Found**: Multiple sections with identical questions repeated
- **Impact**: Database will reject duplicates if question_id conflicts
- **Fix**: Script removes duplicates based on question text

### ✅ Correct: Skill and Level
- **Skill**: "CSS" ✓
- **Level**: "BASIC" ✓
- These match your schema expectations

## Question Types Found

You mentioned "three types" but the CSV only contains:

1. **Multiple Choice** (all questions)
   - 4 options (A, B, C, D)
   - Single correct answer
   - Explanation provided

**Missing Types** (if you intended to add them):
- Fill in the Blank
- Multi-Select
- Coding
- Matching

## Statistics

- **Total Rows**: ~110+ (with duplicates)
- **Unique Questions**: ~45 (estimated after deduplication)
- **Question Type**: 100% Multiple Choice
- **Skill**: 100% CSS
- **Level**: 100% BASIC

## Supabase Schema Requirements

```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id TEXT NOT NULL UNIQUE,           -- ❌ Missing in CSV
  skill TEXT NOT NULL,                        -- ✅ Present
  level TEXT NOT NULL,                        -- ✅ Present
  type TEXT NOT NULL CHECK (type IN (         -- ❌ Wrong format
    'mcq', 'multi_select', 'coding', 
    'fill_blank', 'matching'
  )),
  question TEXT NOT NULL,                     -- ✅ Present
  options JSONB DEFAULT '[]'::jsonb,          -- ❌ Wrong format
  correct_answer JSONB NOT NULL,              -- ⚠️ Format issue
  explanation TEXT,                           -- ✅ Present
  ...
);
```

## Transformation Script

The `transform-css-questions.ts` script handles all these issues:

1. ✅ Generates unique question_id
2. ✅ Converts "Multiple Choice" → "mcq"
3. ✅ Combines options into JSON array
4. ✅ Removes duplicate questions
5. ✅ Validates required fields
6. ✅ Uploads in batches to Supabase

## Recommendation

✅ **Run the transformation script** - Your CSV needs conversion before upload

```bash
UPLOAD_CSS_QUESTIONS.bat
```

The script will:
- Fix all format issues
- Remove duplicates
- Generate a preview JSON file
- Upload to Supabase safely
