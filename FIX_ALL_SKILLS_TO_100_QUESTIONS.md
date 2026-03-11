# Fix All Skills to Have 100+ Questions

## Current Issues Identified

### Skills Missing Questions or Levels:
1. **Rust** - Missing advanced level questions
2. **Selenium** - Only 1 intermediate question (needs ~30 more)
3. **Swift** - Missing beginner and intermediate entirely
4. **TypeScript** - Only 62 total (needs 38 more)
5. **Unity** - Only 91 total (needs 9 more)

### Target Distribution Per Skill:
- **Beginner**: 30-35 questions
- **Intermediate**: 35-40 questions  
- **Advanced**: 30-35 questions
- **Total**: 100+ questions per skill

## Step-by-Step Fix Process

### Phase 1: Identify All Skills Needing Questions
Run diagnostic query to find all skills with <100 questions

### Phase 2: Generate Missing Questions
Use ChatGPT with structured prompts to generate questions for:
- Skills with <100 total questions
- Skills missing specific difficulty levels
- Skills with unbalanced distributions

### Phase 3: Upload and Verify
- Upload new questions via CSV
- Verify counts match targets
- Test questions display correctly in Practice page

## Quick Action Items

### 1. Check All Skills Status
```sql
-- See CHECK_ALL_SKILLS_COMPLETE_STATUS.sql
```

### 2. Generate Questions for Each Deficient Skill
Use the prompts in GENERATE_MISSING_QUESTIONS_PROMPTS.md

### 3. Upload Using Batch Script
```bash
UPLOAD_ALL_MISSING_QUESTIONS.bat
```

## Skills Requiring Immediate Attention

Based on your images:

1. **Swift** - Generate 35 beginner, 40 intermediate (keep 94 advanced)
2. **Rust** - Generate 35 advanced questions
3. **Selenium** - Generate 30 intermediate questions
4. **TypeScript** - Generate 15 more across all levels
5. **Unity** - Generate 10 more questions

## Estimated Time
- Query generation: 5 minutes
- ChatGPT question generation: 30-45 minutes
- Upload and verification: 15 minutes
- **Total**: ~1 hour to fix all skills
