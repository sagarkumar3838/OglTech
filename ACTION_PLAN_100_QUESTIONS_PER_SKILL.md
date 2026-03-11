# Action Plan: Get Every Skill to 100+ Questions

## Current Situation
Based on your database screenshots, many skills have:
- Fewer than 100 total questions
- Missing difficulty levels entirely
- Unbalanced distributions

## Goal
Every skill should have:
- **Minimum 100 questions total**
- **Balanced distribution**: ~30-35 beginner, ~35-40 intermediate, ~30-35 advanced
- **No missing levels**: All three difficulty levels present

## Step-by-Step Process

### Step 1: Diagnose Current State (5 minutes)

Run this SQL query in Supabase:
```bash
CHECK_ALL_SKILLS_COMPLETE_STATUS.sql
```

This will show you:
- Which skills have <100 questions
- Which skills are missing difficulty levels
- Exact counts for each skill/level combination

### Step 2: Generate Missing Questions (30-45 minutes)

Open `GENERATE_MISSING_QUESTIONS_PROMPTS.md` and:

1. For each deficient skill, copy the appropriate prompt
2. Paste into ChatGPT
3. Copy the CSV output
4. Save as `questions/[skill]-[level]-additional.csv`

**Priority Skills** (from your images):
1. **Swift** - Generate 75 questions (35 beginner + 40 intermediate)
2. **Rust** - Generate 35 advanced questions
3. **Selenium** - Generate 30 intermediate questions
4. **TypeScript** - Generate 15 mixed questions
5. **Unity** - Generate 10 mixed questions

### Step 3: Upload Questions (10 minutes)

```bash
UPLOAD_ALL_MISSING_QUESTIONS.bat
```

This will:
- Read all CSV files in `questions/` folder
- Upload to `practice_questions` table
- Skip duplicates automatically
- Show upload summary

### Step 4: Verify Success (5 minutes)

Run again:
```bash
CHECK_ALL_SKILLS_COMPLETE_STATUS.sql
```

Verify:
- All skills show "✅ COMPLETE" status
- No skills have 0 questions in any level
- Total counts are 100+

### Step 5: Test in Application (5 minutes)

1. Open Practice page
2. Select each skill
3. Verify questions appear for all difficulty levels
4. Test a few questions to ensure they work correctly

## Quick Reference: Skills Needing Attention

### Critical (Missing Levels)
- **Swift**: 0 beginner, 0 intermediate → Need 75 questions
- **Rust**: 0 advanced → Need 35 questions

### High Priority (<100 total)
- **TypeScript**: 62 total → Need 38 more
- **Unity**: 91 total → Need 9 more
- **Selenium**: 83 total (only 1 intermediate) → Need 30 intermediate

### Check All Others
Run the diagnostic to find any other skills <100

## Time Estimate

| Task | Time |
|------|------|
| Run diagnostic | 5 min |
| Generate questions (ChatGPT) | 30-45 min |
| Upload to database | 10 min |
| Verify and test | 10 min |
| **Total** | **55-70 minutes** |

## Tips for Faster Generation

1. **Batch prompts**: Open multiple ChatGPT tabs for parallel generation
2. **Use templates**: Copy/paste from `GENERATE_MISSING_QUESTIONS_PROMPTS.md`
3. **Verify format**: Check CSV has correct columns before uploading
4. **Test one first**: Upload one skill first to verify process works

## Troubleshooting

### If upload fails:
- Check CSV format (must have exact columns)
- Verify skill names are lowercase
- Ensure correct_answer is "A", "B", "C", or "D"
- Check for special characters that need escaping

### If questions don't show:
- Verify skill name matches exactly (case-sensitive in some queries)
- Check level is "beginner", "intermediate", or "advanced"
- Run `DIAGNOSE_PRACTICE_QUESTIONS.sql`

### If duplicates appear:
- Run `remove-duplicates.sql`
- Check question text for exact matches

## Success Criteria

✅ All skills have 100+ questions
✅ All skills have all three difficulty levels
✅ Questions display correctly in Practice page
✅ No duplicate questions
✅ Balanced distribution across levels

## Next Steps After Completion

1. Document final question counts
2. Test user experience with full question set
3. Consider adding more questions for popular skills (150-200)
4. Set up automated testing for question quality
