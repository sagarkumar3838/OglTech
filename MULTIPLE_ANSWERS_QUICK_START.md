# Multiple Correct Answers - Quick Start

## 🎯 3-Step Setup

### 1️⃣ Run Migration (One Time)
```bash
# Copy and run this SQL in Supabase SQL Editor:
add-multiple-correct-answers-support.sql
```

### 2️⃣ Format Your CSV
```csv
# Single Answer (existing format)
Docker,beginner,What is Docker?,Container,VM,OS,DB,A,Explanation,Topic

# Multiple Answers (new format - use quotes!)
Docker,beginner,Which are containers?,Docker,Podman,VirtualBox,VMware,"A,B",Explanation,Topic
```

### 3️⃣ Upload Questions
```bash
# Upload single file
npm run upload:multiple-answers questions/docker-beginner.csv

# Upload all files
npm run upload:multiple-answers
```

## 📝 CSV Format Rules

✅ **DO:**
- Quote multiple answers: `"A,B,D"`
- Use comma, pipe, or space: `"A,B"` or `"A|B"` or `"A B"`
- Mix single and multiple in same file

❌ **DON'T:**
- Forget quotes: `A,B,D` ❌
- Use lowercase: `"a,b"` (auto-converted to uppercase)
- Use invalid letters: Only A, B, C, D allowed

## 🎨 Frontend Display

```typescript
// Check question type
if (question.question_type === 'single') {
  // Show radio buttons
  <input type="radio" />
} else {
  // Show checkboxes
  <input type="checkbox" />
  <p>Select all that apply</p>
}

// Get correct answers
const correctAnswers = question.correct_answers || [question.correct_answer];

// Validate user answer
const isCorrect = userAnswers.length === correctAnswers.length &&
  userAnswers.every(a => correctAnswers.includes(a));
```

## 🔍 Database Queries

```sql
-- Get all multiple answer questions
SELECT * FROM practice_questions WHERE question_type = 'multiple';

-- Check if answer is correct
SELECT is_answer_correct('question-id', ARRAY['A', 'B']);

-- Get correct answers for a question
SELECT get_correct_answers('question-id');

-- View statistics
SELECT * FROM practice_questions_stats;
```

## 📊 Examples

### Docker Example
```csv
Docker,beginner,Which commands show containers?,docker ps,docker info,docker list,docker show,"A,B","ps shows running, info shows system",Commands
```

### React Example
```csv
React,intermediate,Which are React hooks?,useState,useEffect,useData,useProps,"A,B","useState and useEffect are built-in hooks",Hooks
```

### HTTP Example
```csv
HTTP,beginner,Which methods are safe?,GET,POST,PUT,DELETE,A,Only GET is safe and idempotent,Methods
```

## ✅ Quick Checklist

- [ ] Run migration SQL
- [ ] Update CSV with `"A,B,D"` format for multiple answers
- [ ] Upload using `npm run upload:multiple-answers`
- [ ] Update frontend to show checkboxes for `question_type === 'multiple'`
- [ ] Test answer validation

## 🚨 Troubleshooting

**Problem**: Upload fails with "invalid format"  
**Solution**: Ensure multiple answers are quoted: `"A,B,D"`

**Problem**: Frontend shows wrong input type  
**Solution**: Check `question.question_type` field

**Problem**: Answer validation fails  
**Solution**: Run migration SQL first

## 📚 Full Documentation

See `MULTIPLE_ANSWERS_GUIDE.md` for complete details.
