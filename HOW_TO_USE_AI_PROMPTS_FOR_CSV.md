# How to Use AI Prompts to Regenerate CSV Files

## Quick Start

You have 54 CSV files with wrong structure that need to be regenerated. Use these prompts with ChatGPT or Grok to create proper MCQ questions.

## Files to Regenerate (54 total)

See `CSV_STRUCTURE_ANALYSIS.md` for complete list. Key ones:
- All Java files (beginner, intermediate, advanced)
- All Angular files
- All AWS, Azure files
- And 48 more...

## Step-by-Step Process

### Option 1: Using ChatGPT

1. Open ChatGPT (GPT-4 recommended)
2. Copy the prompt from `CHATGPT_REGENERATE_ALL_CSV_PROMPT.md`
3. Replace `[SKILL_NAME]` with actual skill (e.g., "Java")
4. Replace `[LEVEL]` with "Basic", "Intermediate", or "Advanced"
5. Paste into ChatGPT
6. Copy the output CSV
7. Save as `questions/[skill]-[level].csv`

### Option 2: Using Grok

1. Open Grok (X.com)
2. Copy the prompt from `GROK_REGENERATE_ALL_CSV_PROMPT.md`
3. Replace `[SKILL_NAME]` and `[LEVEL]`
4. Paste into Grok
5. Copy the output CSV
6. Save as `questions/[skill]-[level].csv`

## Example Usage

### For Java Beginner:

**Replace in prompt:**
```
[SKILL_NAME] → Java
[LEVEL] → Basic
```

**Save as:**
```
questions/java-beginner.csv
```

### For Angular Advanced:

**Replace in prompt:**
```
[SKILL_NAME] → Angular
[LEVEL] → Advanced
```

**Save as:**
```
questions/angular-advanced.csv
```

## Verification Checklist

After generating each CSV, verify:

1. ✅ Has header row with 15 columns
2. ✅ Has 100 data rows (questions)
3. ✅ Correct answers are mixed (not all "A")
4. ✅ Options are actual answer choices (not topic names)
5. ✅ No duplicate questions
6. ✅ All fields filled (no empty cells)

## Quick Verification Command

Run this to check structure:
```bash
node_modules/.bin/tsx scripts/check-csv-structure.ts
```

Should show: `✅ [filename]: Correct structure`

## Batch Processing Strategy

### Priority Order:

1. **High Priority** (Most used skills):
   - Java (3 files)
   - JavaScript (1 file)
   - Python (1 file)
   - React (already correct ✅)
   - Node.js (1 file)

2. **Medium Priority**:
   - Angular (3 files)
   - AWS (3 files)
   - Azure (3 files)
   - Docker (2 files)
   - Kubernetes (2 files)

3. **Lower Priority**:
   - Remaining 35 files

### Time Estimate:

- Per file: 2-3 minutes (AI generation + save)
- Total for 54 files: ~2-3 hours
- Can be done in batches over multiple sessions

## Tips for Better Results

### 1. Be Specific in Prompts

Add context about the skill:
```
For Java Basic level, focus on:
- JVM, JDK, JRE concepts
- Basic syntax (loops, conditionals)
- Data types and variables
- OOP basics (classes, objects)
```

### 2. Review AI Output

Check first 5-10 questions to ensure:
- Questions make sense
- Options are plausible
- Correct answers are actually correct
- Explanations are accurate

### 3. Iterate if Needed

If output is poor:
- Regenerate with more specific instructions
- Ask AI to "make questions more practical"
- Request "focus on real-world scenarios"

## Common Issues & Fixes

### Issue 1: All Answers are "A"

**Fix:** Regenerate with emphasis:
```
CRITICAL: Randomize correct answers! 
Distribute A, B, C, D evenly (~25% each).
```

### Issue 2: Options are Still Topic Names

**Fix:** Add example in prompt:
```
WRONG: option_a="Concurrency", option_b="Threading"
RIGHT: option_a="Manages thread pools", option_b="Handles async operations"
```

### Issue 3: Duplicate Questions

**Fix:** Ask AI to:
```
Ensure all 100 questions are UNIQUE. 
No duplicates or very similar questions.
```

### Issue 4: CSV Formatting Errors

**Fix:** 
- Check for unescaped quotes
- Ensure no line breaks inside fields
- Verify 15 columns per row

## After Regeneration

### 1. Upload to Database

Use the upload script:
```bash
node_modules/.bin/tsx scripts/fix-java-csv-and-upload.ts
```

Or modify for other skills.

### 2. Test in App

1. Go to Practice page
2. Select the skill
3. Select the level
4. Start practice
5. Verify questions display correctly

### 3. Check Answer Distribution

In Supabase SQL Editor:
```sql
SELECT 
  correct_answer, 
  COUNT(*) as count 
FROM practice_questions 
WHERE skill = 'Java' AND level = 'Basic'
GROUP BY correct_answer
ORDER BY correct_answer;
```

Should show roughly equal distribution:
```
A: ~25
B: ~25
C: ~25
D: ~25
```

## Automation Ideas

### Create Batch Script

```bash
# generate-all-csv.sh
for skill in java angular python; do
  for level in beginner intermediate advanced; do
    echo "Generating $skill-$level..."
    # Copy prompt, replace variables, call AI API
  done
done
```

### Use AI API

If you have API access:
- OpenAI API (ChatGPT)
- Anthropic API (Claude)
- X API (Grok)

Can automate the entire process.

## Summary

1. Use provided prompts (`CHATGPT_REGENERATE_ALL_CSV_PROMPT.md` or `GROK_REGENERATE_ALL_CSV_PROMPT.md`)
2. Replace `[SKILL_NAME]` and `[LEVEL]`
3. Generate 100 questions
4. Save as CSV
5. Verify structure
6. Upload to database
7. Test in app

Repeat for all 54 files with wrong structure.
