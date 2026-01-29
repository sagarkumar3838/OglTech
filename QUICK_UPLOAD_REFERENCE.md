# Quick Reference: Upload JSON Questions

## 🚀 3 Ways to Upload

### Method 1: Direct Upload (Fastest) ⚡

```bash
npx tsx scripts/upload-json-to-supabase.ts my-questions.json
```

**Pros:** Automatic, handles everything
**Cons:** Requires Node.js

---

### Method 2: Convert to SQL First 📝

```bash
# Step 1: Convert JSON to SQL
npx tsx scripts/json-to-sql.ts my-questions.json > questions.sql

# Step 2: Run SQL in Supabase
# Go to: https://supabase.com/dashboard/project/ksjgsgebjnpwyycnptom/sql/new
# Paste questions.sql content and click "Run"
```

**Pros:** Can review SQL before upload
**Cons:** Two-step process

---

### Method 3: Manual Entry 👆

```
Go to: https://supabase.com/dashboard/project/ksjgsgebjnpwyycnptom/editor/17524
Click "Insert" → Fill form → Save
```

**Pros:** No coding required
**Cons:** Slow for many questions

---

## 📋 JSON Format (Copy & Paste)

```json
{
  "JavaScript": {
    "BASIC": [
      {
        "type": "mcq",
        "question": "Your question here?",
        "options": ["A", "B", "C", "D"],
        "correct_answer": "A",
        "explanation": "Why A is correct"
      }
    ],
    "INTERMEDIATE": [],
    "ADVANCED": []
  }
}
```

---

## ✅ Quick Checklist

Before uploading:

- [ ] JSON is valid (test at jsonlint.com)
- [ ] Skill names are correct
- [ ] Levels are BASIC, INTERMEDIATE, or ADVANCED
- [ ] All questions have required fields
- [ ] Backup your JSON file

---

## 🎯 Example: Upload 10 Questions

**Step 1:** Create `my-questions.json`

```json
{
  "HTML": {
    "BASIC": [
      {"type": "mcq", "question": "Q1?", "options": ["A","B","C","D"], "correct_answer": "A", "explanation": "..."},
      {"type": "mcq", "question": "Q2?", "options": ["A","B","C","D"], "correct_answer": "B", "explanation": "..."}
    ]
  }
}
```

**Step 2:** Upload

```bash
npx tsx scripts/upload-json-to-supabase.ts my-questions.json
```

**Step 3:** Verify

```
https://supabase.com/dashboard/project/ksjgsgebjnpwyycnptom/editor/17524
```

Done! ✅

---

## 🔧 Troubleshooting

| Error | Solution |
|-------|----------|
| "Invalid JSON" | Check syntax at jsonlint.com |
| "File not found" | Use correct file path |
| "RLS policy violation" | Check Supabase anon key |
| "Skill not found" | Skill names are case-sensitive |

---

## 📊 Supported Skills

- HTML
- CSS
- JavaScript
- TypeScript
- React
- Node.js
- Python
- Java
- Testing Tools
- Docker
- Kubernetes
- Cloud Platforms
- jQuery
- OGL Knowledge

---

## 💡 Pro Tips

1. **Start small**: Upload 5 questions first to test
2. **Use batches**: Upload 50 questions at a time
3. **Backup first**: Keep original JSON safe
4. **Verify after**: Check Supabase table editor
5. **Use sample**: Copy from `sample-questions.json`

---

## 📞 Quick Commands

```bash
# Upload questions
npx tsx scripts/upload-json-to-supabase.ts questions.json

# Convert to SQL
npx tsx scripts/json-to-sql.ts questions.json > output.sql

# Check sample format
cat sample-questions.json
```

---

**That's it! Your questions will be in Supabase in seconds!** 🎉
