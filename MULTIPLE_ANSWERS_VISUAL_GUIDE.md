# Multiple Correct Answers - Visual Guide

## 📸 Before vs After

### BEFORE (Single Answer Only)
```
┌─────────────────────────────────────────────────┐
│ Question: What is Docker?                       │
│                                                  │
│ ○ A. Container platform                         │
│ ○ B. Virtual machine                            │
│ ○ C. Operating system                           │
│ ○ D. Database                                   │
│                                                  │
│ Correct Answer: A                               │
└─────────────────────────────────────────────────┘
```

### AFTER (Single + Multiple Answers)
```
┌─────────────────────────────────────────────────┐
│ Question: Which are container platforms?        │
│ (Select all that apply)                         │
│                                                  │
│ ☑ A. Docker                                     │
│ ☑ B. Kubernetes                                 │
│ ☐ C. VirtualBox                                 │
│ ☐ D. VMware                                     │
│                                                  │
│ Correct Answers: A, B                           │
└─────────────────────────────────────────────────┘
```

## 🎨 UI Components

### Single Answer Question (Radio Buttons)
```
┌──────────────────────────────────────────────────────┐
│  What is the capital of France?                      │
│                                                       │
│  ○ A. London                                         │
│  ○ B. Paris          ← User selects one             │
│  ○ C. Berlin                                         │
│  ○ D. Madrid                                         │
│                                                       │
│  [Submit Answer]                                     │
└──────────────────────────────────────────────────────┘
```

### Multiple Answer Question (Checkboxes)
```
┌──────────────────────────────────────────────────────┐
│  Which are programming languages?                    │
│  Select all that apply                               │
│                                                       │
│  ☑ A. Python         ← User can select multiple     │
│  ☑ B. JavaScript                                     │
│  ☐ C. HTML                                           │
│  ☑ D. Java                                           │
│                                                       │
│  [Submit Answer]                                     │
└──────────────────────────────────────────────────────┘
```

## 📊 CSV Format Comparison

### Single Answer CSV
```csv
skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation
Docker,beginner,What is Docker?,Container,VM,OS,DB,A,Docker is a container platform
```

### Multiple Answer CSV
```csv
skill,level,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation
Docker,beginner,Which are containers?,Docker,Podman,VBox,VMware,"A,B",Docker and Podman are containers
```

**Key Difference**: Quote the multiple answers → `"A,B"`

## 🗄️ Database Structure

### Single Answer Record
```json
{
  "id": "uuid-1",
  "question_text": "What is Docker?",
  "option_a": "Container platform",
  "option_b": "Virtual machine",
  "option_c": "Operating system",
  "option_d": "Database",
  "correct_answer": "A",
  "correct_answers": ["A"],
  "question_type": "single"
}
```

### Multiple Answer Record
```json
{
  "id": "uuid-2",
  "question_text": "Which are container platforms?",
  "option_a": "Docker",
  "option_b": "Kubernetes",
  "option_c": "VirtualBox",
  "option_d": "VMware",
  "correct_answer": "A",
  "correct_answers": ["A", "B"],
  "question_type": "multiple"
}
```

## 🎯 Answer Validation

### Single Answer Validation
```typescript
// User selected: ["A"]
// Correct answer: ["A"]
// Result: ✅ Correct

const isCorrect = 
  userAnswers.length === 1 && 
  userAnswers[0] === correctAnswer;
```

### Multiple Answer Validation
```typescript
// User selected: ["A", "B"]
// Correct answers: ["A", "B"]
// Result: ✅ Correct

const isCorrect = 
  userAnswers.length === correctAnswers.length &&
  userAnswers.every(a => correctAnswers.includes(a));

// User selected: ["A"]
// Correct answers: ["A", "B"]
// Result: ❌ Incorrect (missing B)

// User selected: ["A", "B", "C"]
// Correct answers: ["A", "B"]
// Result: ❌ Incorrect (extra C)
```

## 📈 Scoring Examples

### All-or-Nothing Scoring
```
Question: Which are React hooks? (A, B correct)

User Answer: A, B     → 10 points ✅
User Answer: A        → 0 points  ❌
User Answer: A, B, C  → 0 points  ❌
```

### Partial Credit Scoring
```
Question: Which are React hooks? (A, B correct)

User Answer: A, B     → 10 points (100%) ✅
User Answer: A        → 5 points  (50%)  ⚠️
User Answer: A, B, C  → 5 points  (50%)  ⚠️
User Answer: C, D     → 0 points  (0%)   ❌
```

### Penalty Scoring
```
Question: Which are React hooks? (A, B correct)

User Answer: A, B     → 10 points  ✅
User Answer: A        → 5 points   ⚠️
User Answer: A, B, C  → 3 points   ⚠️ (penalty for C)
User Answer: C, D     → -5 points  ❌ (penalty for wrong)
```

## 🎨 Frontend Code Examples

### React Component (Single Answer)
```tsx
const SingleAnswerQuestion = ({ question }) => {
  const [selected, setSelected] = useState('');
  
  return (
    <div className="question-card">
      <h3>{question.question_text}</h3>
      
      <div className="options">
        {['A', 'B', 'C', 'D'].map(letter => (
          <label key={letter} className="option">
            <input
              type="radio"
              name={question.id}
              value={letter}
              checked={selected === letter}
              onChange={(e) => setSelected(e.target.value)}
            />
            <span>{question[`option_${letter.toLowerCase()}`]}</span>
          </label>
        ))}
      </div>
      
      <button onClick={() => submitAnswer([selected])}>
        Submit
      </button>
    </div>
  );
};
```

### React Component (Multiple Answer)
```tsx
const MultipleAnswerQuestion = ({ question }) => {
  const [selected, setSelected] = useState<string[]>([]);
  
  const toggleAnswer = (letter: string) => {
    setSelected(prev =>
      prev.includes(letter)
        ? prev.filter(a => a !== letter)
        : [...prev, letter]
    );
  };
  
  return (
    <div className="question-card">
      <h3>{question.question_text}</h3>
      <p className="hint">Select all that apply</p>
      
      <div className="options">
        {['A', 'B', 'C', 'D'].map(letter => (
          <label key={letter} className="option">
            <input
              type="checkbox"
              value={letter}
              checked={selected.includes(letter)}
              onChange={() => toggleAnswer(letter)}
            />
            <span>{question[`option_${letter.toLowerCase()}`]}</span>
          </label>
        ))}
      </div>
      
      <button onClick={() => submitAnswer(selected)}>
        Submit ({selected.length} selected)
      </button>
    </div>
  );
};
```

### Smart Component (Auto-Detect)
```tsx
const SmartQuestion = ({ question }) => {
  if (question.question_type === 'single') {
    return <SingleAnswerQuestion question={question} />;
  } else {
    return <MultipleAnswerQuestion question={question} />;
  }
};
```

## 🎯 Real-World Examples

### Example 1: Docker Commands
```
┌──────────────────────────────────────────────────────┐
│  Which commands show container information?          │
│  Select all that apply                               │
│                                                       │
│  ☑ A. docker ps                                      │
│  ☑ B. docker info                                    │
│  ☐ C. docker list                                    │
│  ☐ D. docker show                                    │
│                                                       │
│  Correct: A, B                                       │
│  Explanation: docker ps shows running containers,    │
│  docker info shows system information                │
└──────────────────────────────────────────────────────┘
```

### Example 2: React Hooks
```
┌──────────────────────────────────────────────────────┐
│  Which are built-in React hooks?                     │
│  Select all that apply                               │
│                                                       │
│  ☑ A. useState                                       │
│  ☑ B. useEffect                                      │
│  ☐ C. useData                                        │
│  ☐ D. useComponent                                   │
│                                                       │
│  Correct: A, B                                       │
│  Explanation: useState and useEffect are built-in    │
│  React hooks. useData and useComponent don't exist   │
└──────────────────────────────────────────────────────┘
```

### Example 3: HTTP Methods
```
┌──────────────────────────────────────────────────────┐
│  Which HTTP methods are idempotent?                  │
│  Select all that apply                               │
│                                                       │
│  ☑ A. GET                                            │
│  ☑ B. PUT                                            │
│  ☐ C. POST                                           │
│  ☑ D. DELETE                                         │
│                                                       │
│  Correct: A, B, D                                    │
│  Explanation: GET, PUT, and DELETE are idempotent.   │
│  POST is not idempotent.                             │
└──────────────────────────────────────────────────────┘
```

## 🔄 Migration Flow

```
BEFORE MIGRATION
┌─────────────────────────────────────┐
│ practice_questions                  │
├─────────────────────────────────────┤
│ id                                  │
│ question_text                       │
│ option_a, option_b, option_c, d     │
│ correct_answer: "A"                 │
│ explanation                         │
└─────────────────────────────────────┘

AFTER MIGRATION
┌─────────────────────────────────────┐
│ practice_questions                  │
├─────────────────────────────────────┤
│ id                                  │
│ question_text                       │
│ option_a, option_b, option_c, d     │
│ correct_answer: "A"      ← kept     │
│ correct_answers: ["A"]   ← new      │
│ question_type: "single"  ← new      │
│ explanation                         │
└─────────────────────────────────────┘

NEW MULTIPLE ANSWER QUESTION
┌─────────────────────────────────────┐
│ practice_questions                  │
├─────────────────────────────────────┤
│ id                                  │
│ question_text                       │
│ option_a, option_b, option_c, d     │
│ correct_answer: "A"                 │
│ correct_answers: ["A","B","D"]      │
│ question_type: "multiple"           │
│ explanation                         │
└─────────────────────────────────────┘
```

## ✅ Quick Checklist

```
Setup:
□ Run add-multiple-correct-answers-support.sql
□ Verify migration successful

CSV Preparation:
□ Single answers: correct_answer = "A"
□ Multiple answers: correct_answer = "A,B,D" (with quotes!)
□ Test with example-multiple-answers.csv

Upload:
□ npm run upload:multiple-answers questions/your-file.csv
□ Verify upload successful
□ Check question_type field

Frontend:
□ Add checkbox component for multiple answers
□ Check question.question_type to render correct input
□ Show "Select all that apply" hint
□ Validate all correct answers selected

Testing:
□ Test single answer questions still work
□ Test multiple answer validation
□ Test partial selections (should be incorrect)
□ Test scoring logic
```

---

**Visual Guide Complete!** 🎉

See `MULTIPLE_ANSWERS_GUIDE.md` for implementation details.
