# Deployment Guide

Complete step-by-step guide to deploy the Skill Evaluation Platform to Firebase.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] Firebase project created
- [ ] OpenAI API key obtained
- [ ] Git repository (optional)

## Step 1: Firebase Project Setup

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name (e.g., "skill-evaluation-platform")
4. Enable Google Analytics (optional)
5. Create project

### Enable Required Services

1. **Authentication**
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"

2. **Firestore Database**
   - Go to Firestore Database
   - Click "Create database"
   - Start in production mode
   - Choose location (e.g., us-central)

3. **Cloud Functions**
   - Will be enabled automatically on first deploy

## Step 2: Local Setup

### Install Dependencies

```bash
# Root directory
npm run install:all

# This installs:
# - Root dependencies
# - Client dependencies (React app)
# - Functions dependencies (Backend)
```

### Firebase Login

```bash
firebase login
```

### Link Firebase Project

```bash
# Update .firebaserc with your project ID
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

## Step 3: Configuration

### Backend Configuration

Create `functions/.env`:

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**Get OpenAI API Key:**
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up / Login
3. Go to API Keys
4. Create new secret key
5. Copy and paste into `.env`

### Frontend Configuration

Create `client/.env`:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_API_URL=https://us-central1-your-project.cloudfunctions.net/api
```

**Get Firebase Config:**
1. Go to Firebase Console
2. Project Settings (gear icon)
3. Scroll to "Your apps"
4. Click "Web" icon (</>) to add web app
5. Register app
6. Copy configuration values

## Step 4: Deploy Firestore Rules & Indexes

```bash
# Deploy security rules
firebase deploy --only firestore:rules

# Deploy indexes
firebase deploy --only firestore:indexes
```

## Step 5: Seed Initial Data

### Option A: Using Firebase Console

1. Go to Firestore Database
2. Start collection: `careers`
3. Add document with auto-ID
4. Add fields:

```json
{
  "name": "OGL Content Developer",
  "description": "Frontend developer specializing in web content",
  "skills": [
    {
      "name": "HTML",
      "level": "Intermediate"
    },
    {
      "name": "CSS",
      "level": "Intermediate"
    },
    {
      "name": "JavaScript",
      "level": "Intermediate"
    }
  ],
  "created_at": "2026-01-20T00:00:00.000Z"
}
```

### Option B: Using Script

Create `seed.js` in root:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seed() {
  await db.collection('careers').add({
    name: 'OGL Content Developer',
    description: 'Frontend developer specializing in web content',
    skills: [
      { name: 'HTML', level: 'Intermediate' },
      { name: 'CSS', level: 'Intermediate' },
      { name: 'JavaScript', level: 'Intermediate' }
    ],
    created_at: new Date().toISOString()
  });
  console.log('Seeded successfully');
}

seed();
```

Run: `node seed.js`

## Step 6: Deploy Backend (Cloud Functions)

```bash
# Deploy functions
firebase deploy --only functions

# This will:
# - Upload function code
# - Install dependencies
# - Deploy API endpoint
```

**Note the deployed URL:**
```
Function URL (api): https://us-central1-your-project.cloudfunctions.net/api
```

Update `client/.env` with this URL.

## Step 7: Build Frontend

```bash
cd client
npm run build
```

This creates `client/dist/` folder with production build.

## Step 8: Deploy Frontend (Hosting)

```bash
# From root directory
firebase deploy --only hosting
```

**Your app is now live!**
```
Hosting URL: https://your-project.firebaseapp.com
```

## Step 9: Test Deployment

1. Visit your hosting URL
2. Click "Sign Up" and create account
3. Go to "Careers"
4. Select "OGL Content Developer"
5. Choose a skill and level
6. Complete evaluation
7. View scorecard

## Step 10: Set Up Admin User (Optional)

### Using Firebase Console

1. Go to Authentication
2. Find your user
3. Click user > Set custom claims
4. Add: `{"admin": true}`

### Using Firebase CLI

```bash
firebase auth:export users.json
# Edit users.json to add admin claim
firebase auth:import users.json
```

## Complete Deployment Command

Deploy everything at once:

```bash
npm run deploy
```

This runs:
1. `cd client && npm run build` - Build frontend
2. `firebase deploy` - Deploy all services

## Post-Deployment

### Monitor Functions

```bash
# View logs
firebase functions:log

# View specific function
firebase functions:log --only api
```

### Update Environment Variables

```bash
# Set function config
firebase functions:config:set openai.key="your-key"

# Get current config
firebase functions:config:get
```

### Custom Domain (Optional)

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow DNS setup instructions

## Troubleshooting

### Function Deployment Fails

```bash
# Check Node version
node --version  # Should be 18+

# Clear cache
rm -rf functions/node_modules
cd functions && npm install
```

### CORS Errors

Ensure `functions/index.js` has:
```javascript
app.use(cors({ origin: true }));
```

### Firestore Permission Denied

Check `firestore.rules` is deployed:
```bash
firebase deploy --only firestore:rules
```

### Build Errors

```bash
# Clear client cache
cd client
rm -rf node_modules dist
npm install
npm run build
```

## Rollback

```bash
# View deployment history
firebase hosting:channel:list

# Rollback to previous version
firebase hosting:rollback
```

## CI/CD Setup (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm run install:all
      - run: npm run build:client
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: your-project-id
```

## Cost Estimation

### Firebase Free Tier Includes:
- 50K reads/day (Firestore)
- 20K writes/day (Firestore)
- 125K function invocations/month
- 10GB hosting/month

### OpenAI Costs:
- GPT-4 Turbo: ~$0.01 per question generation
- Estimate: $0.10 per complete evaluation

## Security Checklist

- [ ] Firestore rules deployed
- [ ] Environment variables secured
- [ ] API keys not in source code
- [ ] CORS properly configured
- [ ] Authentication enabled
- [ ] Admin claims configured

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update
cd client && npm update
cd ../functions && npm update

# Redeploy
npm run deploy
```

### Backup Firestore

```bash
# Export data
gcloud firestore export gs://your-bucket/backup

# Import data
gcloud firestore import gs://your-bucket/backup
```

## Support

For deployment issues:
- Check Firebase Console logs
- Review function logs: `firebase functions:log`
- Check Firestore rules
- Verify environment variables

---

**Deployment Complete! 🚀**

Your Skill Evaluation Platform is now live and ready to use.
