# Scorecard Enhancement Plan

## 🎯 Requirements

### 1. Simplify Skill Dimension Scores
- Remove for Easy/Basic level tests
- Keep only for Medium and Hard levels
- Show only relevant dimensions

### 2. Enhanced Question-Wise Breakdown
- Show the actual question text
- Display user's answer vs correct answer
- Add explanation for wrong answers
- Link to specific topics

### 3. Topic-Based Strengths & Gaps
- Replace generic text with specific topics
- Example: "HTML Forms", "CSS Flexbox", "JavaScript Promises"
- Show which topics user mastered vs needs practice

### 4. Learning Resources
- **MDN Links**: Official documentation
- **QuickRef.me**: Quick reference guides
- **YouTube Videos**: Multiple languages
  - English
  - Hindi
  - Malayalam
  - Telugu
  - Kannada

### 5. Database Storage
- Store all learning resources
- Save question explanations
- Track which resources user accessed

## 📊 Database Changes Needed

### 1. Add `topic` column to questions table
```sql
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS topic TEXT,
ADD COLUMN IF NOT EXISTS explanation TEXT,
ADD COLUMN IF NOT EXISTS mdn_link TEXT,
ADD COLUMN IF NOT EXISTS quickref_link TEXT;
```

### 2. Create learning_resources table
```sql
CREATE TABLE learning_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill TEXT NOT NULL,
  topic TEXT NOT NULL,
  resource_type TEXT NOT NULL, -- 'mdn', 'quickref', 'youtube'
  language TEXT, -- 'en', 'hi', 'ml', 'te', 'kn'
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Create user_learning_history table
```sql
CREATE TABLE user_learning_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  scorecard_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  resource_id UUID REFERENCES learning_resources(id),
  accessed_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Update scorecards table
```sql
ALTER TABLE scorecards
ADD COLUMN IF NOT EXISTS topics_mastered JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS topics_to_practice JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS learning_resources JSONB DEFAULT '[]'::jsonb;
```

## 🔧 Implementation Steps

### Phase 1: Database Setup (Priority: HIGH)
1. Run SQL migrations to add columns
2. Create learning_resources table
3. Create user_learning_history table
4. Seed initial learning resources

### Phase 2: Question Enhancement (Priority: HIGH)
1. Add topic field to question upload
2. Add explanation field
3. Add resource links (MDN, QuickRef)
4. Update existing questions with topics

### Phase 3: Evaluation Logic (Priority: MEDIUM)
1. Track which topics each question belongs to
2. Analyze wrong answers by topic
3. Generate topic-based strengths/gaps
4. Save detailed breakdown to database

### Phase 4: Scorecard UI (Priority: MEDIUM)
1. Conditionally show Skill Dimensions (only for Medium/Hard)
2. Enhanced Question Breakdown with:
   - Question text
   - User answer vs correct answer
   - Explanation
   - Topic tag
3. Topic-based Strengths & Gaps
4. Learning Resources section with:
   - MDN links
   - QuickRef links
   - YouTube videos (multi-language)

### Phase 5: Resource Management (Priority: LOW)
1. Admin panel to add/edit resources
2. Track resource usage
3. Recommend most helpful resources
4. User feedback on resources

## 📝 Example Data Structure

### Question with Topic & Resources
```json
{
  "question_id": "html_001",
  "skill": "html",
  "topic": "HTML Forms",
  "question": "What is the purpose of the <label> element?",
  "explanation": "The <label> element provides a text description for form inputs...",
  "mdn_link": "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label",
  "quickref_link": "https://quickref.me/html#forms"
}
```

### Learning Resources
```json
{
  "skill": "html",
  "topic": "HTML Forms",
  "resources": [
    {
      "type": "mdn",
      "url": "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form",
      "title": "HTML Forms - MDN"
    },
    {
      "type": "youtube",
      "language": "en",
      "url": "https://youtube.com/watch?v=...",
      "title": "HTML Forms Tutorial"
    },
    {
      "type": "youtube",
      "language": "hi",
      "url": "https://youtube.com/watch?v=...",
      "title": "HTML Forms - Hindi"
    }
  ]
}
```

### Enhanced Scorecard Data
```json
{
  "scorecard_id": "sc_123",
  "topics_mastered": [
    "HTML Semantic Elements",
    "HTML Attributes"
  ],
  "topics_to_practice": [
    {
      "topic": "HTML Forms",
      "questions_wrong": 2,
      "resources": [
        {
          "type": "mdn",
          "url": "...",
          "title": "..."
        },
        {
          "type": "youtube",
          "language": "hi",
          "url": "...",
          "title": "..."
        }
      ]
    }
  ]
}
```

## 🎨 UI Mockup

### Question Breakdown (Enhanced)
```
Question 1: What is the purpose of the <label> element?
❌ Your Answer: To style form inputs
✅ Correct Answer: To provide accessible labels for form controls

📚 Topic: HTML Forms
💡 Explanation: The <label> element associates text with form controls...

📖 Learn More:
- MDN: HTML Forms [link]
- QuickRef: HTML Forms Cheat Sheet [link]
- 🎥 YouTube (English): HTML Forms Tutorial [link]
- 🎥 YouTube (Hindi): HTML Forms - हिंदी में [link]
- 🎥 YouTube (Malayalam): HTML Forms - മലയാളം [link]
```

### Strengths & Gaps (Topic-Based)
```
✅ Topics You Mastered:
- HTML Semantic Elements (3/3 correct)
- HTML Attributes (2/2 correct)

⚠️ Topics to Practice:
- HTML Forms (1/3 correct)
  📖 Resources: [MDN] [QuickRef] [YouTube EN] [YouTube HI]
- HTML Tables (0/2 correct)
  📖 Resources: [MDN] [QuickRef] [YouTube EN] [YouTube HI]
```

## 🚀 Quick Start (Minimal Implementation)

For immediate improvement without full database changes:

1. **Add topic mapping** in frontend code:
```typescript
const topicMap = {
  'html_form': 'HTML Forms',
  'html_semantic': 'HTML Semantic Elements',
  'css_flexbox': 'CSS Flexbox',
  // ...
};
```

2. **Add resource links** in frontend:
```typescript
const resources = {
  'HTML Forms': {
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form',
    quickref: 'https://quickref.me/html#forms',
    youtube: {
      en: 'https://youtube.com/...',
      hi: 'https://youtube.com/...',
      ml: 'https://youtube.com/...'
    }
  }
};
```

3. **Update Scorecard** to show resources for wrong answers

## 📅 Timeline Estimate

- **Phase 1 (Database)**: 2-3 hours
- **Phase 2 (Questions)**: 4-5 hours
- **Phase 3 (Evaluation)**: 3-4 hours
- **Phase 4 (Scorecard UI)**: 4-5 hours
- **Phase 5 (Admin)**: 3-4 hours

**Total**: 16-21 hours for complete implementation

## ⚠️ Important Notes

1. **Content Creation**: Adding topics, explanations, and resources for all questions is time-consuming
2. **YouTube Links**: Need to curate quality videos in each language
3. **Maintenance**: Resources need to be kept up-to-date
4. **Scalability**: Consider using a CMS or admin panel for resource management

## 🎯 Recommended Approach

**Start Small**:
1. Implement for one skill (HTML) first
2. Add 5-10 topics with resources
3. Test with users
4. Expand to other skills based on feedback

**Iterate**:
1. V1: Basic topic mapping + MDN links
2. V2: Add QuickRef + YouTube (English)
3. V3: Add multi-language videos
4. V4: User feedback & recommendations
