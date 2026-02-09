# 🔒 Remove .env Files from Git History

## ✅ Current Status

Your `.gitignore` has been updated to ensure `.env` files are never committed:
- `.env`
- `.env.local`
- `functions/.env`
- All `.env` files in subdirectories

## 🔍 Check if .env is Tracked

The `.env` files are **NOT currently tracked** by Git. ✅

Only example files are tracked (which is correct):
- `.env.example`
- `client/.env.example`
- `functions/.env.example`

## 🚨 If .env Was Previously Committed

If you accidentally committed `.env` files in the past, follow these steps:

### Option 1: Remove from Git (Keep Local File)
```bash
# Remove .env from Git tracking but keep the file locally
git rm --cached .env
git rm --cached functions/.env

# Commit the removal
git add .gitignore
git commit -m "Remove .env files from Git tracking"

# Push to remote
git push origin main
```

### Option 2: Remove from Git History (Complete Cleanup)
```bash
# WARNING: This rewrites Git history!
# Only use if .env was committed with sensitive data

# Remove .env from all commits
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env functions/.env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: This affects all collaborators)
git push origin --force --all
```

### Option 3: Use BFG Repo-Cleaner (Recommended for Large Repos)
```bash
# Install BFG
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Remove .env files
java -jar bfg.jar --delete-files .env

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push origin --force --all
```

## 🔐 Rotate Your API Keys

If your `.env` file was ever committed to Git, you should **rotate all API keys**:

### 1. AssemblyAI
- Go to: https://www.assemblyai.com/app/account
- Delete old API key
- Generate new API key
- Update `.env` and `functions/.env`

### 2. OpenAI
- Go to: https://platform.openai.com/api-keys
- Revoke old key
- Create new key
- Update `.env`

### 3. Supabase
- Go to: Supabase Dashboard → Settings → API
- Regenerate keys if needed
- Update `.env`

### 4. Other Keys
- Groq API Key
- DeepSeek API Key
- Any other sensitive keys

## ✅ Best Practices

### 1. Always Use .env.example
```bash
# .env.example (commit this)
ASSEMBLYAI_API_KEY=your_api_key_here
OPENAI_API_KEY=your_openai_key_here

# .env (never commit this)
ASSEMBLYAI_API_KEY=b89fc23a649842fd809cdb19724079bc
OPENAI_API_KEY=sk-proj-actual-key-here
```

### 2. Check Before Committing
```bash
# Always check what you're committing
git status
git diff

# Make sure .env is not listed
```

### 3. Use Git Hooks (Optional)
Create `.git/hooks/pre-commit`:
```bash
#!/bin/sh
if git diff --cached --name-only | grep -q "\.env$"; then
    echo "ERROR: Attempting to commit .env file!"
    echo "Please remove it from staging: git reset HEAD .env"
    exit 1
fi
```

### 4. Use Environment Variables in CI/CD
Never store keys in code. Use:
- GitHub Secrets
- Vercel Environment Variables
- Netlify Environment Variables
- Railway Environment Variables

## 🎯 Current Setup

Your project is now configured correctly:

✅ `.gitignore` updated
✅ `.env` files not tracked
✅ Example files available for reference
✅ API keys secure

## 📝 Quick Commands

```bash
# Check if .env is tracked
git ls-files | grep .env

# Remove from staging if accidentally added
git reset HEAD .env
git reset HEAD functions/.env

# Verify .gitignore is working
git status

# Should NOT show .env files
```

## 🔒 Security Checklist

- [x] `.env` in `.gitignore`
- [x] `functions/.env` in `.gitignore`
- [x] `.env` not tracked by Git
- [x] Example files available
- [ ] API keys rotated (if ever committed)
- [ ] Team members notified
- [ ] CI/CD secrets updated

## ✅ You're Secure!

Your AssemblyAI API key and other secrets are now protected from being committed to Git.

**Remember**: Never commit `.env` files, always use `.env.example` for documentation.
