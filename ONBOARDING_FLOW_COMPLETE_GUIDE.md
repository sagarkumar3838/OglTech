# Complete Onboarding Flow - Implementation Guide

## Overview
A comprehensive onboarding system that guides users from signup to taking tests, with full progress tracking.

## User Journey Flow

```
1. Sign Up
   ↓
2. Complete Profile (Name, Location, Experience, etc.)
   ↓
3. Choose Career (Select 1-2 careers)
   ↓
4. Take First Test (Easy level)
   ↓
5. View Results & Progress
   ↓
6. Continue Learning (Dashboard shows all progress)
```

## Database Tables

### 1. `user_onboarding_status`
Tracks where user is in onboarding process:
- `profile_completed`: Has user filled profile?
- `career_selected`: Has user chosen career?
- `first_test_taken`: Has user taken first test?
- `onboarding_completed`: Is onboarding done?
- `current_step`: Current step ('profile', 'career', 'test', 'completed')

### 2. `user_profiles` (Enhanced)
Stores user profile information:
- `full_name`, `phone`, `location`
- `education_level`, `years_of_experience`
- `current_role`, `bio`
- `linkedin_url`, `github_url`, `portfolio_url`
- `profile_picture_url`
- `is_profile_complete`

### 3. `user_test_performance`
Comprehensive test performance tracking:

**Per Level (Easy, Medium, Hard):**
- Attempts count
- Best score
- Best percentage
- Passed status
- Last attempt date

**Overall:**
- Total attempts
- Average score
- Skill mastery level (beginner/intermediate/advanced/expert)

### 4. `user_dashboard_stats` (View)
Real-time dashboard statistics:
- Profile completion status
- Onboarding step
- Active careers
- Total tests taken
- Tests passed
- Average score
- Skills mastered
- Skills in progress
- Unread recommendations
- Last activity date

## Step-by-Step Implementation

### Step 1: Database Setup

Run in Supabase SQL Editor:
```sql
-- Run this file
create-onboarding-flow-system.sql
```

This creates:
- All necessary tables
- RLS policies
- Automatic triggers
- Helper functions
- Dashboard view

### Step 2: First Login Detection

When user logs in, check onboarding status:

```typescript
import { getOnboardingStatus, getNextOnboardingStep } from '@/services/onboardingService';

// In Dashboard component
useEffect(() => {
  const checkOnboarding = async () => {
    const status = await getOnboardingStatus(user.id);
    
    if (!status?.onboarding_completed) {
      const nextStep = getNextOnboardingStep(status);
      // Redirect to appropriate step
      if (nextStep.step === 'profile') {
        navigate('/profile/complete');
      } else if (nextStep.step === 'career') {
        navigate('/careers');
      } else if (nextStep.step === 'test') {
        navigate('/careers'); // Show "Take Test" prompt
      }
    }
  };
  
  checkOnboarding();
}, [user]);
```

### Step 3: Profile Completion

```typescript
import { completeProfile } from '@/services/onboardingService';

const handleProfileSubmit = async (formData) => {
  const success = await completeProfile(user.id, {
    full_name: formData.name,
    phone: formData.phone,
    location: formData.location,
    education_level: formData.education,
    years_of_experience: formData.experience,
    current_role: formData.role,
    linkedin_url: formData.linkedin,
    github_url: formData.github,
    bio: formData.bio
  });
  
  if (success) {
    // Redirect to career selection
    navigate('/careers');
  }
};
```

### Step 4: Career Selection

```typescript
import { selectCareer, updateOnboardingStep } from '@/services/careerProgressionService';
import { updateOnboardingStep } from '@/services/onboardingService';

const handleCareerSelect = async (careerId, careerName) => {
  await selectCareer(user.id, careerId, careerName, 1);
  await updateOnboardingStep(user.id, 'career');
  
  // Show "Take First Test" prompt
  setShowTestPrompt(true);
};
```

### Step 5: Record Test Results

```typescript
import { recordTestPerformance } from '@/services/onboardingService';
import { saveTestResult } from '@/services/careerProgressionService';

const handleTestComplete = async (results) => {
  // Save to test results table
  await saveTestResult({
    user_id: user.id,
    career_id: careerId,
    skill_name: skillName,
    level: 'easy',
    score: results.score,
    total_questions: results.total,
    percentage: results.percentage,
    passed: results.passed,
    scorecard_data: results.scorecard
  });
  
  // Update performance tracking
  await recordTestPerformance(
    user.id,
    careerId,
    skillName,
    'easy',
    results.score,
    results.total,
    results.passed
  );
  
  // Navigate to results
  navigate('/scorecard/latest');
};
```

### Step 6: Dashboard Display

```typescript
import { getDashboardStats, getTestPerformance } from '@/services/onboardingService';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [performance, setPerformance] = useState([]);
  
  useEffect(() => {
    const loadData = async () => {
      const dashStats = await getDashboardStats(user.id);
      const testPerf = await getTestPerformance(user.id);
      
      setStats(dashStats);
      setPerformance(testPerf);
    };
    
    loadData();
  }, [user]);
  
  return (
    <div>
      {/* Overview Stats */}
      <StatsGrid>
        <StatCard title="Tests Taken" value={stats?.total_tests_taken} />
        <StatCard title="Tests Passed" value={stats?.tests_passed} />
        <StatCard title="Average Score" value={`${stats?.average_score}%`} />
        <StatCard title="Skills Mastered" value={stats?.skills_mastered} />
      </StatsGrid>
      
      {/* Test Performance by Skill */}
      <PerformanceTable>
        {performance.map(perf => (
          <PerformanceRow key={perf.id}>
            <SkillName>{perf.skill_name}</SkillName>
            <LevelScores>
              <Level 
                name="Easy" 
                score={perf.easy_best_percentage}
                passed={perf.easy_passed}
                attempts={perf.easy_attempts}
              />
              <Level 
                name="Medium" 
                score={perf.medium_best_percentage}
                passed={perf.medium_passed}
                attempts={perf.medium_attempts}
              />
              <Level 
                name="Hard" 
                score={perf.hard_best_percentage}
                passed={perf.hard_passed}
                attempts={perf.hard_attempts}
              />
            </LevelScores>
            <MasteryBadge level={perf.skill_mastery_level} />
          </PerformanceRow>
        ))}
      </PerformanceTable>
    </div>
  );
};
```

## Dashboard UI Components

### 1. Onboarding Progress Banner
```tsx
<OnboardingBanner>
  {!onboarding.profile_completed && (
    <Alert variant="info">
      <AlertIcon />
      <AlertTitle>Complete Your Profile</AlertTitle>
      <AlertDescription>
        Tell us about yourself to get started
      </AlertDescription>
      <Button onClick={() => navigate('/profile/complete')}>
        Complete Now
      </Button>
    </Alert>
  )}
  
  {!onboarding.career_selected && onboarding.profile_completed && (
    <Alert variant="info">
      <AlertIcon />
      <AlertTitle>Choose Your Career</AlertTitle>
      <AlertDescription>
        Select a career path to begin your journey
      </AlertDescription>
      <Button onClick={() => navigate('/careers')}>
        Choose Career
      </Button>
    </Alert>
  )}
</OnboardingBanner>
```

### 2. Stats Overview Cards
```tsx
<StatsGrid className="grid grid-cols-1 md:grid-cols-4 gap-4">
  <StatCard>
    <StatIcon>📝</StatIcon>
    <StatValue>{stats.total_tests_taken}</StatValue>
    <StatLabel>Tests Taken</StatLabel>
  </StatCard>
  
  <StatCard>
    <StatIcon>✅</StatIcon>
    <StatValue>{stats.tests_passed}</StatValue>
    <StatLabel>Tests Passed</StatLabel>
  </StatCard>
  
  <StatCard>
    <StatIcon>📊</StatIcon>
    <StatValue>{stats.average_score}%</StatValue>
    <StatLabel>Average Score</StatLabel>
  </StatCard>
  
  <StatCard>
    <StatIcon>🏆</StatIcon>
    <StatValue>{stats.skills_mastered}</StatValue>
    <StatLabel>Skills Mastered</StatLabel>
  </StatCard>
</StatsGrid>
```

### 3. Test Performance Table
```tsx
<PerformanceTable>
  <TableHeader>
    <TableRow>
      <TableHead>Skill</TableHead>
      <TableHead>Easy</TableHead>
      <TableHead>Medium</TableHead>
      <TableHead>Hard</TableHead>
      <TableHead>Mastery</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {performance.map(perf => (
      <TableRow key={perf.id}>
        <TableCell>
          <div className="font-semibold">{perf.skill_name}</div>
          <div className="text-sm text-gray-500">
            {perf.total_attempts} attempts
          </div>
        </TableCell>
        
        <TableCell>
          <LevelBadge
            passed={perf.easy_passed}
            score={perf.easy_best_percentage}
            attempts={perf.easy_attempts}
          />
        </TableCell>
        
        <TableCell>
          <LevelBadge
            passed={perf.medium_passed}
            score={perf.medium_best_percentage}
            attempts={perf.medium_attempts}
          />
        </TableCell>
        
        <TableCell>
          <LevelBadge
            passed={perf.hard_passed}
            score={perf.hard_best_percentage}
            attempts={perf.hard_attempts}
          />
        </TableCell>
        
        <TableCell>
          <MasteryBadge level={perf.skill_mastery_level}>
            {getSkillMasteryIcon(perf.skill_mastery_level)}
            {perf.skill_mastery_level}
          </MasteryBadge>
        </TableCell>
        
        <TableCell>
          <Button size="sm" onClick={() => retakeTest(perf)}>
            Retake
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</PerformanceTable>
```

### 4. Level Badge Component
```tsx
const LevelBadge = ({ passed, score, attempts }) => {
  if (attempts === 0) {
    return (
      <Badge variant="outline" className="bg-gray-100">
        Not Taken
      </Badge>
    );
  }
  
  return (
    <div className="space-y-1">
      <Badge 
        variant={passed ? "success" : "destructive"}
        className={passed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
      >
        {passed ? "✓ Passed" : "✗ Failed"}
      </Badge>
      <div className="text-sm font-semibold">
        {score.toFixed(1)}%
      </div>
      <div className="text-xs text-gray-500">
        {attempts} {attempts === 1 ? 'attempt' : 'attempts'}
      </div>
    </div>
  );
};
```

### 5. Mastery Level Badge
```tsx
const MasteryBadge = ({ level }) => {
  const config = {
    expert: { icon: '👑', color: 'purple', label: 'Expert' },
    advanced: { icon: '⭐', color: 'green', label: 'Advanced' },
    intermediate: { icon: '📈', color: 'blue', label: 'Intermediate' },
    beginner: { icon: '🌱', color: 'yellow', label: 'Beginner' }
  };
  
  const { icon, color, label } = config[level] || config.beginner;
  
  return (
    <Badge className={`bg-${color}-100 text-${color}-800`}>
      <span className="mr-1">{icon}</span>
      {label}
    </Badge>
  );
};
```

## Example Dashboard Layout

```tsx
const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Onboarding Banner */}
      <OnboardingProgressBanner />
      
      {/* Stats Overview */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
        <StatsGrid />
      </section>
      
      {/* Test Performance */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Test Performance</h2>
        <PerformanceTable />
      </section>
      
      {/* Recent Activity */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <ActivityTimeline />
      </section>
      
      {/* Recommendations */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Career Recommendations</h2>
        <RecommendationsGrid />
      </section>
    </div>
  );
};
```

## Testing Checklist

- [ ] New user signs up → Onboarding status created
- [ ] User redirected to profile completion
- [ ] Profile form saves correctly
- [ ] User redirected to career selection
- [ ] Career selection updates onboarding
- [ ] User prompted to take first test
- [ ] Test results save correctly
- [ ] Performance tracking updates
- [ ] Dashboard shows correct stats
- [ ] Test scores display properly
- [ ] Mastery levels calculate correctly
- [ ] User can retake tests
- [ ] Best scores are tracked
- [ ] Attempt counts are accurate

## Database Queries for Verification

```sql
-- Check user's onboarding status
SELECT * FROM user_onboarding_status WHERE user_id = 'USER_ID';

-- Check user's profile
SELECT * FROM user_profiles WHERE user_id = 'USER_ID';

-- Check test performance
SELECT * FROM user_test_performance WHERE user_id = 'USER_ID';

-- Check dashboard stats
SELECT * FROM user_dashboard_stats WHERE user_id = 'USER_ID';

-- Check all test results
SELECT * FROM user_test_results WHERE user_id = 'USER_ID' ORDER BY completed_at DESC;
```

## Next Steps

1. Run `create-onboarding-flow-system.sql` in Supabase
2. Import `onboardingService.ts` in your components
3. Update Dashboard to check onboarding status
4. Create Profile Completion page
5. Update Career Selection to track onboarding
6. Update Evaluation page to record performance
7. Create comprehensive Dashboard UI
8. Test complete flow

The system is now ready for a complete onboarding experience with full progress tracking! 🚀
