# Deploy All Questions to Supabase - Quick Guide

## 🎯 What You Have
- 99 CSV files in the `questions/` folder
- 33 skills × 3 levels (beginner, intermediate, advanced)
- Each CSV has: skill, level, question_text, categories, answer, explanation, and multimedia links

## 📋 3 Simple Steps

### Step 1: Create the Database Table in Supabase
1. Open your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Copy the entire content from `create-practice-questions-database-v2.sql`
5. Paste it into the SQL Editor
6. Click **RUN** button
7. Wait for "Success" message

✅ This creates the `practice_questions` table with all columns

### Step 2: Verify Your .env File
Make sure your `.env` file has these values:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3: Upload All Questions
Simply double-click this file:
```
UPLOAD_ALL_PRACTICE_QUESTIONS.bat
```

The script will:
- ✅ Install dependencies
- ✅ Process all 99 CSV files
- ✅ Upload questions in batches
- ✅ Show progress for each file
- ✅ Display final summary

## 📊 What Gets Uploaded

### All Skills (33 technologies)
- **Frontend**: HTML, CSS, JavaScript, TypeScript, React, Vue, Angular
- **Backend**: Node.js, Python, Java, Go, PHP, Ruby, C#, C++
- **Databases**: MongoDB, PostgreSQL, Oracle, Redis, SQL
- **DevOps**: Docker, Kubernetes, Ansible, Terraform, Git
- **Cloud**: AWS, Azure, GCP
- **Mobile**: Flutter, React Native, Swift, Kotlin
- **Testing**: Jest, Cypress, Selenium
- **Graphics**: OpenGL, GLSL, Unity, Unreal
- **Tools**: VSCode, DevTools, Webpack

### All Levels
- **Basic** (beginner): Fundamental concepts
- **Intermediate**: Practical applications
- **Advanced**: Complex scenarios

### Multimedia Support
Each question includes:
- MDN documentation link
- YouTube videos in 5 languages (English, Hindi, Kannada, Tamil, Telugu)

## 🔍 Verify Upload

After upload completes, run this in Supabase SQL Editor:

```sql
-- Check total questions
SELECT COUNT(*) as total FROM practice_questions;

-- Check by skill and level
SELECT skill, level, COUNT(*) as count
FROM practice_questions
GROUP BY skill, level
ORDER BY skill, level;
```

Expected result: ~3000+ questions (depending on your CSV content)

## ⚡ Quick Commands

### If upload fails, try again:
```bash
UPLOAD_ALL_PRACTICE_QUESTIONS.bat
```

### Check what's in database:
Run `verify-practice-questions.sql` in Supabase SQL Editor

### Clear all questions and start fresh:
```sql
DELETE FROM practice_questions;
```

## 🎉 After Upload

Your questions are now in Supabase! You can:
1. Query them from your frontend
2. Filter by skill and level
3. Access multimedia links
4. Build practice tests
5. Create learning paths

## 📝 Example Query

```sql
-- Get 10 random React intermediate questions
SELECT * FROM practice_questions
WHERE skill = 'React Native' 
  AND level = 'Intermediate'
ORDER BY RANDOM()
LIMIT 10;
```

## 🆘 Troubleshooting

**Problem**: "Table doesn't exist"
**Solution**: Run Step 1 again (create-practice-questions-database-v2.sql)

**Problem**: "Permission denied"
**Solution**: Check your .env file has correct Supabase keys

**Problem**: "CSV parsing error"
**Solution**: Ensure CSV files are UTF-8 encoded

**Problem**: Upload is slow
**Solution**: Normal! Processing 99 files takes 2-5 minutes

## 📁 Files You Need

✅ `create-practice-questions-database-v2.sql` - Creates table
✅ `UPLOAD_ALL_PRACTICE_QUESTIONS.bat` - Uploads all CSVs
✅ `scripts/upload-all-questions.ts` - Upload script
✅ `verify-practice-questions.sql` - Verification queries
✅ `questions/` folder - All your CSV files

That's it! 🚀
