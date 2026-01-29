# Progressive Level Unlocking System

## Overview

The system implements a **gamified progression model** where users must complete each difficulty level before unlocking the next. This ensures:

✅ **Structured Learning** - Users progress from Basic → Intermediate → Advanced
✅ **Skill Validation** - Must pass each level to proceed
✅ **Progress Tracking** - Complete history of attempts and scores
✅ **Motivation** - Clear goals and achievements
✅ **Quality Control** - Ensures users have foundational knowledge

## How It Works

### Level Progression Flow

```
User selects OGL Content Developer career
    ↓
Views all skills with 3 levels each
    ↓
┌─────────────────────────────────────────┐
│ HTML Skill                              │
│ ├─ BASIC (🔓 Unlocked by default)      │
│ ├─ INTERMEDIATE (🔒 Locked)            │
│ └─ ADVANCED (🔒 Locked)                │
└─────────────────────────────────────────┘
    ↓
User takes BASIC level test
    ↓
Scores 75% (Pass threshold: 60%)
    ↓
✓ BASIC level marked as completed
✓ INTERMEDIATE level unlocked
    ↓
┌─────────────────────────────────────────┐
│ HTML Skill                              │
│ ├─ BASIC (✅ Completed - 75%)          │
│ ├─ INTERMEDIATE (🔓 Unlocked)          │
│ └─ ADVANCED (🔒 Locked)                │
└─────────────────────────────────────────┘
```

## OGL Career Paths

### 1. OGL Developer
**Experience**: Mid-Level
**Skills**:
- HTML (Required)
- CSS (Required)
- JavaScript (Required)
- TypeScript (Optional)
- React (Required)
- Node.js (Required)

### 2. OGL Tester
**Experience**: Entry-Level
**Skills**:
- Testing Tools (Required)
- JavaScript (Required)
- TypeScript (Optional)
- HTML (Required)
- CSS (Required)

### 3. OGL Frontend Developer
**Experience**: Mid-Level
**Skills**:
- HTML (Required)
- CSS (Required)
- JavaScript (Required)
- TypeScript (Required)
- React (Required)
- jQuery (Optional)

### 4. OGL Backend Developer
**Experience**: Mid-Level
**Skills**:
- JavaScript (Required)
- TypeScript (Required)
- Python (Required)
- Java (Required)
- Node.js (Required)

### 5. OGL DevOps Developer
**Experience**: Senior
**Skills**:
- Cloud Platforms (Required)
- Docker (Required)
- Kubernetes (Required)
- CI/CD (Required)
- Python (Required)

### 6. OGL Cloud Developer
**Experience**: Senior
**Skills**:
- Cloud Platforms (Required)
- JavaScript (Required)
- Python (Required)
- Serverless (Required)
- Microservices (Required)

### 7. OGL QA Developer
**Experience**: Entry-Level
**Skills**:
- Testing Tools (Required)
- TypeScript (Required)
- JavaScript (Required)
- Java (Optional)
- HTML (Required)
- CSS (Required)

### 8. OGL Content Developer
**Experience**: Fresher
**Skills**:
- HTML (Required)
- CSS (Required)
- JavaScript (Required)
- jQuery (Required)
- OGL Knowledge (Required)

## Passing Thresholds

### Score Requirements

| Level | Passing Score | Unlock Next Level |
|-------|--------------|-------------------|
| BASIC | 60% | Unlocks INTERMEDIATE |
| INTERMEDIATE | 70% | Unlocks ADVANCED |
| ADVANCED | 75% | Career skill completed |

### Level Readiness

| Score Range | Readiness | Description |
|-------------|-----------|-------------|
| 80%+ | EXCEEDS_EXPECTATION | Excellent performance |
| 60-79% | MEETS_EXPECTATION | Satisfactory performance |
| <60% | BELOW_EXPECTATION | Needs improvement |

## User Progress Tracking

### Firebase Collection: `user_progress`

**Document ID**: `{userId}_{careerId}`

**Structure**:
```json
{
  "user_id": "user123",
  "career_id": "ogl-content-developer",
  "skill_progress": [
    {
      "skill_name": "HTML",
      "current_level": "INTERMEDIATE",
      "unlocked_levels": ["BASIC", "INTERMEDIATE"],
      "levels_completed": [
        {
          "level": "BASIC",
          "completed": true,
          "score": 75,
          "best_score": 75,
          "attempts": 1,
          "completed_at": "2026-01-21T08:00:00Z",
          "scorecard_id": "scorecard123"
        },
        {
          "level": "INTERMEDIATE",
          "completed": false,
          "score": 0,
          "best_score": 0,
          "attempts": 0
        },
        {
          "level": "ADVANCED",
          "completed": false,
          "score": 0,
          "best_score": 0,
          "attempts": 0
        }
      ]
    }
  ],
  "created_at": "2026-01-20T10:00:00Z",
  "updated_at": "2026-01-21T08:00:00Z"
}
```

## UI Features

### Level Cards

Each skill displays 3 level cards:

**Unlocked Level**:
```
┌─────────────────────────────────┐
│ Level 1                    🔓   │
│ BASIC                           │
│ Understands the script and      │
│ basic concepts                  │
│                                 │
│ Best Score: 75%                 │
│ Attempts: 1                     │
│ ✓ Completed                     │
└─────────────────────────────────┘
```

**Locked Level**:
```
┌─────────────────────────────────┐
│ Level 2                    🔒   │
│ INTERMEDIATE                    │
│ Can alter, debug, and modify    │
│ code                            │
│                                 │
│ 🔒 Complete previous level to   │
│    unlock                       │
└─────────────────────────────────┘
```

**Completed Level**:
```
┌─────────────────────────────────┐
│ Level 1                    ✅   │
│ BASIC                           │
│ Understands the script and      │
│ basic concepts                  │
│                                 │
│ Best Score: 85%                 │
│ Attempts: 2                     │
│ ✅ Completed                    │
└─────────────────────────────────┘
```

### Progress Overview

At the top of each career page:

```
┌─────────────────────────────────────────────┐
│ 🏆 Your Progress                            │
│                                             │
│ Skills Completed: 2 / 5                     │
│ Levels Completed: 8 / 15                    │
│ Average Score: 78%                          │
└─────────────────────────────────────────────┘
```

## API Endpoints

### Get User Progress
```
GET /api/progress/:userId/:careerId

Response:
{
  "user_id": "user123",
  "career_id": "ogl-content-developer",
  "skill_progress": [...]
}
```

### Update Progress
```
POST /api/progress/update
{
  "userId": "user123",
  "careerId": "ogl-content-developer",
  "skillName": "HTML",
  "level": "BASIC",
  "score": 75,
  "scorecardId": "scorecard123"
}
```

### Check Level Unlock
```
GET /api/progress/check-unlock/:userId/:careerId/:skillName/:level

Response:
{
  "unlocked": true
}
```

### Get Progress Stats
```
GET /api/progress/stats/:userId/:careerId

Response:
{
  "total_skills": 5,
  "completed_skills": 2,
  "total_levels": 15,
  "completed_levels": 8,
  "average_score": 78,
  "completion_percentage": 53
}
```

## Implementation Flow

### 1. User Selects Career

```javascript
// Navigate to career detail page
navigate(`/careers/ogl-content-developer`);
```

### 2. Load Career and Progress

```javascript
// Fetch career data
const career = await getCareerById(careerId);

// Fetch or initialize user progress
const progress = await getUserProgress(userId, careerId);
```

### 3. Display Levels with Lock Status

```javascript
const isUnlocked = (skillName, level) => {
  const skillProgress = progress.skill_progress.find(
    sp => sp.skill_name === skillName
  );
  return skillProgress?.unlocked_levels.includes(level);
};
```

### 4. Start Evaluation

```javascript
// Check if level is unlocked
if (!isUnlocked(skillName, level)) {
  alert('Level is locked!');
  return;
}

// Generate questions
const evaluation = await generateQuestions(skill, level, 10);
navigate(`/evaluation/${evaluation.evaluation_id}`);
```

### 5. Submit and Update Progress

```javascript
// Submit evaluation
const submission = await submitEvaluation(data);

// Generate scorecard (automatically updates progress)
const scorecard = await generateScorecard({
  submissionId: submission.id,
  careerId,
  skillName,
  level
});
```

## Seeding Career Data

### Seed OGL Careers

```bash
cd server
npm run seed:ogl-careers
```

This creates all 8 OGL career paths with their required skills.

## Benefits

### For Users
- **Clear Path**: Know exactly what to learn next
- **Motivation**: Unlock achievements as you progress
- **Confidence**: Build skills progressively
- **Validation**: Prove competency at each level

### For Organizations
- **Quality Assurance**: Ensure foundational knowledge
- **Structured Training**: Standardized learning paths
- **Progress Tracking**: Monitor employee development
- **Skill Validation**: Verify competency levels

## Best Practices

### For Administrators

1. **Set Appropriate Thresholds**: Adjust passing scores based on difficulty
2. **Monitor Progress**: Track completion rates and identify bottlenecks
3. **Update Content**: Keep questions relevant and challenging
4. **Provide Feedback**: Help users understand why they didn't pass

### For Users

1. **Start with BASIC**: Don't skip levels
2. **Review Mistakes**: Learn from failed attempts
3. **Practice**: Retake levels to improve scores
4. **Complete All Skills**: Don't leave skills incomplete

## Troubleshooting

### Level Not Unlocking

**Problem**: Passed previous level but next level still locked

**Solutions**:
1. Check if score meets passing threshold
2. Verify progress was updated in database
3. Refresh the page
4. Check browser console for errors

### Progress Not Saving

**Problem**: Progress resets after page refresh

**Solutions**:
1. Verify user is logged in
2. Check Firebase connection
3. Review browser console for API errors
4. Ensure careerId and skillName match exactly

### Can't Start Evaluation

**Problem**: Button disabled even though level appears unlocked

**Solutions**:
1. Check if user is authenticated
2. Verify level is actually unlocked in database
3. Clear browser cache
4. Check for JavaScript errors

## Future Enhancements

- [ ] Skill prerequisites (e.g., must complete HTML before CSS)
- [ ] Time-based unlocks (wait period between attempts)
- [ ] Bonus challenges for high scorers
- [ ] Leaderboards per skill/level
- [ ] Certificates for completed careers
- [ ] Skill badges and achievements
- [ ] Peer comparison analytics
- [ ] Recommended learning resources

## Success Metrics

- **Completion Rate**: % of users who complete all levels
- **Average Attempts**: How many tries to pass each level
- **Time to Complete**: Average time from start to finish
- **Score Improvement**: Progress from first to best attempt
- **Drop-off Points**: Where users stop progressing

## Conclusion

The Progressive Level Unlocking System provides a structured, gamified approach to skill development that benefits both users and organizations. By ensuring users master each level before advancing, the system maintains quality standards while keeping users motivated through clear goals and achievements.
