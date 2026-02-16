# Quick Upload Guide - CSV to Supabase

## ✅ Status: All 133 CSV Files Ready!

All CSV files have been fixed and are ready for upload to Supabase.

---

## 🚀 Quick Start (3 Steps)

### Step 1: Verify Your Setup
Make sure your `.env` file has Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Step 2: Choose Upload Method

#### Option A: Automated Upload (Fastest)
```bash
# Run the batch file
UPLOAD_ALL_FIXED_CSV.bat
```

#### Option B: Manual Upload (Most Control)
1. Open Supabase Dashboard
2. Go to Table Editor → `practice_questions`
3. Click "Insert" → "Import data from CSV"
4. Select CSV files from `questions/` folder
5. Click "Import"

#### Option C: Programmatic Upload
```bash
npx tsx scripts/upload-all-questions.ts
```

### Step 3: Verify Upload
Run in Supabase SQL Editor:
```sql
SELECT COUNT(*) as total FROM practice_questions;
```

---

## 📊 What You're Uploading

- **Total Files**: 133 CSV files
- **Total Questions**: ~10,000+ questions
- **Technologies**: 44 different skills
- **Levels**: Beginner, Intermediate, Advanced
- **Languages**: English, Hindi, Kannada, Tamil, Telugu

---

## 📁 Files by Category

### Frontend (27 files)
Angular, CSS, HTML, JavaScript, React, React Native, TypeScript, Vue, Webpack

### Backend (24 files)
Node.js, PHP, Python, Ruby, Go, Java, Kotlin, Swift

### Databases (15 files)
MongoDB, PostgreSQL, Oracle, Redis, SQL

### DevOps & Cloud (27 files)
Ansible, AWS, Azure, Docker, GCP, Kubernetes, Linux, Git, Terraform

### Testing (9 files)
Cypress, Jest, Selenium

### Game Development (15 files)
Unity, Unreal, OpenGL, GLSL, C++

### Other (16 files)
C#, DevTools, Flutter, Rust, VS Code

---

## ✔️ Verification Checklist

After upload, verify:

- [ ] Total question count matches expected
- [ ] All skills are present
- [ ] All difficulty levels are present
- [ ] No duplicate questions
- [ ] All fields are populated

Run these queries:
```sql
-- Count by skill
SELECT skill, COUNT(*) FROM practice_questions GROUP BY skill;

-- Count by level
SELECT level, COUNT(*) FROM practice_questions GROUP BY level;

-- Check for nulls
SELECT COUNT(*) FROM practice_questions 
WHERE question_text IS NULL OR correct_answer IS NULL;
```

---

## 🔧 Troubleshooting

### Upload fails with "too many fields"
→ Re-run fix script: `npx tsx scripts/fix-all-csv-files.ts`

### Upload is slow
→ Use programmatic upload instead of manual CSV import

### Duplicate questions
→ Run: `npx tsx scripts/remove-duplicate-questions.ts`

---

## 📝 CSV Format

Each file has 16 columns:
```
skill, level, question_text, option_a, option_b, option_c, option_d,
correct_answer, explanation, topic, mdn_link, youtube_english,
youtube_hindi, youtube_kannada, youtube_tamil, youtube_telugu
```

---

## 🎯 Next Steps

1. Upload all CSV files
2. Verify data in Supabase
3. Test questions in your app
4. Celebrate! 🎉

---

**Ready to go!** Choose your upload method and start uploading.
