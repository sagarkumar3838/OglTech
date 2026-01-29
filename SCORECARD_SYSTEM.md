# Enterprise Scorecard System

## Overview

The Candidate Scorecard is a comprehensive, enterprise-ready evaluation report that provides objective, rubrics-based scoring aligned with the Basic → Intermediate → Advanced maturity model.

## Scorecard Structure

### 1️⃣ Header Section (Identity)

**Displayed Information:**
- Candidate Name
- Evaluation Date
- Skill Evaluated (HTML / CSS / JavaScript / etc.)
- Level Attempted (Basic / Intermediate / Advanced)
- Evaluation ID

### 2️⃣ Overall Performance Summary

**Big, Visible Metrics:**
- **Overall Score**: Percentage score (0-100%)
- **Level Readiness**: 
  - `EXCEEDS_EXPECTATION` - Candidate exceeds level requirements
  - `MEETS_EXPECTATION` - Candidate meets level requirements
  - `BELOW_EXPECTATION` - Candidate below level requirements
- **Hiring Recommendation**: 
  - `STRONG_HIRE` - Production-ready
  - `CONSIDER` - Trainable, role-dependent
  - `NO_HIRE` - Fundamentals missing
- **Confidence Band**: Based on dimension scores consistency

### 3️⃣ Skill Maturity Indicator

**Maturity Levels:**

| Level | Signal | Description |
|-------|--------|-------------|
| Basic | Can read & understand | Understands the script and basic concepts |
| Intermediate | Can debug & reason | Can alter, debug, and modify code |
| Advanced | Can design & build | Can create complete applications from scratch |

**Observed Maturity Examples:**
- Below-Basic
- Basic
- Upper-Basic
- Lower-Intermediate
- Intermediate
- Upper-Intermediate
- Advanced
- Expert

## Scoring Logic

### Level Readiness Thresholds

#### Basic Level
- **EXCEEDS_EXPECTATION**: Score ≥ 80%
- **MEETS_EXPECTATION**: Score ≥ 60%
- **BELOW_EXPECTATION**: Score < 60%

#### Intermediate Level
- **EXCEEDS_EXPECTATION**: Score ≥ 85%
- **MEETS_EXPECTATION**: Score ≥ 70%
- **BELOW_EXPECTATION**: Score < 70%

#### Advanced Level
- **EXCEEDS_EXPECTATION**: Score ≥ 90%
- **MEETS_EXPECTATION**: Score ≥ 75%
- **BELOW_EXPECTATION**: Score < 75%

### Dimension Scores

Questions are categorized into skill dimensions:

| Dimension | Question Types | Interpretation |
|-----------|---------------|----------------|
| **Correctness** | MCQ, Multi-select | Accuracy of answers |
| **Reasoning** | Code reasoning, Assertion-reason | Logical thinking ability |
| **Debugging** | Scenario (debug) | Problem identification skills |
| **Design Thinking** | Scenario (design) | Architectural thinking (Advanced only) |

### Hiring Recommendation Logic

```
IF level_readiness == BELOW_EXPECTATION:
    recommendation = NO_HIRE

ELSE IF level == ADVANCED AND score >= 85 AND level_readiness == EXCEEDS_EXPECTATION:
    recommendation = STRONG_HIRE

ELSE IF level == INTERMEDIATE AND score >= 80 AND level_readiness == EXCEEDS_EXPECTATION:
    recommendation = STRONG_HIRE

ELSE IF score >= 75 AND level_readiness == MEETS_EXPECTATION:
    recommendation = CONSIDER

ELSE IF score >= 60:
    recommendation = CONSIDER

ELSE:
    recommendation = NO_HIRE
```

## Scorecard Sections

### Section 1: Skill Dimension Scores

Visual breakdown with:
- Dimension name
- Score percentage
- Interpretation text
- Color-coded progress bar

**Example:**
```
Correctness        ████████░░ 80%
Interpretation: Answers largely accurate

Reasoning          ███████░░░ 70%
Interpretation: Logical but incomplete

Debugging          ████████░░ 75%
Interpretation: Identifies issues correctly
```

### Section 2: Question-Wise Breakdown (Expandable)

For each question:
- Question ID (Q1, Q2, etc.)
- Type (MCQ / Debugging / Design)
- Max Marks
- Marks Awarded
- Correct/Incorrect indicator

**Example:**
```
Q5 – Debugging
✔ Issue identified
❌ Fix partially correct
Score: 6 / 10
```

### Section 3: Strengths & Gaps

**✅ Demonstrated Strengths:**
- Understands JavaScript event handling
- Can reason through DOM behavior
- Good grasp of CSS layout fundamentals

**⚠️ Identified Gaps:**
- Weak error-handling strategy
- Limited application-level design thinking
- Accessibility considerations missing

### Section 4: Readiness & Recommendations

**🎯 Level Readiness:**
- READY FOR: Intermediate+ level roles
- NOT READY FOR: Advanced (Design-heavy roles)

**📚 Learning Recommendations:**
- Practice debugging async JavaScript flows
- Study scalable CSS architecture (BEM / utility-first)
- Build one end-to-end mini application

### Section 5: Final Hiring Recommendation

Clear, defensible output for hiring panels:

| Recommendation | Meaning |
|----------------|---------|
| NO_HIRE | Fundamentals missing |
| CONSIDER | Trainable, role-dependent |
| STRONG_HIRE | Production-ready |

**Example:**
```
Recommendation: CONSIDER
"Candidate shows solid intermediate skills but lacks 
advanced architectural thinking. Suitable for junior 
to mid-level frontend role with mentoring."
```

## Backend JSON Schema

```json
{
  "candidate_name": "John Doe",
  "evaluation_id": "EVL-2026-001",
  "skill": "JavaScript",
  "level_attempted": "INTERMEDIATE",
  "overall_score": 78,
  "level_readiness": "MEETS_EXPECTATION",
  "observed_maturity": "Upper-Intermediate",
  "dimension_scores": {
    "correctness": 80,
    "reasoning": 70,
    "debugging": 75,
    "design_thinking": 60
  },
  "question_breakdown": [
    {
      "question_id": "Q5",
      "type": "debugging",
      "max_marks": 10,
      "awarded_marks": 6,
      "is_correct": false
    }
  ],
  "strengths": [
    "DOM event handling",
    "Logical reasoning"
  ],
  "gaps": [
    "Async error handling",
    "Application-level design"
  ],
  "recommendations": [
    "Practice async debugging",
    "Build end-to-end projects"
  ],
  "hiring_recommendation": "CONSIDER",
  "evaluator_summary": "Candidate shows solid intermediate skills but lacks advanced architectural thinking.",
  "created_at": "2026-01-21T07:00:00Z"
}
```

## UI Features

### Visual Design
- **Gradient Header**: Blue gradient with white text
- **Color-Coded Metrics**: 
  - Green: Excellent (80%+)
  - Yellow: Good (60-79%)
  - Red: Needs Improvement (<60%)
- **Progress Bars**: Animated, color-coded
- **Icons**: Lucide React icons for visual clarity
- **Expandable Sections**: Question breakdown can be toggled

### Print Support
- Optimized for PDF generation
- Print button triggers browser print dialog
- Print-friendly styling (removes interactive elements)

### Responsive Design
- Mobile-friendly layout
- Grid system adapts to screen size
- Touch-friendly buttons

## Why This Scorecard Works

✔ **Objective & rubric-aligned** - Based on clear scoring criteria
✔ **Clear for HR + Tech interviewers** - Easy to understand for all stakeholders
✔ **Defensible in audits** - Transparent scoring methodology
✔ **Maps directly to job readiness** - Clear hiring recommendations
✔ **Scales across skills & levels** - Works for all technologies and difficulty levels

## Implementation Files

### Backend
- `server/src/services/scorecardGenerator.ts` - Scorecard generation logic
- `server/src/types/index.ts` - TypeScript interfaces
- `server/src/routes/scorecards.ts` - API endpoints

### Frontend
- `client/src/pages/Scorecard.jsx` - Scorecard UI component
- `client/src/services/api.js` - API integration

## Usage

### Generate Scorecard (Backend)
```typescript
import { generateScorecard } from './services/scorecardGenerator';

const scorecard = await generateScorecard({
  answers: userAnswers,
  questions: evaluationQuestions,
  skill: 'JavaScript',
  level: 'INTERMEDIATE',
  candidateName: 'John Doe',
  userId: 'user123'
});
```

### Display Scorecard (Frontend)
```javascript
// Navigate to scorecard page
navigate(`/scorecard/${scorecardId}`);

// Or fetch directly
const response = await getScorecard(scorecardId);
setScorecard(response.data);
```

## Future Enhancements

- [ ] PDF export with custom branding
- [ ] Email scorecard to candidate
- [ ] Comparison view (multiple candidates)
- [ ] Historical performance tracking
- [ ] Role-fit mapping
- [ ] Team analytics dashboard
- [ ] Custom rubrics per organization
- [ ] Multi-language support

## Best Practices

1. **Consistent Scoring**: Use the same rubrics across all evaluations
2. **Regular Calibration**: Review and adjust thresholds based on hiring outcomes
3. **Transparent Communication**: Share scorecard with candidates for feedback
4. **Data Privacy**: Secure storage of evaluation data
5. **Continuous Improvement**: Update question bank based on scorecard insights

## Support

For questions or issues with the scorecard system, refer to:
- `DIFFICULTY_LEVELS.md` - Difficulty level implementation
- `RAG_GUIDE.md` - Question generation system
- `GETTING_STARTED.md` - Setup instructions
