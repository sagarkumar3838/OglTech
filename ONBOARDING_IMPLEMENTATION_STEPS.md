# Onboarding Flow Implementation - Action Steps

## ✅ COMPLETED
1. **SQL Schema Fixed** - `create-onboarding-flow-system.sql` is ready (fixed `current_role` → `job_title`)
2. **Service Layer Complete** - `onboardingService.ts` has all functions
3. **Career Progression Service** - Already has test result tracking

## 🔧 NEXT STEPS TO IMPLEMENT

### Step 1: Run SQL in Supabase (DO THIS FIRST!)
```bash
# Open Supabase Dashboard → SQL Editor
# Copy and paste contents of: create-onboarding-flow-system-FIXED.sql
# Click "Run" to create all tables, functions, and policies
```

**IMPORTANT:** Use `create-onboarding-flow-system-FIXED.sql` (not the old one)
This version is fixed for TEXT user_id compatibility with your existing tables.

**This creates:**
- `user_onboarding_status` table
- `user_test_performance` table (detailed per-level tracking)
- `user_dashboard_stats` view (real-time statistics)
- Enhanced `user_profiles` with profile fields
- RLS policies
- Automatic triggers
- Helper functions

### Step 2: Update Dashboard.tsx
**File:** `client/src/pages/Dashboard.tsx`

**Changes needed:**
1. Import onboarding service functions
2. Check onboarding status on mount
3. Redirect to profile completion if needed
4. Show onboarding progress banner
5. Display test performance table with easy/medium/hard scores
6. Show mastery levels

**Key additions:**
```typescript
import { 
  getOnboardingStatus, 
  getDashboardStats, 
  getTestPerformance,
  getNextOnboardingStep 
} from '@/services/onboardingService';

// Check onboarding and redirect if incomplete
useEffect(() => {
  const checkOnboarding = async () => {
    const status = await getOnboardingStatus(user.id);
    if (!status?.onboarding_completed) {
      const nextStep = getNextOnboardingStep(status);
      if (nextStep.step === 'profile') {
        navigate('/profile/complete');
      }
    }
  };
  checkOnboarding();
}, [user]);

// Load dashboard stats and test performance
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
```

### Step 3: Create ProfileComplete.tsx Page
**File:** `client/src/pages/ProfileComplete.tsx` (NEW FILE)

**Purpose:** First-time user profile completion form

**Fields to include:**
- Full Name (required)
- Phone
- Location
- Education Level (dropdown: High School, Bachelor's, Master's, PhD)
- Years of Experience (number)
- Current Job Title
- LinkedIn URL
- GitHub URL
- Portfolio URL
- Bio (textarea)

**On submit:**
```typescript
import { completeProfile } from '@/services/onboardingService';

const handleSubmit = async (formData) => {
  const success = await completeProfile(user.id, {
    full_name: formData.name,
    phone: formData.phone,
    location: formData.location,
    education_level: formData.education,
    years_of_experience: formData.experience,
    job_title: formData.role,
    linkedin_url: formData.linkedin,
    github_url: formData.github,
    portfolio_url: formData.portfolio,
    bio: formData.bio
  });
  
  if (success) {
    navigate('/careers'); // Redirect to career selection
  }
};
```

### Step 4: Update Evaluation.tsx
**File:** `client/src/pages/Evaluation.tsx`

**Changes needed:**
Add test performance recording after test submission

**In `handleSubmit` function, after creating scorecard:**
```typescript
import { recordTestPerformance } from '@/services/onboardingService';

// After calculating score and before navigate
await recordTestPerformance(
  user.id,
  careerId,
  actualSkillName,
  actualLevel, // 'easy', 'medium', or 'hard'
  correctCount,
  questions.length,
  score >= 60 // passed threshold
);
```

### Step 5: Update App.tsx Routes
**File:** `client/src/App.tsx`

**Add route:**
```typescript
<Route path="/profile/complete" element={<ProfileComplete />} />
```

### Step 6: Update Career Selection
**File:** `client/src/pages/Careers.tsx` (or wherever career selection happens)

**After user selects career:**
```typescript
import { updateOnboardingStep } from '@/services/onboardingService';

// After career selection
await updateOnboardingStep(user.id, 'career');
```

## 📊 DASHBOARD UI COMPONENTS TO ADD

### 1. Onboarding Progress Banner
Shows current step and prompts user to complete next action

### 2. Stats Overview Cards
- Total Tests Taken
- Tests Passed
- Average Score
- Skills Mastered

### 3. Test Performance Table
Columns:
- Skill Name
- Easy (score, attempts, passed)
- Medium (score, attempts, passed)
- Hard (score, attempts, passed)
- Mastery Level (Beginner/Intermediate/Advanced/Expert)
- Actions (Retake button)

### 4. Mastery Level Badges
- 🌱 Beginner (only easy passed)
- 📈 Intermediate (easy + medium passed)
- ⭐ Advanced (easy + medium passed)
- 👑 Expert (all three levels passed)

## 🎯 USER FLOW

```
1. User Signs Up
   ↓
2. Auto-redirect to /profile/complete
   ↓
3. User fills profile form
   ↓
4. Redirect to /careers
   ↓
5. User selects career (max 2)
   ↓
6. User takes first test
   ↓
7. Test results recorded in user_test_performance
   ↓
8. Dashboard shows detailed performance
   ↓
9. User can retake tests to improve scores
   ↓
10. System tracks best scores and mastery levels
```

## 🔍 TESTING CHECKLIST

After implementation:

- [ ] Run SQL in Supabase successfully
- [ ] New user signup creates onboarding_status
- [ ] User redirected to profile completion
- [ ] Profile form saves correctly
- [ ] User redirected to career selection
- [ ] Career selection updates onboarding
- [ ] Test completion records performance
- [ ] Dashboard shows correct stats
- [ ] Test performance table displays properly
- [ ] Mastery levels calculate correctly
- [ ] Best scores are tracked
- [ ] Retake test updates performance
- [ ] Onboarding banner shows/hides correctly

## 📝 VERIFICATION QUERIES

After running SQL, verify in Supabase:

```sql
-- Check tables created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_onboarding_status', 'user_test_performance');

-- Check view created
SELECT * FROM user_dashboard_stats LIMIT 1;

-- Check user_profiles has new columns
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name IN ('full_name', 'job_title', 'is_profile_complete');
```

## 🚀 PRIORITY ORDER

1. **HIGHEST**: Run SQL in Supabase
2. **HIGH**: Create ProfileComplete.tsx page
3. **HIGH**: Update Dashboard.tsx with onboarding check
4. **MEDIUM**: Update Evaluation.tsx to record performance
5. **MEDIUM**: Add test performance table to Dashboard
6. **LOW**: Polish UI with badges and styling

## 💡 NOTES

- All data is real-time from database (no dummy data)
- User can select max 2 careers
- Tests are progressive: Easy → Medium → Hard
- Must pass to unlock next level
- Best scores are always tracked
- Mastery levels auto-calculate
- Onboarding is automatic and seamless

---

**Ready to implement!** Start with Step 1 (run SQL) and proceed in order.
