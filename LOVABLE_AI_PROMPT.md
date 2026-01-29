# AI-Powered Skill Evaluation Platform - Complete Build Prompt

Build a comprehensive AI-powered technical skill evaluation platform with the following specifications:

## Core Concept
Create a full-stack web application that evaluates technical skills (HTML, CSS, JavaScript, jQuery) through AI-generated questions, provides detailed scorecards with performance analysis, tracks learning progress, and offers a comprehensive topic reference library similar to quickref.me.

## Tech Stack Requirements

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- React Router v6 for navigation
- TailwindCSS + DaisyUI for styling
- Shadcn/ui components (Radix UI primitives)
- Framer Motion for animations
- GSAP for advanced animations
- Lucide React icons
- Recharts for data visualization
- Axios for API calls

### Backend
- Node.js with Express and TypeScript
- Firebase Cloud Functions (serverless)
- Firebase Authentication (email/password)
- Supabase PostgreSQL database
- Multiple AI providers with fallback:
  - Anthropic Claude (primary)
  - OpenAI GPT-4
  - Google Gemini
  - Groq (fast inference)
  - X.AI Grok

### Database Schema (Supabase PostgreSQL)

Tables needed:
1. **careers** - Career paths with required skills
2. **user_progress** - Track user progress per career
3. **questions** - Question bank with verified questions
4. **evaluations** - Generated evaluation sessions
5. **submissions** - User answer submissions
6. **scorecards** - Detailed performance analysis
7. **evaluation_cache** - Cache for question sets
8. **evaluation_sessions** - 24-hour time-bound evaluation tracking
9. **user_weak_topics** - Identified weak areas
10. **topic_references** - Master topic library (69+ topics)
11. **topic_content_sections** - Detailed content for each topic
12. **topic_examples** - Code examples with syntax highlighting
13. **user_topic_progress** - Learning progress tracking
14. **retest_eligibility** - Manage retest unlock logic
15. **topic_bookmarks** - User bookmarks
16. **topic_search_history** - Search tracking

## Key Features to Implement

### 1. Authentication System
- Firebase Authentication with email/password
- Protected routes for authenticated users
- User profile management
- Admin role support
- Session management with AuthContext

### 2. Career Path System
Create 8 OGL career paths:
- OGL Developer (Full-stack)
- OGL Frontend Developer
- OGL Backend Developer
- OGL Tester
- OGL QA Developer
- OGL DevOps Developer
- OGL Cloud Developer
- OGL Content Developer (Fresher level)

Each career has:
- Name, description, experience level
- Required skills (HTML, CSS, JavaScript, jQuery, etc.)
- Skill requirements with difficulty levels


### 3. AI-Powered Question Generation
Implement RAG (Retrieval-Augmented Generation) system with three strategies:
- **HYBRID** (default): 40% from question bank + 60% AI-generated
- **RAG_ONLY**: 100% from verified question bank
- **AI_ONLY**: 100% AI-generated

Question types to support:
- Multiple Choice (MCQ) - single answer
- Multi-select - multiple correct answers
- Fill in the blank
- Code reasoning
- Scenario-based questions
- Assertion-reason questions

AI Provider Manager with:
- Automatic fallback on provider failure
- Round-robin load distribution
- Configurable priority order
- Rate limiting per provider

### 4. Evaluation Flow
User journey:
1. Browse careers page with animated cards
2. Select a career (e.g., OGL Content Developer)
3. Choose skill (HTML, CSS, JavaScript, jQuery)
4. Select difficulty level (Basic, Intermediate, Advanced)
5. System generates 10 unique questions using AI
6. 24-hour timer starts for evaluation session
7. User answers questions with progress tracking
8. Submit evaluation
9. System generates detailed AI-powered scorecard

Evaluation features:
- Progress indicator (question X of 10)
- Previous/Next navigation
- Answer selection with visual feedback
- Confirmation before submission
- Session expiry tracking (24 hours)
- Tab switch detection and restart logic

### 5. Scorecard System
Generate comprehensive scorecards with:
- Overall score percentage
- Correct/incorrect breakdown
- Dimension scores (4 dimensions):
  - Correctness (accuracy)
  - Reasoning (problem-solving)
  - Debugging (error identification)
  - Design Thinking (best practices)
- Level readiness assessment (EXCEEDS/MEETS/BELOW EXPECTATION)
- Observed maturity level
- Strengths list (what user did well)
- Gaps/weaknesses list (areas to improve)
- Learning recommendations (specific topics to study)
- Hiring recommendation (STRONG_HIRE/CONSIDER/NO_HIRE)
- Evaluator summary
- Question-by-question breakdown
- Visual charts using Recharts
- Print/download capability


### 6. Weak Topics & Learning Path System
After evaluation failure (< 60% score):
- Automatically identify weak topics
- Create personalized learning dashboard
- Show topics with < 60% accuracy
- Track time spent on each topic
- Mark topics as complete
- Unlock retest after completing all weak topics
- 24-hour cooldown between retests

### 7. Topic Reference Library (like quickref.me)
Build comprehensive reference system with 69+ topics:

**HTML Topics (20)**: HTML Structure, Semantic HTML, Forms, Tables, Lists, Links, Images, Audio/Video, Canvas, SVG, Meta Tags, Accessibility, HTML5 APIs, etc.

**CSS Topics (21)**: Selectors, Box Model, Flexbox, Grid, Positioning, Animations, Transforms, Transitions, Responsive Design, Media Queries, Pseudo-classes, Variables, etc.

**JavaScript Topics (22)**: Variables, Data Types, Functions, Arrays, Objects, Promises, Async/Await, DOM Manipulation, Events, ES6+ Features, Closures, Prototypes, etc.

**jQuery Topics (6)**: Selectors, DOM Manipulation, Events, Effects, AJAX, Plugins

Features:
- Browse topics with grid layout
- Filter by skill (HTML/CSS/JS/jQuery)
- Filter by difficulty level
- Search functionality
- Topic detail pages with:
  - Syntax highlighting for code examples
  - Multiple content sections (explanations, tips, warnings)
  - Code examples with copy button
  - Progress tracking
  - Bookmark functionality
  - Time spent tracking
  - "Mark as Complete" button
- User bookmarks page
- Search history tracking

### 8. Dashboard System
Create modern dashboard with:
- Welcome section with user name
- Quick stats cards (evaluations taken, average score, skills assessed)
- Recent evaluations list
- Career progress overview
- Weak topics summary
- Learning path recommendations
- Quick action buttons (Start Evaluation, View Topics, etc.)
- Responsive sidebar navigation
- Dark/light theme toggle


### 9. Admin Dashboard
Admin features:
- View all scorecards
- Filter by candidate/skill/level
- Question bank management:
  - View statistics
  - Verify unverified questions
  - Add questions manually
  - Bulk import
- AI provider status monitoring
- User management
- Topic management (add/edit topics)
- Analytics and reports

### 10. Landing Page & Marketing
Modern landing page with:
- Hero section with smooth scroll animations
- Features showcase
- Pricing section (Free, Pro, Enterprise tiers)
- FAQ accordion
- Contact form
- Footer with links
- Animated elements using GSAP and Framer Motion
- Responsive design
- Call-to-action buttons

### 11. UI/UX Requirements

**Design System:**
- Modern, professional design
- Consistent color palette (primary, secondary, accent colors)
- Dark mode support with theme toggle
- Smooth transitions and animations
- Responsive design (mobile, tablet, desktop)
- Loading states with skeletons
- Error states with helpful messages
- Success feedback with toast notifications
- Accessible (WCAG 2.1 AA compliant)

**Components to build:**
- Resizable navbar with logo
- Animated hero section
- Career cards with hover effects
- Question cards with answer options
- Progress bars and indicators
- Modal dialogs
- Toast notifications
- Dropdown menus
- Tabs and accordions
- Data tables
- Charts and graphs
- Form inputs with validation
- Buttons (primary, secondary, ghost, outline)
- Badges and tags
- Avatars
- Tooltips
- Loading spinners

### 12. API Endpoints Structure

**Careers:**
- GET /api/careers - List all careers
- GET /api/careers/:id - Get career details
- POST /api/careers - Create career (admin)

**Questions:**
- POST /api/questions/generate - Generate questions with AI
- GET /api/questions/:evaluationId - Get questions for evaluation
- POST /api/questions/verify - Verify question (admin)
- GET /api/questions/bank/stats - Question bank statistics

**Evaluations:**
- POST /api/evaluations/start - Start evaluation session
- GET /api/evaluations/:id - Get evaluation
- POST /api/evaluations/submit - Submit answers
- GET /api/evaluations/user/:userId - User's evaluations

**Scorecards:**
- POST /api/scorecards/generate - Generate scorecard with AI
- GET /api/scorecards/:id - Get scorecard
- GET /api/scorecards/user/:userId - User's scorecards
- GET /api/scorecards - All scorecards (admin)

**Topics:**
- GET /api/topics - List all topics
- GET /api/topics/:slug - Get topic details
- POST /api/topics/progress - Update progress
- GET /api/topics/weak/:userId - Get weak topics
- POST /api/topics/bookmark - Toggle bookmark


### 13. Security Requirements
- Row Level Security (RLS) on all database tables
- Users can only access their own data
- Admin role verification for admin endpoints
- Firebase token validation on all protected routes
- CORS configuration for allowed origins
- Rate limiting (100 requests per 15 minutes per user)
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Correct answers hidden from frontend
- Environment variables for sensitive data

### 14. Performance Optimization
- Question bank caching to reduce AI calls
- Lazy loading for routes
- Code splitting with Vite
- Optimized images
- Database query indexing
- Efficient Firestore/Supabase queries
- Debounced search inputs
- Pagination for large lists
- Memoization for expensive computations

### 15. Routing Structure

**Public Routes:**
- / - Landing page
- /login - Login/signup page
- /about - About page
- /contact - Contact page
- /privacy - Privacy policy
- /terms - Terms of service
- /cookies - Cookie policy
- /careers - Browse careers
- /careers/:slug - Career details
- /topics - Browse topics
- /topics/:slug - Topic details

**Protected Routes:**
- /dashboard - User dashboard
- /profile - User profile
- /profile/complete - Complete profile
- /evaluation/:skill/:level/:sessionId - Take evaluation
- /scorecard/:id - View scorecard
- /weak-topics - Weak topics dashboard
- /learning-path - Personalized learning path
- /ai-assistant - AI chat assistant
- /practice - Practice mode
- /analytics - Performance analytics
- /settings - User settings

**Admin Routes:**
- /admin - Admin dashboard
- /admin/topics - Topic management

### 16. State Management
Use React Context API for:
- AuthContext - User authentication state
- ThemeContext - Dark/light mode
- Global loading states
- Toast notifications

### 17. Error Handling
- Try-catch blocks for async operations
- User-friendly error messages
- Fallback UI for errors
- 404 page for invalid routes
- Network error handling
- API error responses with status codes
- Logging for debugging


### 18. AI Integration Details

**Question Generation Prompt Structure:**
Generate questions for [SKILL] at [LEVEL] level with:
- Clear, unambiguous questions
- 4 options for MCQ (A, B, C, D)
- Only one correct answer for MCQ
- Multiple correct answers for multi-select
- Realistic scenarios
- Code snippets where appropriate
- Explanations for correct answers
- No hallucinations or made-up APIs
- Industry-standard practices

**Scorecard Generation Prompt Structure:**
Analyze evaluation results and provide:
- Dimension scores (0-100) for Correctness, Reasoning, Debugging, Design
- Level readiness assessment
- 3-5 specific strengths
- 3-5 specific gaps
- 5-7 actionable learning recommendations
- Hiring recommendation with justification
- Professional evaluator summary

**AI Provider Configuration:**
- Primary: Anthropic Claude 3.5 Sonnet
- Fallback 1: OpenAI GPT-4 Turbo
- Fallback 2: Google Gemini 1.5 Pro
- Fast option: Groq Llama 3.1 70B
- Alternative: X.AI Grok Beta

### 19. Data Flow Examples

**Evaluation Flow:**
1. User selects career → skill → level
2. Frontend calls POST /api/evaluations/start
3. Backend checks question bank (40% from bank)
4. Backend calls AI provider for remaining 60%
5. Backend validates all questions
6. Backend stores in evaluations table
7. Backend returns questions (without correct answers)
8. Frontend displays questions one by one
9. User submits answers → POST /api/evaluations/submit
10. Backend retrieves correct answers
11. Backend calculates score
12. Backend calls AI for detailed analysis
13. Backend generates scorecard
14. Backend identifies weak topics if score < 60%
15. Frontend displays scorecard

**Topic Learning Flow:**
1. User views weak topics dashboard
2. User clicks "Start Learning" on a topic
3. Frontend navigates to /topics/:slug
4. Frontend tracks time spent
5. User reads content, views examples
6. User clicks "Mark as Complete"
7. Frontend calls POST /api/topics/progress
8. Backend updates user_topic_progress
9. Backend checks if all weak topics complete
10. Backend updates retest_eligibility
11. Frontend shows "Retest Available" button

### 20. Styling Guidelines
- Use Tailwind utility classes
- Consistent spacing (4, 8, 16, 24, 32, 48, 64px)
- Border radius: rounded-lg (8px), rounded-xl (12px)
- Shadows: shadow-sm, shadow-md, shadow-lg
- Colors: Use semantic color names (primary, secondary, success, error, warning)
- Typography: Clear hierarchy (text-4xl, text-2xl, text-xl, text-lg, text-base, text-sm)
- Hover states on interactive elements
- Focus states for accessibility
- Smooth transitions (transition-all duration-200)


### 21. Environment Variables Required

**Frontend (.env):**
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_URL=
```

**Backend (.env):**
```
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GOOGLE_AI_API_KEY=
GROQ_API_KEY=
XAI_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
NODE_ENV=production
RATE_LIMIT_ENABLED=true
```

### 22. Package Dependencies

**Frontend packages:**
- react, react-dom, react-router-dom
- @supabase/supabase-js
- firebase
- axios
- tailwindcss, daisyui
- @radix-ui/* (all shadcn components)
- framer-motion, gsap, @gsap/react
- lucide-react, react-icons
- recharts
- next-themes (theme switching)
- sonner (toast notifications)
- react-hook-form (forms)
- class-variance-authority, clsx, tailwind-merge (styling utilities)

**Backend packages:**
- express, cors
- firebase-admin, firebase-functions
- @supabase/supabase-js
- @anthropic-ai/sdk
- openai
- axios (for other AI providers)
- express-rate-limit
- dotenv
- uuid

### 23. Special Features

**Tab Switch Detection:**
- Detect when user switches tabs during evaluation
- Show warning modal
- Option to restart evaluation
- Track tab switches in session data

**Question Uniqueness:**
- Ensure no duplicate questions in same evaluation
- Track question usage count
- Prefer less-used questions from bank

**Progressive Difficulty:**
- Basic → Intermediate → Advanced progression
- Lock higher levels until lower levels passed
- Show level requirements on career page

**Caching Strategy:**
- Cache question sets by skill+level+count
- Reuse cached sets for faster loading
- Update cache with new AI-generated questions
- Track cache hit rate

**Validation Engine:**
- Validate AI-generated questions
- Check for required fields
- Detect hallucinations (made-up APIs)
- Verify correct answer exists in options
- Check for duplicate options
- Flag suspicious questions for manual review


### 24. User Experience Details

**Onboarding Flow:**
1. User lands on homepage
2. Clicks "Get Started" or "Sign Up"
3. Redirected to /login
4. Creates account with email/password
5. Redirected to /profile/complete
6. Fills profile (name, experience, goals)
7. Redirected to /dashboard
8. Sees welcome message and quick start guide

**Evaluation Experience:**
- Clean, distraction-free interface
- Large, readable text
- Clear question numbering
- Visual feedback on answer selection
- Disabled "Next" until answer selected
- Progress bar at top
- Timer display (countdown from 24 hours)
- Auto-save answers (draft mode)
- Confirmation modal before final submit
- Loading state during submission
- Success animation on completion

**Scorecard Experience:**
- Professional report layout
- Company branding at top
- Candidate info section
- Overall score with large visual
- Dimension scores with radar chart
- Color-coded sections (green for strengths, red for gaps)
- Expandable question breakdown
- Print-friendly layout
- Download as PDF button
- Share button (copy link)

**Topic Reference Experience:**
- Fast, responsive search
- Instant filter updates
- Smooth scroll to sections
- Syntax-highlighted code blocks
- Copy code button on hover
- Bookmark icon (filled when bookmarked)
- Progress ring showing completion
- Related topics suggestions
- Breadcrumb navigation
- Back to topics button

### 25. Accessibility Requirements
- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support (Tab, Enter, Escape)
- Focus indicators visible
- Color contrast ratio ≥ 4.5:1
- Alt text for images
- Screen reader friendly
- Skip to main content link
- Form labels properly associated
- Error messages announced

### 26. Mobile Responsiveness
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Mobile-first approach
- Touch-friendly buttons (min 44x44px)
- Hamburger menu on mobile
- Collapsible sidebar on tablet
- Responsive tables (horizontal scroll or card layout)
- Optimized images for mobile
- Reduced animations on mobile
- Bottom navigation for key actions

### 27. Testing Considerations
- Unit tests for utility functions
- Integration tests for API endpoints
- E2E tests for critical flows (signup, evaluation, scorecard)
- Test AI provider fallback logic
- Test rate limiting
- Test RLS policies
- Test question validation
- Test scorecard generation
- Test weak topic identification
- Test retest eligibility logic


### 28. Deployment Configuration

**Firebase Hosting:**
- Single-page application
- Rewrite all routes to index.html
- Cache static assets
- Custom domain support
- SSL/TLS enabled

**Firebase Functions:**
- Node.js 18 runtime
- 512MB memory allocation
- 60s timeout for AI calls
- Environment variables configured
- CORS enabled for frontend domain

**Supabase:**
- PostgreSQL database
- Row Level Security enabled
- Indexes on frequently queried columns
- Automatic backups
- Connection pooling

### 29. Monitoring & Analytics
- Track evaluation completion rate
- Monitor AI provider usage and costs
- Track question bank hit rate
- Monitor API response times
- Track user engagement metrics
- Error rate monitoring
- Performance metrics (Core Web Vitals)

### 30. Future Enhancements (Nice to Have)
- Video/audio questions
- Real-time collaboration
- Peer comparison
- Leaderboards
- Certificates on completion
- Email notifications
- Slack/Teams integration
- Custom branding for enterprises
- Multi-language support
- Voice-based evaluations
- Code execution environment
- Live coding challenges
- Interview scheduling
- Recruiter dashboard
- Bulk user import
- SSO integration
- API for third-party integrations

## Implementation Priority

**Phase 1 (MVP):**
1. Authentication system
2. Career browsing
3. Basic question generation (AI only)
4. Evaluation flow
5. Simple scorecard
6. Basic dashboard

**Phase 2 (Core Features):**
1. Question bank and RAG system
2. AI provider fallback
3. Detailed scorecards with dimensions
4. Weak topic identification
5. Topic reference library
6. Admin dashboard

**Phase 3 (Polish):**
1. Advanced animations
2. Dark mode
3. Mobile optimization
4. Performance optimization
5. Analytics
6. Advanced admin features

## Success Criteria
- User can sign up and complete evaluation in < 5 minutes
- Questions are relevant and accurate (no hallucinations)
- Scorecards provide actionable insights
- System handles 100+ concurrent users
- 99.9% uptime
- < 2s page load time
- Mobile responsive on all devices
- Accessible (WCAG 2.1 AA)

## Final Notes
- Prioritize user experience and simplicity
- Ensure all AI-generated content is validated
- Make the system scalable and maintainable
- Follow TypeScript best practices
- Write clean, documented code
- Use consistent naming conventions
- Handle errors gracefully
- Provide helpful feedback to users
- Make it production-ready from day one

Build this as a complete, production-ready application with all features integrated and working seamlessly together.
