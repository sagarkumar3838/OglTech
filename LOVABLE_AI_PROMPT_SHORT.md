# Quick Prompt for Lovable AI - Skill Evaluation Platform

Build an AI-powered technical skill evaluation platform with these core features:

## Stack
React 18 + TypeScript + Vite + TailwindCSS + Shadcn/ui + Firebase Auth + Supabase PostgreSQL + Express + Multiple AI providers (Claude, GPT-4, Gemini, Groq, Grok)

## Core Features
1. **Authentication**: Firebase email/password with protected routes
2. **8 Career Paths**: OGL Developer, Frontend, Backend, Tester, QA, DevOps, Cloud, Content Developer
3. **AI Question Generation**: RAG system (40% question bank + 60% AI) with 5 AI provider fallback
4. **Evaluation System**: 24-hour time-bound evaluations with 10 questions per skill/level
5. **Smart Scorecards**: AI-generated analysis with dimension scores, strengths, gaps, recommendations
6. **Weak Topics System**: Auto-identify topics < 60%, track learning, unlock retest after completion
7. **Topic Reference Library**: 69+ topics (HTML, CSS, JS, jQuery) like quickref.me with code examples
8. **Modern Dashboard**: Stats, progress tracking, recent evaluations, quick actions
9. **Admin Panel**: Question bank management, user management, analytics

## Database (15 tables)
careers, user_progress, questions, evaluations, submissions, scorecards, evaluation_cache, evaluation_sessions, user_weak_topics, topic_references, topic_content_sections, topic_examples, user_topic_progress, retest_eligibility, topic_bookmarks

## Key Pages
- Landing page with animations
- Login/Signup
- Careers browse and detail
- Evaluation interface
- Scorecard report
- Dashboard
- Topics library
- Weak topics dashboard
- Admin dashboard
- Profile, Settings, Analytics

## Question Types
MCQ, Multi-select, Fill-in-blank, Code reasoning, Scenario-based

## Security
Row Level Security, rate limiting (100 req/15min), Firebase token validation, CORS, input sanitization

## UI/UX
Dark mode, responsive design, smooth animations (Framer Motion + GSAP), loading states, toast notifications, accessible (WCAG 2.1 AA)

## Special Features
- Tab switch detection during evaluation
- Progressive difficulty (Basic → Intermediate → Advanced)
- Question uniqueness tracking
- Caching for performance
- AI validation engine
- Syntax highlighting for code
- Print/download scorecards
- Bookmark topics
- Search history

Build as production-ready full-stack app with all features integrated.
