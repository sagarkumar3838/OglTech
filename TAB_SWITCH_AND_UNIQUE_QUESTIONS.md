# Tab Switch Detection & Unique Questions System

## 🎯 Overview

This system ensures test integrity with two key features:
1. **Unique Questions** - Users never see the same question twice
2. **Tab Switch Detection** - Test resets if user switches tabs/browsers

## 🔒 Tab Switch Detection

### How It Works

```
User starts test
    ↓
Session created with unique ID
    ↓
Tab switch detected (visibilitychange event)
    ↓
Warning shown (1st, 2nd switch)
    ↓
3rd switch → Test invalidated
    ↓
All progress lost, redirect to career page
```

### Features

- ✅ Detects tab switches using `visibilitychange` API
- ✅ Detects window minimize/blur
- ✅ 3 warnings before invalidation
- ✅ Visual warnings on each switch
- ✅ Automatic test reset on 3rd switch
- ✅ Session tracking in database

### Implementation

**Frontend Hook:**
```typescript
const { switchCount, isTabActive, isTestInvalidated } = useTabSwitchDetection({
  onTabSwitch: () => console.log('Tab switched!'),
  maxSwitches: 3,
  resetOnSwitch: true
});
```

**Backend Session:**
```typescript
// Create session when test starts
const sessionId = await sessionService.createSession(
  userId,
  evaluationId,
  skill,
  level,
  questionIds
);

// Record tab switch
const count = await sessionService.recordTabSwitch(sessionId);
if (count === -1) {
  // Test invalidated
}
```

## 🎲 Unique Questions System

### How It Works

```
User requests questions
    ↓
Fetch user's previously seen question IDs
    ↓
Generate new questions (AI/DB/JSON)
    ↓
Exclude previously seen questions
    ↓
Randomize order
    ↓
Return unique questions
    ↓
Store question IDs in session
```

### Features

- ✅ Tracks all questions user has seen
- ✅ Never repeats questions for same skill/level
- ✅ Randomizes question order
- ✅ Works across all 3 sources (AI, DB, JSON)
- ✅ Persists across sessions

### Implementation

**Get Unique Questions:**
```typescript
// Get user's previously seen questions
const seenQuestions = await sessionService.getUserSeenQuestions(
  userId,
  skill,
  level
);

// Generate new questions (excluding seen ones)
const questions = await questionService.generateQuestions(
  skill,
  level,
  count,
  useAI,
  userId,
  seenQuestions  // Exclude these
);
```

**Database Query:**
```sql
-- Fetch questions excluding previously seen
SELECT * FROM questions
WHERE skill = 'JavaScript'
  AND level = 'BASIC'
  AND question_id NOT IN ('q1', 'q2', 'q3')  -- Seen questions
ORDER BY RANDOM()
LIMIT 10;
```

## 📊 Database Schema

### evaluation_sessions Table

```sql
CREATE TABLE evaluation_sessions (
  id UUID PRIMARY KEY,
  session_id TEXT UNIQUE,
  user_id UUID NOT NULL,
  evaluation_id TEXT NOT NULL,
  skill TEXT NOT NULL,
  level TEXT NOT NULL,
  question_ids JSONB NOT NULL,  -- Questions shown in this session
  started_at TIMESTAMP,
  last_activity TIMESTAMP,
  completed_at TIMESTAMP,
  invalidated_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  tab_switches INTEGER DEFAULT 0,
  invalidation_reason TEXT
);
```

### Indexes

```sql
CREATE INDEX idx_sessions_user_skill_level 
ON evaluation_sessions(user_id, skill, level);

CREATE INDEX idx_sessions_is_active 
ON evaluation_sessions(is_active);
```

## 🚀 Setup Instructions

### Step 1: Add Session Table

Run `add-session-table.sql` in Supabase SQL Editor:
```
https://supabase.com/dashboard/project/ksjgsgebjnpwyycnptom/sql/new
```

### Step 2: Install Dependencies

```bash
cd server
npm install @supabase/supabase-js
```

### Step 3: Update Environment Variables

```env
VITE_SUPABASE_URL=https://ksjgsgebjnpwyycnptom.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
```

### Step 4: Test the System

```bash
# Start server
cd server
npm run dev

# Start client
cd client
npm run dev
```

## 🎨 User Experience

### Starting a Test

1. User clicks "Start Evaluation"
2. Session created with unique ID
3. Questions loaded (excluding previously seen)
4. Timer starts
5. Tab switch detection activated

### During Test

- **Tab Active**: Normal test flow
- **Tab Switch #1**: Yellow warning banner appears
- **Tab Switch #2**: Warning with "1 remaining"
- **Tab Switch #3**: Test invalidated, red error screen

### After Test

- **Completed**: Session marked as complete
- **Invalidated**: Session marked as invalidated
- **Timeout**: Session marked as timed out

## 📱 Visual Indicators

### Tab Switch Warning

```
┌─────────────────────────────────────┐
│ ⚠️ Tab Switch Detected!            │
│ Remaining warnings: 2/3             │
└─────────────────────────────────────┘
```

### Test Invalidated

```
┌─────────────────────────────────────┐
│         ❌ Test Invalidated         │
│                                     │
│ You switched tabs too many times   │
│ (3/3). The test has been reset.    │
│                                     │
│ Redirecting you back...            │
└─────────────────────────────────────┘
```

### Active Status

```
👁️ Tab Active | Tab Switches: 0/3
```

## 🔧 Configuration

### Adjust Tab Switch Limit

```typescript
// In Evaluation.tsx
const { switchCount, isTestInvalidated } = useTabSwitchDetection({
  maxSwitches: 5,  // Change from 3 to 5
  resetOnSwitch: true
});
```

### Adjust Session Timeout

```typescript
// In sessionService.ts
const hoursDiff = (now.getTime() - startedAt.getTime()) / (1000 * 60 * 60);
if (hoursDiff > 4) {  // Change from 2 to 4 hours
  await this.invalidateSession(sessionId, 'timeout');
}
```

### Adjust Test Duration

```typescript
// In Evaluation.tsx
const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes instead of 30
```

## 📊 Analytics

### Track Tab Switches

```sql
-- Get users with most tab switches
SELECT user_id, SUM(tab_switches) as total_switches
FROM evaluation_sessions
GROUP BY user_id
ORDER BY total_switches DESC;
```

### Track Invalidation Reasons

```sql
-- Get invalidation statistics
SELECT invalidation_reason, COUNT(*) as count
FROM evaluation_sessions
WHERE is_active = false
GROUP BY invalidation_reason;
```

### Track Question Reuse

```sql
-- Get most used questions
SELECT question_id, usage_count
FROM questions
ORDER BY usage_count DESC
LIMIT 10;
```

## 🛡️ Security Features

1. **Session Validation**: Every API call validates session
2. **RLS Policies**: Users can only access their own sessions
3. **Timeout Protection**: Sessions expire after 2 hours
4. **Tab Switch Limit**: Maximum 3 switches before reset
5. **Question Tracking**: Prevents question reuse

## 🚨 Edge Cases Handled

- ✅ User closes browser → Session invalidated
- ✅ User opens new tab → Detected and counted
- ✅ User minimizes window → Detected and counted
- ✅ Network disconnection → Session timeout
- ✅ Page refresh → Session invalidated
- ✅ Multiple browser windows → Each has own session

## 📈 Benefits

### For Users
- Fair testing environment
- Clear warnings before invalidation
- No surprise test resets

### For Platform
- Prevents cheating
- Ensures test integrity
- Tracks user behavior
- Provides analytics

### For Questions
- Never repeats questions
- Always fresh content
- Better learning experience
- Accurate skill assessment

## 🔄 Question Rotation Strategy

### First Attempt
- User gets 10 random questions from pool
- Questions stored in session

### Second Attempt
- System excludes previous 10 questions
- User gets 10 NEW questions
- Total seen: 20 questions

### Third Attempt
- System excludes previous 20 questions
- User gets 10 NEW questions
- Total seen: 30 questions

### When Pool Exhausted
- System generates new AI questions
- Or adds more to database
- Or cycles back with warning

## 📞 API Endpoints

### Create Session
```
POST /api/sessions/create
{
  "userId": "uuid",
  "evaluationId": "eval-123",
  "skill": "JavaScript",
  "level": "BASIC",
  "questionIds": ["q1", "q2", "q3"]
}
```

### Validate Session
```
GET /api/sessions/validate/:sessionId
```

### Record Tab Switch
```
POST /api/sessions/tab-switch
{
  "sessionId": "session-123"
}
```

### Get Seen Questions
```
GET /api/sessions/seen-questions/:userId/:skill/:level
```

## ✅ Testing Checklist

- [ ] Run `add-session-table.sql` in Supabase
- [ ] Test tab switch detection
- [ ] Verify 3-switch limit
- [ ] Test question uniqueness
- [ ] Verify session creation
- [ ] Test session validation
- [ ] Check RLS policies
- [ ] Test timeout handling
- [ ] Verify analytics queries

---

**Your tests are now secure and questions are always unique!** 🎉
