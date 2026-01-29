# CSV vs Supabase Format Comparison

## ❌ Your Current CSV Format (INCORRECT for Supabase)

```csv
skill,level,type,question,option_a,option_b,option_c,option_d,correct_answer,explanation
CSS,BASIC,Multiple Choice,Which property is used to change the background color?,background-color,color,border,margin,background-color,The background-color property sets the background color.
```

### Issues:
1. ❌ Missing `question_id` column
2. ❌ `type = "Multiple Choice"` (should be "mcq")
3. ❌ Options in separate columns (option_a, option_b, option_c, option_d)
4. ❌ `correct_answer` is plain text (should be JSONB in schema, but text works for mcq)

---

## ✅ Correct Supabase Format (from transformed JSON)

```json
{
  "question_id": "css_basic_1769353214354_0",
  "skill": "CSS",
  "level": "BASIC",
  "type": "mcq",
  "question": "Which property is used to change the background color?",
  "options": [
    "background-color",
    "color",
    "border",
    "margin"
  ],
  "correct_answer": "background-color",
  "explanation": "The background-color property sets the background color."
}
```

### What Changed:
1. ✅ Added `question_id`: Unique identifier (required by Supabase)
2. ✅ Changed `type`: "Multiple Choice" → "mcq"
3. ✅ Combined `options`: Separate columns → JSON array
4. ✅ Kept `correct_answer`: As text (valid for mcq type)

---

## Supabase Database Schema Requirements

```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY,
  question_id TEXT NOT NULL UNIQUE,        -- ⚠️ REQUIRED, UNIQUE
  skill TEXT NOT NULL,
  level TEXT NOT NULL,
  type TEXT NOT NULL CHECK (               -- ⚠️ MUST BE: mcq, multi_select, coding, fill_blank, or matching
    type IN ('mcq', 'multi_select', 'coding', 'fill_blank', 'matching')
  ),
  question TEXT NOT NULL,
  options JSONB DEFAULT '[]'::jsonb,       -- ⚠️ MUST BE JSON ARRAY
  correct_answer JSONB NOT NULL,           -- ⚠️ JSONB (but text works for mcq)
  explanation TEXT,
  ...
);
```

---

## Side-by-Side Comparison

| Field | Your CSV | Supabase Needs | Transformed |
|-------|----------|----------------|-------------|
| **question_id** | ❌ Missing | ✅ Required | `css_basic_1769353214354_0` |
| **skill** | ✅ CSS | ✅ CSS | ✅ CSS |
| **level** | ✅ BASIC | ✅ BASIC | ✅ BASIC |
| **type** | ❌ "Multiple Choice" | ✅ "mcq" | ✅ "mcq" |
| **question** | ✅ Text | ✅ Text | ✅ Text |
| **options** | ❌ option_a, option_b, option_c, option_d | ✅ JSON array | ✅ `["opt1", "opt2", "opt3", "opt4"]` |
| **correct_answer** | ⚠️ Plain text | ✅ JSONB (text OK) | ✅ "background-color" |
| **explanation** | ✅ Text | ✅ Text | ✅ Text |

---

## Example: How One Row Transforms

### Before (CSV):
```
CSS,BASIC,Multiple Choice,Which property is used to change the background color?,background-color,color,border,margin,background-color,The background-color property sets the background color.
```

### After (Supabase):
```json
{
  "question_id": "css_basic_1769353214354_0",
  "skill": "CSS",
  "level": "BASIC",
  "type": "mcq",
  "question": "Which property is used to change the background color?",
  "options": ["background-color", "color", "border", "margin"],
  "correct_answer": "background-color",
  "explanation": "The background-color property sets the background color."
}
```

---

## Why You Need the Transformation Script

Your CSV **cannot be uploaded directly** to Supabase because:

1. **Missing question_id**: Database will reject (NOT NULL constraint)
2. **Wrong type value**: Database will reject (CHECK constraint)
3. **Wrong options format**: Database expects JSONB array, not separate columns

The `transform-css-questions.ts` script fixes all these issues automatically.

---

## Correct Format for Future CSV Files

If you want to create CSV files that need minimal transformation:

```csv
question_id,skill,level,type,question,options,correct_answer,explanation
css_basic_001,CSS,BASIC,mcq,"Which property changes background color?","[""background-color"",""color"",""border"",""margin""]",background-color,The background-color property sets the background color.
```

**Note**: This is harder to edit manually, which is why the transformation script exists.

---

## Summary

✅ **Use the transformed JSON format** (`css_easy_questions_transformed.json`)

This is the correct format for Supabase. The transformation script:
- Reads your easy-to-edit CSV
- Converts to Supabase-compatible format
- Uploads to database

**Run**: `UPLOAD_CSS_QUESTIONS.bat` to complete the upload.
