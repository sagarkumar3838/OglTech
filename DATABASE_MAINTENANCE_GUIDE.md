# Database Maintenance Guide

## Current Situation

Your database has **1,000 questions** across **2 skills** (Angular and Ansible), but they're not showing up in the UI because of a **level name mismatch**.

### The Problem

```
Database has:     UI expects:
❌ beginner       ✅ Basic
❌ intermediate   ✅ Intermediate  
❌ advanced       ✅ Advanced
```

OR possibly:
```
Database has:     UI expects:
❌ Easy           ✅ Basic
❌ Medium         ✅ Intermediate
❌ Hard           ✅ Advanced
```

## Quick Diagnosis

Run these queries to understand your database:

### 1. Quick Count (Easiest to Read)
```bash
# Run in Supabase SQL Editor
QUICK_QUESTION_COUNT.sql
```

### 2. Complete Inventory (Detailed)
```bash
# Run in Supabase SQL Editor
COMPLETE_QUESTION_INVENTORY.sql
```

### 3. Check Actual Level Names
```bash
# Run in Supabase SQL Editor
CHECK_ACTUAL_LEVEL_NAMES.sql
```

### 4. Generate Report (Anytime)
```bash
# Run in terminal
GENERATE_QUESTION_REPORT.bat
```

## The Fix

### Option 1: Fix All Skills at Once (Recommended)

1. Open Supabase Dashboard → SQL Editor
2. Run `FIX_ALL_SKILLS_LEVELS_COMPLETE.sql`
3. This will:
   - Convert all level variations to standard format
   - Show before/after comparison
   - Fix ALL skills in one go

### Option 2: Fix Specific Skill

If you only want to fix one skill (e.g., React):
1. Run `FIX_REACT_COMPLETE.sql`

## Understanding the Report

When you run `GENERATE_QUESTION_REPORT.bat`, you'll see:

```
┌─────────────────────────┬───────┬──────────────┬──────────┬───────┬──────────┐
│ Skill                   │ Basic │ Intermediate │ Advanced │ Total │ Status   │
├─────────────────────────┼───────┼──────────────┼──────────┼───────┼──────────┤
│ ReactJS                 │   167 │           50 │       17 │   234 │ ⚠️ Partial│
│ Angular                 │     0 │            0 │        0 │   843 │ ⚠️ Partial│
└─────────────────────────┴───────┴──────────────┴──────────┴───────┴──────────┘
```

### Status Meanings:

- ✅ **Complete**: 50+ questions in each level (Basic, Intermediate, Advanced)
- ⚠️ **Partial**: 100+ total questions but missing some levels
- 🔨 **Building**: Less than 100 questions total
- ❌ **Empty**: No questions

### What You Need:

For a skill to be "production ready":
- ✅ 50+ Basic questions
- ✅ 50+ Intermediate questions  
- ✅ 50+ Advanced questions
- ✅ Total: 150+ questions

## Maintenance Workflow

### Daily/Weekly Check
```bash
# Run this anytime to see current state
GENERATE_QUESTION_REPORT.bat
```

### After Uploading New Questions
```bash
# 1. Upload your CSV
UPLOAD_REACT_BEGINNER.bat

# 2. Check the report
GENERATE_QUESTION_REPORT.bat

# 3. If levels are wrong, fix them
# Run FIX_ALL_SKILLS_LEVELS_COMPLETE.sql in Supabase
```

### Before Deployment
```bash
# 1. Generate report
GENERATE_QUESTION_REPORT.bat

# 2. Check QUESTION_DATABASE_REPORT.txt

# 3. Ensure all skills you want to deploy have ✅ Complete status
```

## Common Issues & Solutions

### Issue 1: Questions uploaded but showing 0 in each level

**Cause**: Level names don't match (beginner vs Basic)

**Fix**: Run `FIX_ALL_SKILLS_LEVELS_COMPLETE.sql`

### Issue 2: Can't track which skills are complete

**Solution**: Run `GENERATE_QUESTION_REPORT.bat` regularly

### Issue 3: Too many skills to manage manually

**Solution**: 
1. Use the report to identify incomplete skills
2. Focus on completing one skill at a time
3. Aim for 50+ questions per level

### Issue 4: Duplicate questions

**Solution**: Run `scripts/remove-duplicate-questions.ts`

## Recommended Structure

For easier maintenance, organize by skill:

```
questions/
├── react-beginner.csv      (50+ questions)
├── react-intermediate.csv  (50+ questions)
├── react-advanced.csv      (50+ questions)
├── angular-beginner.csv
├── angular-intermediate.csv
└── angular-advanced.csv
```

## Files You Need

### For Checking Status:
- `GENERATE_QUESTION_REPORT.bat` - Run anytime to see full report
- `QUICK_QUESTION_COUNT.sql` - Quick SQL query
- `COMPLETE_QUESTION_INVENTORY.sql` - Detailed SQL query

### For Fixing Issues:
- `FIX_ALL_SKILLS_LEVELS_COMPLETE.sql` - Fix all level names
- `FIX_REACT_COMPLETE.sql` - Fix specific skill
- `CHECK_ACTUAL_LEVEL_NAMES.sql` - Diagnose level issues

### For Uploading:
- `scripts/upload-react-beginner.ts` - Upload specific file
- `scripts/upload-csv-direct.ts` - Upload all CSV files
- `UPLOAD_REACT_BEGINNER.bat` - Easy upload

## Best Practices

1. **Always check the report after uploading**
   ```bash
   GENERATE_QUESTION_REPORT.bat
   ```

2. **Fix level names immediately after upload**
   - Run `FIX_ALL_SKILLS_LEVELS_COMPLETE.sql`

3. **Aim for balanced levels**
   - Don't upload 200 Basic and 10 Advanced
   - Target: 50-100 per level

4. **Use consistent naming**
   - Skill names: ReactJS, Angular, Python (consistent case)
   - Level names: Basic, Intermediate, Advanced (always)

5. **Regular maintenance**
   - Weekly: Check report
   - After uploads: Verify counts
   - Before deploy: Ensure completeness

## Quick Reference Commands

```bash
# Check database status
GENERATE_QUESTION_REPORT.bat

# Upload new questions
UPLOAD_REACT_BEGINNER.bat

# Fix level names
# (Run FIX_ALL_SKILLS_LEVELS_COMPLETE.sql in Supabase)

# Check specific skill
# (Run QUICK_QUESTION_COUNT.sql in Supabase)
```

## Need Help?

If you see unexpected results:
1. Run `CHECK_ACTUAL_LEVEL_NAMES.sql` to see what's in database
2. Run `GENERATE_QUESTION_REPORT.bat` to see the full picture
3. Check `QUESTION_DATABASE_REPORT.txt` for saved report
