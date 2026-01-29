# Deploy to Firebase Hosting & Functions

## Overview

This guide covers deploying both frontend (Hosting) and backend (Functions) to Firebase.

## Prerequisites

1. Firebase CLI installed
2. Firebase project created
3. Billing enabled (required for Functions)

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project (if not done)
firebase init
```

## Project Structure for Firebase

```
your-project/
├── client/              # Frontend (React + Vite)
│   ├── dist/           # Build output → Firebase Hosting
│   └── package.json
├── functions/          # Backend → Firebase Functions
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
└── firebase.json       # Firebase configuration
```

## Step 1: Update Firebase Configuration

Update `firebase.json`:

```json
{
  "hosting": {
    "public": "client/dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs18",
    "predeploy": [
      "npm --prefix functions run build"
    ]
  }
}
```

## Step 2: Prepare Backend for Firebase Functions

### Option A: Move Server to Functions (Recommended)

1. **Copy server code to functions:**
```bash
# Copy server source to functions
xcopy /E /I server\src functions\src
xcopy server\package.json functions\
xcopy server\tsconfig.json functions\
```

2. **Update functions/src/index.ts:**
```typescript
import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import { rateLimiter } from './middleware/rateLimiter';
import questionRoutes from './routes/questions';
import evaluationRoutes from './routes/evaluations';
import scorecardRoutes from './routes/scorecards';
import careerRoutes from './routes/careers';
import adminRoutes from './routes/admin';
import progressRoutes from './routes/progress';
import aiChatRoutes from './routes/aiChat';

const app = express();

// CORS for Firebase Hosting
app.use(cors({ 
  origin: true,
  credentials: true 
}));

app.use(express.json());

// Routes
app.use('/api/questions', questionRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/scorecards', scorecardRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api', aiChatRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: 'firebase-functions'
  });
});

// Export as Firebase Function
export const api = functions.https.onRequest(app);
```

3. **Update functions/package.json:**
```json
{
  "name": "functions",
  "scripts": {
    "build": "tsc",
    "serve": "npm run build && firebase emulators:start --only functions",
    "shell": "npm run build && firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "18"
  },
  "main": "lib/index.js",
  "dependencies": {
    "firebase-admin": "^12.0.0",
    "firebase-functions": "^4.5.0",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "@supabase/supabase-js": "^2.39.0",
    "openai": "^4.20.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "typescript": "^5.3.3",
    "firebase-functions-test": "^3.1.0"
  }
}
```

### Option B: Keep Separate Backend (Alternative)

Deploy backend to another service (Render, Railway, etc.) and update frontend API URL.

## Step 3: Configure Environment Variables

### For Firebase Functions:
```bash
# Set environment variables
firebase functions:config:set \
  supabase.url="https://your-project.supabase.co" \
  supabase.key="your-anon-key" \
  openai.key="sk-..." \
  groq.key="gsk_..."

# View current config
firebase functions:config:get

# For local testing, create functions/.runtimeconfig.json:
{
  "supabase": {
    "url": "https://your-project.supabase.co",
    "key": "your-anon-key"
  },
  "openai": {
    "key": "sk-..."
  }
}
```

### Update env.ts to read Firebase config:
```typescript
import * as functions from 'firebase-functions';

const config = {
  supabase: {
    url: functions.config().supabase?.url || process.env.VITE_SUPABASE_URL,
    key: functions.config().supabase?.key || process.env.VITE_SUPABASE_ANON_KEY
  },
  openai: {
    apiKey: functions.config().openai?.key || process.env.OPENAI_API_KEY
  }
  // ... other configs
};
```

## Step 4: Build Frontend

```bash
cd client
npm run build
```

This creates `client/dist/` folder with optimized production build.

## Step 5: Test Locally with Emulators

```bash
# Start Firebase emulators
firebase emulators:start

# Test at:
# - Frontend: http://localhost:5000
# - Functions: http://localhost:5001
```

## Step 6: Deploy to Firebase

### Deploy Everything:
```bash
firebase deploy
```

### Deploy Only Hosting:
```bash
firebase deploy --only hosting
```

### Deploy Only Functions:
```bash
firebase deploy --only functions
```

## Step 7: Update Frontend API URL

Update `client/src/services/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.PROD 
  ? '/api'  // Firebase Functions via hosting rewrite
  : 'http://localhost:5001/api';  // Local development

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## Step 8: Update CORS in Server

Update `server/src/server.ts` to include your Firebase URLs:

```typescript
const allowedOrigins = [
  'http://localhost:3002',
  'https://your-app.web.app',
  'https://your-app.firebaseapp.com',
  'https://your-custom-domain.com'
];
```

## Deployment Checklist

- [ ] Firebase project created
- [ ] Billing enabled (for Functions)
- [ ] Environment variables configured
- [ ] Frontend built (`npm run build`)
- [ ] Backend code in functions folder
- [ ] firebase.json configured
- [ ] CORS origins updated
- [ ] API URLs updated for production
- [ ] Tested with emulators
- [ ] Deployed to Firebase
- [ ] Verified deployment works

## Post-Deployment

### View Logs:
```bash
firebase functions:log
```

### Monitor Performance:
- Firebase Console → Functions
- Firebase Console → Hosting
- Check usage and quotas

### Update Deployment:
```bash
# Build frontend
cd client && npm run build

# Deploy
cd .. && firebase deploy
```

## Troubleshooting

### Functions Not Working
1. Check billing is enabled
2. Verify environment variables: `firebase functions:config:get`
3. Check logs: `firebase functions:log`
4. Ensure Node version matches (18)

### CORS Errors
1. Update allowedOrigins in server code
2. Redeploy functions
3. Clear browser cache

### Build Errors
1. Check all dependencies installed
2. Verify TypeScript compiles: `npm run build`
3. Check for missing environment variables

## Cost Optimization

### Free Tier Limits:
- Hosting: 10 GB storage, 360 MB/day transfer
- Functions: 2M invocations/month, 400K GB-seconds

### Tips:
1. Use caching headers (already in firebase.json)
2. Optimize images before upload
3. Use Supabase for database (not Firestore)
4. Monitor usage in Firebase Console

## Alternative: Deploy Backend Separately

If Firebase Functions costs are too high:

1. **Deploy backend to Render/Railway:**
   - Free tier available
   - Better for long-running processes
   - Easier environment variable management

2. **Update frontend API URL:**
   ```typescript
   const API_BASE_URL = 'https://your-backend.onrender.com/api';
   ```

3. **Deploy only frontend to Firebase:**
   ```bash
   firebase deploy --only hosting
   ```

## Next Steps

1. Set up custom domain
2. Configure SSL (automatic with Firebase)
3. Set up monitoring and alerts
4. Configure backup strategy
5. Set up CI/CD pipeline
