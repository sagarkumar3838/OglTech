# Pre-Deployment Testing Checklist

## Complete End-to-End Testing Before Deployment

Test everything locally before deploying to production!

---

## 1. Authentication & User Flow ✓

### Sign Up
- [ ] Go to `/login`
- [ ] Click "Sign Up" 
- [ ] Create new account with email/password
- [ ] Verify email confirmation works
- [ ] Check if redirected to Profile page after signup

### Login
- [ ] Log out
- [ ] Log back in with credentials
- [ ] Verify successful login
- [ ] Check if redirected to Dashboard

### Profile Setup
- [ ] Complete all 4 steps of profile form:
  - [ ] Step 1: Name, Bio, Avatar upload
  - [ ] Step 2: Role, Experience level, Social links
  - [ ] Step 3: Skills, Interests
  - [ ] Step 4: Learning goals, Learning style
- [ ] Click "Complete Profile"
- [ ] Verify data saved to database
- [ ] Check if redirected to Dashboard

---

## 2. Dashboard Features ✓

### User Profile Card
- [ ] Profile card displays at top of dashboard
- [ ] Shows correct name, role, experience level
- [ ] Displays bio
- [ ] Shows skills, interests, learning goals
- [ ] Social links work (GitHub, LinkedIn, Twitter)
- [ ] "Edit Profile" button works

### Recent Test History
- [ ] Shows last 5 test results
- [ ] Displays correct scores
- [ ] Shows pass/fail status
- [ ] Date and time are accurate
- [ ] "View All Test History" button works

### Career Progress
- [ ] Shows selected career
- [ ] Overall progress percentage is correct
- [ ] Skills progress displays properly
- [ ] Level completion shows accurate data

---

## 3. Career Selection & Tests ✓

### Browse Careers
- [ ] Go to `/careers`
- [ ] All careers display correctly
- [ ] Click on "OGL Content Developer"
- [ ] Career detail page loads

### Level Unlocking System
- [ ] Easy level is ALWAYS unlocked for all skills
- [ ] Take Easy test and score 70%+
- [ ] Verify Medium level unlocks automatically
- [ ] Take Medium test and score 70%+
- [ ] Verify Hard level unlocks automatically

### Take a Test
- [ ] Click "From Database" button
- [ ] Test loads with 10 questions
- [ ] Answer all questions
- [ ] Submit test
- [ ] Scorecard displays correctly

---

## 4. Scorecard Features ✓

### Question Breakdown
- [ ] Shows all questions with answers
- [ ] Displays explanations for wrong answers
- [ ] Shows correct vs user answers
- [ ] Question text is visible

### Topic-Based Gaps
- [ ] Failed questions show topics
- [ ] Learning resource links display:
  - [ ] W3Schools link works
  - [ ] MDN link works
  - [ ] GeeksforGeeks link works
  - [ ] QuickRef link works
- [ ] YouTube videos in 5 languages display
- [ ] Only shows topics for FAILED questions

### Skill Dimension Scores
- [ ] Shows scores for ALL levels (Easy, Medium, Hard)
- [ ] Correctness, Reasoning, Debugging, Design scores display
- [ ] Percentages are accurate

---

## 5. Analytics Page ✓

### Overall Stats
- [ ] Total tests count is correct
- [ ] Average score is accurate
- [ ] Tests passed/failed counts match
- [ ] Career selector works

### Ranking System
- [ ] Your rank displays correctly
- [ ] Percentile calculation is accurate
- [ ] Top score shows
- [ ] Progress bar to #1 works
- [ ] Achievement badge shows if #1

### Skills Breakdown
- [ ] All skills display
- [ ] Level progress (Easy/Medium/Hard) is accurate
- [ ] Best scores are correct
- [ ] Attempt counts match

---

## 6. Navigation & UI ✓

### Navbar
- [ ] Logo links to home
- [ ] All menu items work
- [ ] User dropdown works
- [ ] Logout works
- [ ] Responsive on mobile

### Breadcrumbs
- [ ] Show correct path
- [ ] All links work
- [ ] Home icon visible

### Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768px)
- [ ] Test on mobile (375px)
- [ ] All components responsive

---

## 7. Database Integration ✓

### Supabase Connection
- [ ] Check `.env` has correct Supabase URL and keys
- [ ] Test database connection
- [ ] Verify RLS policies work
- [ ] Check user authentication

### Data Persistence
- [ ] Profile data saves correctly
- [ ] Test scores save to scorecards table
- [ ] Progress updates properly
- [ ] No 406 errors in console

### SQL Fixes Applied
- [ ] Run `fix-scorecard-skill-names.sql`
- [ ] Skill names are proper case (HTML, CSS, etc.)
- [ ] Level names are lowercase (easy, medium, hard)
- [ ] Verify with: `SELECT DISTINCT skill, level_attempted FROM scorecards;`

---

## 8. Performance & Errors ✓

### Console Errors
- [ ] Open browser console (F12)
- [ ] Navigate through all pages
- [ ] Check for errors (should be none)
- [ ] Check for warnings (acceptable)

### Loading States
- [ ] All pages show loading spinners
- [ ] No blank screens
- [ ] Data loads within 2 seconds

### Error Handling
- [ ] Try invalid login - shows error
- [ ] Try accessing protected route without login - redirects
- [ ] Try submitting incomplete forms - shows validation

---

## 9. Backend Server (Optional) ✓

### If Using AI Generation
- [ ] Backend server running on port 5001
- [ ] AI question generation works
- [ ] API endpoints respond correctly
- [ ] Error handling works

### If Database Only
- [ ] "From Database" button works
- [ ] Questions load from Supabase
- [ ] No backend server needed

---

## 10. Build & Production Test ✓

### Build Client
```bash
cd client
npm run build
```
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] `dist` folder created

### Test Production Build Locally
```bash
npm run preview
```
- [ ] Production build runs
- [ ] All features work in production mode
- [ ] No console errors

---

## Critical Issues to Fix Before Deployment

### Must Fix
- [ ] All authentication flows work
- [ ] Database connection is stable
- [ ] No 406 or 500 errors
- [ ] Level unlocking works for all skills
- [ ] Scorecard displays correctly

### Should Fix
- [ ] All links work
- [ ] Images load properly
- [ ] Responsive design works
- [ ] Loading states display

### Nice to Have
- [ ] Animations smooth
- [ ] Tooltips helpful
- [ ] Error messages clear

---

## Environment Variables Check

### Client `.env`
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Server `.env` (if using backend)
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key (optional)
```

---

## Testing Workflow

1. **Fresh Start**: Clear browser cache and localStorage
2. **New User Flow**: Sign up → Complete profile → Take test → View results
3. **Returning User Flow**: Login → Dashboard → Take another test → Check analytics
4. **Edge Cases**: Try invalid inputs, network errors, etc.

---

## Sign-Off Checklist

Before deploying, confirm:
- [ ] All critical features tested and working
- [ ] No console errors on any page
- [ ] Database is properly configured
- [ ] Environment variables are set
- [ ] Build completes successfully
- [ ] Production preview works locally

---

## Next Steps After Testing

Once all tests pass:
1. ✅ Read `DEPLOYMENT_GUIDE.md`
2. ✅ Deploy client to Vercel/Firebase
3. ✅ Deploy server to Render/Railway (if needed)
4. ✅ Update environment variables in production
5. ✅ Test production deployment
6. ✅ Monitor for errors

---

## Quick Test Commands

```bash
# Test client locally
cd client
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Test backend (if using)
cd server
npm run dev
```

---

## Need Help?

If any test fails:
1. Check browser console for errors
2. Check Supabase logs
3. Verify environment variables
4. Check database RLS policies
5. Review error messages carefully

Good luck with testing! 🚀
