# Difficulty Levels Feature

## Overview

The Skill Evaluation Platform supports **three difficulty levels** for each skill assessment:

1. **Basic** - Level 1
2. **Intermediate** - Level 2  
3. **Advanced** - Level 3

## How It Works

### User Flow

1. User selects a **Career Path** (e.g., OGL Content Developer, OGL SDE, OGL QA)
2. System displays all **required skills** for that career
3. For each skill, user can choose a **difficulty level**:
   - **Basic**: Understands the script and basic concepts
   - **Intermediate**: Can alter, debug, and modify code
   - **Advanced**: Can create complete applications from scratch
4. System generates questions based on the selected skill and difficulty level
5. User completes the evaluation
6. System generates a scorecard with performance analysis

### Supported Skills

The platform currently supports the following skills:

- **HTML** - Markup language for web pages
- **CSS** - Styling and layout
- **JavaScript** - Programming language for web interactivity
- **TypeScript** - Typed superset of JavaScript
- **Java** - Object-oriented programming language
- **Python** - General-purpose programming language
- **React** - JavaScript library for building UIs
- **jQuery** - JavaScript library for DOM manipulation
- **Testing Tools** - Automated testing frameworks
- **OGL Knowledge** - Organization-specific knowledge

### Career Paths

#### 1. OGL Content Developer (Fresher)
**Target**: Entry-level freshers
**Skills Required**:
- HTML (Basic+)
- CSS (Basic+)
- JavaScript (Basic+)
- jQuery (Basic+)
- OGL Knowledge (Basic+)

#### 2. OGL Software Development Engineer (Experienced)
**Target**: Experienced developers
**Skills Required**:
- HTML (Intermediate+)
- CSS (Intermediate+)
- JavaScript (Advanced)
- Java (Intermediate+)
- Python (Intermediate+)
- React (Intermediate+)

#### 3. OGL QA Engineer (Entry Level)
**Target**: Freshers/Entry-level QA
**Skills Required**:
- TypeScript (Basic+)
- Testing Tools (Intermediate+)
- Java (Basic+)
- HTML (Basic+)
- CSS (Basic+)

## Technical Implementation

### Backend

**Question Generation** (`server/src/routes/questions.ts`):
```typescript
POST /api/questions/generate
{
  "skill": "HTML",
  "level": "BASIC" | "INTERMEDIATE" | "ADVANCED",
  "count": 10
}
```

**Valid Levels**:
- `BASIC`
- `INTERMEDIATE`
- `ADVANCED`

**RAG Service** (`server/src/services/rag/RAGService.ts`):
- Fetches questions from question bank based on skill and level
- Falls back to AI generation if question bank is insufficient
- Supports multiple AI providers (Google, Groq, DeepSeek, OpenAI, etc.)

### Frontend

**Career Detail Page** (`client/src/pages/CareerDetail.jsx`):
- Displays all skills for a career
- Shows three difficulty level buttons for each skill
- Handles evaluation initiation

**Evaluation Page** (`client/src/pages/Evaluation.jsx`):
- Displays questions one by one
- Tracks user answers
- Submits evaluation for scoring

**Scorecard Page** (`client/src/pages/Scorecard.jsx`):
- Shows overall score
- Displays AI-generated performance analysis
- Provides recommendations for improvement

## Seeding Career Data

To populate the database with career paths:

```bash
cd server
npm run seed:careers
```

This will create the three career paths with their associated skills and difficulty requirements.

## Adding New Skills

To add a new skill:

1. Update `server/src/routes/questions.ts`:
```typescript
const validSkills = [
  'HTML',
  'CSS',
  'JavaScript',
  // ... existing skills
  'YourNewSkill'  // Add here
];
```

2. Add questions to the question bank or ensure AI can generate them

3. Update career paths to include the new skill if needed

## Question Bank Structure

Questions in Firestore should follow this structure:

```json
{
  "question_id": "unique-id",
  "skill_area": "HTML",
  "level": "BASIC",
  "type": "multiple_choice",
  "question": "What does HTML stand for?",
  "options": ["...", "...", "...", "..."],
  "correct_answer": "...",
  "difficulty_weight": 10,
  "verified": true
}
```

## Best Practices

1. **Question Distribution**: Ensure balanced questions across all difficulty levels
2. **Skill Coverage**: Each skill should have sufficient questions at each level
3. **Regular Updates**: Keep question bank fresh and relevant
4. **AI Fallback**: Always have AI generation as backup when question bank is insufficient
5. **User Experience**: Clearly communicate difficulty level expectations to users

## Future Enhancements

- [ ] Custom difficulty levels per organization
- [ ] Adaptive testing (adjust difficulty based on performance)
- [ ] Skill prerequisites (must pass Basic before Intermediate)
- [ ] Time limits per difficulty level
- [ ] Certification badges for each level
- [ ] Leaderboards per skill and level
