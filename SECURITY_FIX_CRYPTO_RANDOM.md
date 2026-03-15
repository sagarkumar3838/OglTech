# Security Fix: Cryptographically Secure Random Number Generation

## Issue
CodeQL detected insecure random number generation using `Math.random()` in security-sensitive contexts (session IDs, evaluation IDs, question IDs).

## Why This Matters
- `Math.random()` is **NOT cryptographically secure**
- Attackers can predict the output and potentially:
  - Hijack user sessions
  - Access other users' evaluations
  - Manipulate question IDs

## What Was Fixed

### 1. Session Service (`server/src/services/sessionService.ts`)
**Before:**
```typescript
const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
```

**After:**
```typescript
import { randomBytes } from 'crypto';

const randomSuffix = randomBytes(16).toString('hex');
const sessionId = `session-${Date.now()}-${randomSuffix}`;
```

### 2. Questions Route (`server/src/routes/questions.ts`)
**Before:**
```typescript
const evaluationId = `eval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
```

**After:**
```typescript
import { randomBytes } from 'crypto';

const randomSuffix = randomBytes(16).toString('hex');
const evaluationId = `eval-${Date.now()}-${randomSuffix}`;
```

### 3. Hybrid Question Service (`server/src/services/hybridQuestionService.ts`)
**Before:**
```typescript
const questionId = `${skill}-${level}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
```

**After:**
```typescript
import { randomBytes } from 'crypto';

const randomSuffix = randomBytes(8).toString('hex');
const questionId = `${skill}-${level}-${Date.now()}-${randomSuffix}`;
```

## What's Still Using Math.random() (Safe)

These uses are **NOT security-sensitive** and are fine:

1. **Array shuffling** (QuestionBank.ts, RAGService.ts, questionService.ts)
   - Used for randomizing question order
   - Not used for authentication or authorization
   - Performance is more important than cryptographic security

2. **Client-side shuffling** (questionLoaderService.ts)
   - Runs in browser, not security-critical
   - Just for UI randomization

3. **Script utilities** (upload scripts)
   - One-time data migration scripts
   - Not used in production runtime

## Security Best Practices

### When to Use `crypto.randomBytes()`
✅ Session IDs
✅ Authentication tokens
✅ Evaluation IDs
✅ Any ID used for access control
✅ Password reset tokens
✅ API keys

### When `Math.random()` is OK
✅ Shuffling arrays for display
✅ Random UI animations
✅ Non-security game mechanics
✅ A/B testing assignments (non-sensitive)

## Testing

Run the application and verify:
1. Session IDs are now 32+ character hex strings
2. Evaluation IDs are longer and more random
3. Question IDs are cryptographically secure

Example output:
```
Before: session-1710512345-a3f9k2
After:  session-1710512345-4f8a2b9c1d3e5f6a7b8c9d0e1f2a3b4c
```

## References
- [Node.js crypto.randomBytes()](https://nodejs.org/api/crypto.html#cryptorandombytessize-callback)
- [OWASP: Insufficient Randomness](https://owasp.org/www-community/vulnerabilities/Insufficient_Randomness)
- [CWE-338: Use of Cryptographically Weak PRNG](https://cwe.mitre.org/data/definitions/338.html)
