# Multiple Correct Answers Support Guide

## Overview

Your question bank now supports questions with multiple correct answers! This is perfect for questions like:
- "Which of the following are valid Docker commands?" (A, B, D)
- "Select all correct statements about React hooks" (A, C, D)
- "Which HTTP methods are idempotent?" (A, B, C)

## 🚀 Quick Start

### Step 1: Run the Migration

```bash
# Run this SQL file in your Supabase SQL Editor
add-multiple-correct-answers-support.sql
```

Or use the batch file:
```bash
SETUP_MULTIPLE_ANSWERS.bat
```

### Step 2: Update Your CSV Files

#### Single Answer (Existing Format)
```csv
skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic
Docker,beginner,What is Docker?,Container platform,VM software,OS,Database,A,Docker is a container platform,Containers
```

#### Multiple Answers (New Format)
```csv
skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic
Docker,beginner,Which are container platforms?,Docker,Kubernetes,VirtualBox,VMware,"A,B",Docker and Kubernetes are container platforms,Containers
```

**Supported Formats for Multiple Answers:**
- Comma-separated: `"A,B,D"`
- Pipe-separated: `"A|B|D"`
- Space-separated: `"A B D"`

### Step 3: Upload Questions

```bash
# Upload with multiple answer support
npx tsx scripts/upload-csv-with-multiple-answers.ts questions/docker-beginner.csv

# Or upload all CSV files
npx tsx scripts/upload-csv-with-multiple-answers.ts
```

## 📊 Database Schema Changes

### New Columns

1. **correct_answers** (TEXT[])
   - Array of correct answer letters
   - Example: `['A', 'B', 'D']`

2. **question_type** (TEXT)
   - Values: `'single'` or `'multiple'`
   - Automatically set based on number of correct answers

### Helper Functions

#### Check if Answer is Correct
```sql
SELECT is_answer_correct(
  'question-uuid-here',
  ARRAY['A', 'B']  -- User's selected answers
);
-- Returns: true or false
```

#### Get Correct Answers
```sql
SELECT get_correct_answers('question-uuid-here');
-- Returns: ['A', 'B', 'D']
```

## 🎯 Frontend Integration

### Display Multiple Answer Questions

```typescript
interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  correct_answers?: string[];
  question_type: 'single' | 'multiple';
}

// In your component
const Question = ({ question }: { question: Question }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  
  const handleAnswerSelect = (answer: string) => {
    if (question.question_type === 'single') {
      setSelectedAnswers([answer]);
    } else {
      // Toggle answer for multiple choice
      setSelectedAnswers(prev =>
        prev.includes(answer)
          ? prev.filter(a => a !== answer)
          : [...prev, answer]
      );
    }
  };
  
  const isCorrect = () => {
    const correctAnswers = question.correct_answers || [question.correct_answer];
    return (
      selectedAnswers.length === correctAnswers.length &&
      selectedAnswers.every(a => correctAnswers.includes(a))
    );
  };
  
  return (
    <div>
      <h3>{question.question_text}</h3>
      {question.question_type === 'multiple' && (
        <p className="text-sm text-gray-600">
          Select all that apply
        </p>
      )}
      
      {['A', 'B', 'C', 'D'].map(letter => (
        <label key={letter}>
          <input
            type={question.question_type === 'single' ? 'radio' : 'checkbox'}
            name={question.id}
            value={letter}
            checked={selectedAnswers.includes(letter)}
            onChange={() => handleAnswerSelect(letter)}
          />
          {question[`option_${letter.toLowerCase()}`]}
        </label>
      ))}
    </div>
  );
};
```

### Validate Answer

```typescript
const validateAnswer = async (questionId: string, userAnswers: string[]) => {
  const { data, error } = await supabase
    .rpc('is_answer_correct', {
      question_id: questionId,
      user_answers: userAnswers
    });
  
  return data; // true or false
};
```

## 📝 CSV Examples

### Example 1: Docker Commands (Multiple Answers)
```csv
skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic
Docker,beginner,Which commands show container info?,docker ps,docker info,docker list,docker show,"A,B","docker ps shows running containers, docker info shows system info",Commands
```

### Example 2: React Hooks (Multiple Answers)
```csv
skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic
React,intermediate,Which are built-in React hooks?,useState,useEffect,useData,useComponent,"A,B","useState and useEffect are built-in hooks",Hooks
```

### Example 3: HTTP Methods (Multiple Answers)
```csv
skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,topic
HTTP,beginner,Which HTTP methods are idempotent?,GET,PUT,POST,DELETE,"A,B,D","GET, PUT, and DELETE are idempotent",Methods
```

## 🔧 Migration Details

### What Happens During Migration

1. ✅ Adds `correct_answers` column (TEXT[])
2. ✅ Adds `question_type` column ('single' | 'multiple')
3. ✅ Migrates existing single answers to array format
4. ✅ Creates validation functions
5. ✅ Updates database indexes
6. ✅ Preserves all existing data

### Backward Compatibility

- ✅ Existing questions continue to work
- ✅ Old upload scripts still work
- ✅ `correct_answer` column is preserved
- ✅ Frontend can use either format

## 📈 Statistics

View question statistics including multiple answer questions:

```sql
SELECT * FROM practice_questions_stats;
```

Output includes:
- `single_answer_questions`: Count of single answer questions
- `multiple_answer_questions`: Count of multiple answer questions

## 🎨 UI Recommendations

### Single Answer Questions
- Use radio buttons
- Allow only one selection
- Show "Select one answer"

### Multiple Answer Questions
- Use checkboxes
- Allow multiple selections
- Show "Select all that apply"
- Show count: "Select 2 answers" or "Select all correct answers"

### Scoring
- **Single Answer**: 1 point for correct, 0 for incorrect
- **Multiple Answer Options**:
  - All or nothing: Full points only if all correct
  - Partial credit: Points proportional to correct selections
  - Penalty: Deduct points for wrong selections

## 🚨 Important Notes

1. **CSV Format**: Always quote multiple answers: `"A,B,D"` not `A,B,D`
2. **Validation**: System validates that answers are A, B, C, or D
3. **Case Insensitive**: `"a,b"` is converted to `"A,B"`
4. **Duplicates**: Upload script still prevents duplicate questions
5. **RLS Policies**: All existing security policies remain active

## 🔍 Troubleshooting

### Issue: Multiple answers not working
**Solution**: Run the migration SQL file first

### Issue: CSV upload fails
**Solution**: Ensure multiple answers are quoted: `"A,B,D"`

### Issue: Frontend shows wrong input type
**Solution**: Check `question_type` field and render accordingly

## 📚 Additional Resources

- Database migration: `add-multiple-correct-answers-support.sql`
- Upload script: `scripts/upload-csv-with-multiple-answers.ts`
- Batch file: `SETUP_MULTIPLE_ANSWERS.bat`

## ✅ Checklist

- [ ] Run migration SQL
- [ ] Update CSV files with multiple answers
- [ ] Upload questions using new script
- [ ] Update frontend to show checkboxes for multiple answer questions
- [ ] Test answer validation
- [ ] Update scoring logic
- [ ] Test user experience

---

**Need Help?** Check the examples above or review the migration SQL file for detailed implementation.
