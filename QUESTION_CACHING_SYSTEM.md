# Intelligent Question Caching System

## Overview

The system implements an intelligent caching mechanism that stores AI-generated questions in Firebase and reuses them for future evaluations. This approach:

✅ **Reduces AI API costs** - Reuses questions instead of regenerating
✅ **Improves consistency** - Same questions for same skill/level/count
✅ **Faster response times** - Cached questions load instantly
✅ **Builds question bank** - Automatically grows over time
✅ **Supports diverse question types** - MCQ, Coding, Fill-in-blank, Matching, etc.

## How It Works

### 3-Tier Question Generation Strategy

```
Request: Generate 10 JavaScript INTERMEDIATE questions
    ↓
┌─────────────────────────────────────────────────┐
│ TIER 1: Check Evaluation Cache                 │
│ Key: JavaScript_INTERMEDIATE_10                 │
│ If found & fresh (< 7 days): Return cached     │
└─────────────────────────────────────────────────┘
    ↓ (Cache miss)
┌─────────────────────────────────────────────────┐
│ TIER 2: Check Question Bank                    │
│ Query: skill=JavaScript, level=INTERMEDIATE     │
│ If found >= 10 questions: Use them             │
└─────────────────────────────────────────────────┘
    ↓ (Insufficient questions)
┌─────────────────────────────────────────────────┐
│ TIER 3: Generate with AI                       │
│ - Generate missing questions                    │
│ - Validate each question                        │
│ - Store in question bank                        │
│ - Cache complete evaluation                     │
└─────────────────────────────────────────────────┘
```

## Diverse Question Types

### 1. Multiple Choice (MCQ) - 40%

**Single correct answer**

```json
{
  "type": "mcq",
  "question": "What is the output of: console.log(typeof null)?",
  "options": ["null", "undefined", "object", "number"],
  "correct_answer": "object"
}
```

### 2. Multi-Select - 20%

**Multiple correct answers**

```json
{
  "type": "multi_select",
  "question": "Which are valid JavaScript data types?",
  "options": ["String", "Integer", "Boolean", "Float"],
  "correct_answer": ["String", "Boolean"]
}
```

### 3. Coding Questions - 20%

**Write or debug code**

```json
{
  "type": "coding",
  "question": "Write a function to reverse a string",
  "code_snippet": "function reverseString(str) {\n  // Your code here\n}",
  "test_cases": [
    {
      "input": "hello",
      "expected_output": "olleh",
      "description": "Basic string reversal"
    },
    {
      "input": "",
      "expected_output": "",
      "description": "Empty string"
    }
  ],
  "correct_answer": "function reverseString(str) {\n  return str.split('').reverse().join('');\n}"
}
```

### 4. Fill in the Blank - 10%

**Complete the code**

```json
{
  "type": "fill_blank",
  "question": "Complete the variable declaration and console log",
  "blanks": {
    "text": "const x = __BLANK__;\nconsole.log(__BLANK__);",
    "answers": ["10", "x"]
  },
  "correct_answer": ["10", "x"]
}
```

### 5. Matching Questions - 10%

**Match concepts with descriptions**

```json
{
  "type": "matching",
  "question": "Match JavaScript concepts with their descriptions",
  "matching_pairs": {
    "left": ["Closure", "Promise", "Arrow Function"],
    "right": [
      "Async operation handler",
      "Function with lexical this",
      "Function with access to outer scope"
    ],
    "correct_matches": {
      "Closure": "Function with access to outer scope",
      "Promise": "Async operation handler",
      "Arrow Function": "Function with lexical this"
    }
  },
  "correct_answer": {
    "Closure": "Function with access to outer scope",
    "Promise": "Async operation handler",
    "Arrow Function": "Function with lexical this"
  }
}
```

## Caching Strategy

### Evaluation Cache

**Collection**: `evaluation_cache`

**Document ID**: `{skill}_{level}_{count}`

**Example**: `JavaScript_INTERMEDIATE_10`

**Structure**:
```json
{
  "evaluation_id": "uuid",
  "skill": "JavaScript",
  "evaluation_level": "INTERMEDIATE",
  "question_count": 10,
  "questions": [...],
  "cached_at": "2026-01-21T08:00:00Z",
  "last_used": "2026-01-21T08:00:00Z",
  "usage_count": 5
}
```

**Cache Expiry**: 7 days from last use

### Question Bank

**Collection**: `question_bank`

**Document ID**: `{question_id}`

**Structure**:
```json
{
  "question_id": "uuid",
  "skill_area": "JavaScript",
  "level": "INTERMEDIATE",
  "type": "coding",
  "question": "...",
  "correct_answer": "...",
  "verified": false,
  "usage_count": 3,
  "last_used": "2026-01-21T08:00:00Z",
  "created_at": "2026-01-20T10:00:00Z"
}
```

## Question Validation

Before storing, each question is validated:

### Common Validations
- ✅ Question text length >= 10 characters
- ✅ No hallucination indicators (e.g., "as an ai", "placeholder")
- ✅ No placeholder URLs (example.com)
- ✅ No lorem ipsum text

### Type-Specific Validations

**MCQ/Multi-Select:**
- ✅ At least 2 options
- ✅ No duplicate options
- ✅ Correct answer exists in options
- ✅ Correct answer is specified

**Coding:**
- ✅ Has code snippet or clear instructions
- ✅ Test cases are provided (optional but recommended)

**Fill in the Blank:**
- ✅ Has blanks data
- ✅ Answers array matches blank count

**Matching:**
- ✅ Has matching pairs
- ✅ Left and right arrays have same length
- ✅ Correct matches are specified

## API Flow

### Generate Questions Endpoint

```typescript
POST /api/questions/generate
{
  "skill": "JavaScript",
  "level": "INTERMEDIATE",
  "count": 10
}
```

**Response**:
```json
{
  "evaluation_id": "uuid",
  "questions": [
    // Questions without correct_answer field
  ]
}
```

### Internal Flow

```typescript
1. Check cache: JavaScript_INTERMEDIATE_10
   ├─ Found → Return cached questions (new evaluation_id)
   └─ Not found → Continue

2. Query question bank
   ├─ Found >= 10 → Use them
   └─ Found < 10 → Continue

3. Generate with AI
   ├─ Request 10 questions (mixed types)
   ├─ Validate each question
   ├─ Store valid questions in question bank
   └─ Cache complete evaluation

4. Return questions (sanitized, no correct answers)
```

## Benefits

### Cost Savings
- **First request**: AI API call ($)
- **Subsequent requests**: Free (cached)
- **Estimated savings**: 80-90% after initial generation

### Performance
- **Cache hit**: ~50ms response time
- **Question bank**: ~200ms response time
- **AI generation**: ~3-5s response time

### Quality
- **Validated questions**: Only quality questions stored
- **Diverse types**: Automatic mix of question types
- **Consistent difficulty**: Same level questions cached together

### Scalability
- **Auto-growing bank**: Questions accumulate over time
- **Smart expiry**: Old unused caches cleaned automatically
- **Usage tracking**: Popular questions identified

## Cache Management

### View Cache Statistics

```typescript
GET /api/admin/cache-stats

Response:
{
  "total_cached": 45,
  "by_skill": {
    "JavaScript": 15,
    "HTML": 10,
    "CSS": 10,
    "Python": 10
  },
  "by_level": {
    "BASIC": 15,
    "INTERMEDIATE": 20,
    "ADVANCED": 10
  },
  "most_used": [
    {
      "skill": "JavaScript",
      "level": "INTERMEDIATE",
      "count": 10,
      "usage_count": 25,
      "last_used": "2026-01-21T08:00:00Z"
    }
  ]
}
```

### Clear Old Cache

```typescript
POST /api/admin/clear-cache
{
  "days_old": 30
}

Response:
{
  "cleared": 12,
  "message": "Cleared 12 old cache entries"
}
```

## Implementation Files

### Backend
- `server/src/services/rag/RAGService.ts` - Caching logic
- `server/src/services/rag/QuestionBank.ts` - Question bank management
- `server/src/services/aiProviders/BaseAIProvider.ts` - Question generation
- `server/src/types/index.ts` - Type definitions

### Firebase Collections
- `evaluation_cache` - Cached evaluations
- `question_bank` - Individual questions
- `evaluations` - Active evaluations
- `questions` - Questions for active evaluations

## Configuration

### Environment Variables

```env
# RAG Configuration
RAG_ENABLED=true
RAG_STRATEGY=hybrid
RAG_QUESTION_BANK_PERCENTAGE=50
RAG_SIMILARITY_THRESHOLD=0.7

# Cache Settings (in code)
CACHE_EXPIRY_DAYS=7
CACHE_CLEANUP_DAYS=30
```

## Best Practices

### For Administrators

1. **Regular Cleanup**: Run cache cleanup monthly
2. **Monitor Usage**: Check cache stats weekly
3. **Verify Questions**: Manually verify unverified questions
4. **Update Bank**: Add high-quality questions manually

### For Developers

1. **Always Validate**: Validate questions before storing
2. **Handle Failures**: Graceful fallback to question bank
3. **Log Everything**: Track cache hits/misses
4. **Monitor Costs**: Track AI API usage

## Troubleshooting

### Cache Not Working

**Problem**: Questions regenerate every time

**Solutions**:
1. Check Firebase connection
2. Verify cache collection exists
3. Check cache key format
4. Review cache expiry settings

### Invalid Questions

**Problem**: AI generates invalid questions

**Solutions**:
1. Review validation rules
2. Update AI prompts
3. Add more validation checks
4. Manually verify and fix

### Slow Performance

**Problem**: Slow question generation

**Solutions**:
1. Check cache hit rate
2. Pre-populate question bank
3. Increase cache expiry time
4. Use faster AI provider

## Future Enhancements

- [ ] Question difficulty scoring
- [ ] Adaptive question selection
- [ ] User feedback on questions
- [ ] A/B testing different questions
- [ ] Question versioning
- [ ] Multi-language support
- [ ] Question tagging system
- [ ] Advanced analytics

## Metrics to Track

- Cache hit rate
- Question bank size
- AI API costs
- Average response time
- Question validation pass rate
- Most used question types
- User performance by question type

## Success Criteria

✅ Cache hit rate > 70%
✅ Question bank grows by 100+ questions/month
✅ AI API costs reduced by 80%
✅ Average response time < 500ms
✅ Question validation pass rate > 90%
