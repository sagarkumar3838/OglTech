# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                    (React + TypeScript)                         │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Login   │  │ Careers  │  │Evaluation│  │Scorecard │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FIREBASE AUTHENTICATION                       │
│                      (Email/Password)                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                          │
│                  (Express + TypeScript)                         │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │Rate Limiter  │  │     CORS     │  │Auth Middleware│        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                       │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                   RAG SERVICE                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │   │
│  │  │   Strategy   │  │  Question    │  │  Validation │ │   │
│  │  │   Router     │  │    Bank      │  │   Engine    │ │   │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │   │
│  └────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │              AI PROVIDER MANAGER                       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
│  │  │ Priority │  │ Fallback │  │Round-Robin│           │   │
│  │  │  Queue   │  │  Logic   │  │Load Balance│          │   │
│  │  └──────────┘  └──────────┘  └──────────┘           │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AI PROVIDERS LAYER                         │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │Anthropic │  │  OpenAI  │  │  Google  │  │   Groq   │      │
│  │  Claude  │  │  GPT-4   │  │  Gemini  │  │  Llama   │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                 │
│  ┌──────────┐                                                  │
│  │   X.AI   │                                                  │
│  │   Grok   │                                                  │
│  └──────────┘                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA PERSISTENCE LAYER                     │
│                     (Firebase Firestore)                        │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Careers  │  │Questions │  │Question  │  │Evaluations│     │
│  │          │  │          │  │  Bank    │  │          │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │Submissions│  │Scorecards│  │  Users   │                    │
│  │          │  │          │  │          │                    │
│  └──────────┘  └──────────┘  └──────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

## Request Flow

### 1. Question Generation Flow

```
User Request
    │
    ├─→ Rate Limiter Check
    │       │
    │       ├─→ [PASS] Continue
    │       └─→ [FAIL] Return 429 Too Many Requests
    │
    ├─→ Authentication Check
    │       │
    │       ├─→ [PASS] Continue
    │       └─→ [FAIL] Return 401 Unauthorized
    │
    ├─→ RAG Service
    │       │
    │       ├─→ Strategy: HYBRID
    │       │       │
    │       │       ├─→ Get 40% from Question Bank
    │       │       │       │
    │       │       │       ├─→ Query Firestore
    │       │       │       ├─→ Filter by skill/level
    │       │       │       ├─→ Randomize selection
    │       │       │       └─→ Return questions
    │       │       │
    │       │       └─→ Generate 60% with AI
    │       │               │
    │       │               ├─→ AI Provider Manager
    │       │               │       │
    │       │               │       ├─→ Try Provider 1 (Anthropic)
    │       │               │       │       │
    │       │               │       │       ├─→ [SUCCESS] Return questions
    │       │               │       │       └─→ [FAIL] Try next provider
    │       │               │       │
    │       │               │       ├─→ Try Provider 2 (OpenAI)
    │       │               │       │       │
    │       │               │       │       ├─→ [SUCCESS] Return questions
    │       │               │       │       └─→ [FAIL] Try next provider
    │       │               │       │
    │       │               │       └─→ Continue until success or all fail
    │       │               │
    │       │               ├─→ Validate Questions
    │       │               │       │
    │       │               │       ├─→ Check required fields
    │       │               │       ├─→ Detect hallucinations
    │       │               │       ├─→ Verify correct answers
    │       │               │       └─→ Filter invalid questions
    │       │               │
    │       │               └─→ Store in Question Bank
    │       │
    │       ├─→ Strategy: RAG_ONLY
    │       │       │
    │       │       └─→ Get 100% from Question Bank
    │       │
    │       └─→ Strategy: AI_ONLY
    │               │
    │               └─→ Generate 100% with AI
    │
    ├─→ Store in Firestore
    │       │
    │       ├─→ questions collection
    │       └─→ evaluations collection
    │
    └─→ Return to User (without correct answers)
```

### 2. Evaluation Submission Flow

```
User Submits Answers
    │
    ├─→ Validate Submission
    │       │
    │       ├─→ Check evaluation_id exists
    │       ├─→ Check user_id valid
    │       └─→ Check answers format
    │
    ├─→ Retrieve Questions (with correct answers)
    │       │
    │       └─→ Query Firestore
    │
    ├─→ Calculate Results
    │       │
    │       ├─→ Compare user answers with correct answers
    │       ├─→ Calculate score
    │       ├─→ Count correct/incorrect
    │       └─→ Generate question breakdown
    │
    ├─→ Store Submission
    │       │
    │       └─→ submissions collection
    │
    └─→ Return Results
```

### 3. Scorecard Generation Flow

```
Generate Scorecard Request
    │
    ├─→ Retrieve Submission Data
    │       │
    │       ├─→ Get submission
    │       ├─→ Get evaluation
    │       └─→ Get questions
    │
    ├─→ Calculate Basic Metrics
    │       │
    │       ├─→ Overall score
    │       ├─→ Correct count
    │       └─→ Question breakdown
    │
    ├─→ AI Analysis
    │       │
    │       ├─→ AI Provider Manager
    │       │       │
    │       │       ├─→ Try Provider 1
    │       │       │       │
    │       │       │       ├─→ [SUCCESS] Return analysis
    │       │       │       └─→ [FAIL] Try next
    │       │       │
    │       │       └─→ Continue until success
    │       │
    │       ├─→ Generate:
    │       │       │
    │       │       ├─→ Level readiness
    │       │       ├─→ Observed maturity
    │       │       ├─→ Dimension scores
    │       │       ├─→ Strengths
    │       │       ├─→ Gaps
    │       │       ├─→ Recommendations
    │       │       └─→ Hiring recommendation
    │       │
    │       └─→ Validate Analysis
    │
    ├─→ Store Scorecard
    │       │
    │       └─→ scorecards collection
    │
    └─→ Return Complete Scorecard
```

## Component Architecture

### Frontend Components

```
App (Root)
│
├─→ AuthProvider (Context)
│   │
│   └─→ Manages user authentication state
│
├─→ Router
│   │
│   ├─→ Public Routes
│   │   │
│   │   ├─→ Login
│   │   ├─→ Home
│   │   └─→ Careers
│   │
│   └─→ Protected Routes
│       │
│       ├─→ CareerDetail
│       ├─→ Evaluation
│       ├─→ Scorecard
│       └─→ AdminDashboard
│
└─→ Layout
    │
    ├─→ Navigation
    ├─→ User Menu
    └─→ Content Area
```

### Backend Services

```
API Layer (Express)
│
├─→ Middleware
│   │
│   ├─→ CORS
│   ├─→ Rate Limiter
│   ├─→ Auth Validator
│   └─→ Error Handler
│
├─→ Routes
│   │
│   ├─→ /api/careers
│   ├─→ /api/questions
│   ├─→ /api/evaluations
│   ├─→ /api/scorecards
│   └─→ /api/admin
│
├─→ Services
│   │
│   ├─→ RAG Service
│   │   │
│   │   ├─→ Strategy Router
│   │   ├─→ Question Bank
│   │   └─→ Validation Engine
│   │
│   ├─→ AI Provider Manager
│   │   │
│   │   ├─→ OpenAI Provider
│   │   ├─→ Anthropic Provider
│   │   ├─→ Google Provider
│   │   ├─→ Groq Provider
│   │   └─→ XAI Provider
│   │
│   └─→ Scorecard Generator
│
└─→ Config
    │
    ├─→ Environment Variables
    ├─→ Firebase Admin
    └─→ Provider Settings
```

## Data Flow

### Question Bank Data Flow

```
AI Generation
    │
    ├─→ Generate Questions
    │
    ├─→ Validate Quality
    │       │
    │       ├─→ [PASS] Store with verified: false
    │       └─→ [FAIL] Discard
    │
    ├─→ Admin Review
    │       │
    │       ├─→ Review unverified questions
    │       └─→ Verify good questions
    │
    └─→ Question Bank (verified: true)
            │
            └─→ Used in future evaluations
```

### Caching Strategy

```
Request for Questions
    │
    ├─→ Check Question Bank
    │       │
    │       ├─→ [HIT] Return from bank (instant)
    │       └─→ [MISS] Generate with AI
    │
    └─→ Store AI-generated in bank
            │
            └─→ Available for future requests
```

## Security Architecture

```
Request
    │
    ├─→ HTTPS/TLS Encryption
    │
    ├─→ CORS Validation
    │       │
    │       ├─→ Check origin
    │       └─→ Validate headers
    │
    ├─→ Rate Limiting
    │       │
    │       ├─→ Check request count
    │       ├─→ Check time window
    │       └─→ Block if exceeded
    │
    ├─→ Authentication
    │       │
    │       ├─→ Verify Firebase token
    │       └─→ Extract user ID
    │
    ├─→ Authorization
    │       │
    │       ├─→ Check user permissions
    │       └─→ Validate resource access
    │
    ├─→ Firestore Security Rules
    │       │
    │       ├─→ Validate read access
    │       └─→ Validate write access
    │
    └─→ Process Request
```

## Scalability Architecture

### Horizontal Scaling

```
Load Balancer (Firebase)
    │
    ├─→ Function Instance 1
    ├─→ Function Instance 2
    ├─→ Function Instance 3
    └─→ Function Instance N
            │
            └─→ All share same Firestore
```

### Provider Load Distribution

```
Request 1 → Provider A (Anthropic)
Request 2 → Provider B (OpenAI)
Request 3 → Provider C (Google)
Request 4 → Provider A (Anthropic)
...
```

### Question Bank Scaling

```
Question Bank Growth
    │
    ├─→ More questions = Less AI calls
    ├─→ Less AI calls = Lower costs
    ├─→ Lower costs = Better scalability
    └─→ Better scalability = Handle more users
```

## Deployment Architecture

```
Development
    │
    ├─→ Local Firestore Emulator
    ├─→ Local Functions Emulator
    └─→ Vite Dev Server
            │
            └─→ Hot Module Replacement

Production
    │
    ├─→ Firebase Hosting (Frontend)
    │       │
    │       ├─→ CDN Distribution
    │       ├─→ SSL/TLS
    │       └─→ Custom Domain Support
    │
    ├─→ Cloud Functions (Backend)
    │       │
    │       ├─→ Auto-scaling
    │       ├─→ Load Balancing
    │       └─→ Regional Deployment
    │
    └─→ Firestore (Database)
            │
            ├─→ Multi-region Replication
            ├─→ Automatic Backups
            └─→ Security Rules
```

## Monitoring & Logging

```
Application
    │
    ├─→ Console Logs
    │       │
    │       ├─→ Info
    │       ├─→ Warnings
    │       └─→ Errors
    │
    ├─→ Firebase Console
    │       │
    │       ├─→ Function Logs
    │       ├─→ Performance Monitoring
    │       └─→ Error Reporting
    │
    └─→ Custom Metrics
            │
            ├─→ Provider Usage
            ├─→ Response Times
            ├─→ Error Rates
            └─→ Question Bank Hit Rate
```

---

## Key Architectural Decisions

### 1. RAG Over Pure AI
**Why**: Reduces hallucinations, ensures quality, optimizes costs

### 2. Multiple AI Providers
**Why**: Reliability through redundancy, avoid vendor lock-in

### 3. TypeScript Throughout
**Why**: Type safety, better developer experience, fewer runtime errors

### 4. Serverless Architecture
**Why**: Auto-scaling, pay-per-use, no server management

### 5. Firestore for Database
**Why**: Real-time capabilities, scalability, Firebase integration

### 6. Question Bank Caching
**Why**: Instant responses, cost optimization, quality control

---

**Architecture Status: ✅ Production Ready**

This architecture supports:
- High availability (99.9%+)
- Horizontal scaling
- Cost optimization
- Quality assurance
- Security best practices
