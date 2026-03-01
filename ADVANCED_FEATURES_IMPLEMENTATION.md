# Advanced Features Implementation Guide

## Services to Integrate

1. **Deepgram** - Speech-to-Text (Voice Input)
2. **Judge0** - Code Execution Engine
3. **Piston** - Alternative Code Execution
4. **CodeMirror** - Code Editor
5. **OpenAI Tokenizer** - Token counting
6. **Google Antigravity** - AI Services

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │CodeMirror│  │ Voice UI │  │ Practice │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Backend API (Node.js/Express)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Deepgram │  │  Judge0  │  │  OpenAI  │              │
│  │  Service │  │  Service │  │  Service │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  Supabase Database                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │Questions │  │  Results │  │   Users  │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
```

## Docker vs Kubernetes

### For Your Application:

**Use Docker** if:
- Single server deployment
- Small to medium scale (< 10,000 users)
- Simple deployment needs
- Cost-effective hosting

**Use Kubernetes** if:
- Multi-server deployment
- Large scale (> 10,000 users)
- Auto-scaling needed
- High availability required
- Complex microservices

**Recommendation**: Start with Docker, migrate to Kubernetes when needed.

---

## Implementation Plan

### Phase 1: Code Editor (CodeMirror)
**Priority**: HIGH
**Complexity**: LOW
**Time**: 2-3 hours

Add live code editor for coding questions.

### Phase 2: Code Execution (Judge0/Piston)
**Priority**: HIGH
**Complexity**: MEDIUM
**Time**: 1-2 days

Execute user code safely in sandbox.

### Phase 3: Voice Input (Deepgram)
**Priority**: MEDIUM
**Complexity**: MEDIUM
**Time**: 1 day

Already partially implemented, enhance it.

### Phase 4: AI Features (OpenAI)
**Priority**: MEDIUM
**Complexity**: MEDIUM
**Time**: 2-3 days

Add AI-powered hints, explanations, code review.

### Phase 5: Containerization (Docker)
**Priority**: LOW
**Complexity**: LOW
**Time**: 1 day

Package application for easy deployment.

---

## Detailed Implementation

### 1. CodeMirror Integration

**Install:**
```bash
npm install @uiw/react-codemirror @codemirror/lang-javascript @codemirror/lang-python @codemirror/theme-one-dark
```

**Component:**
```typescript
// client/src/components/CodeEditor.tsx
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'javascript' | 'python' | 'java' | 'cpp';
  readOnly?: boolean;
}

export function CodeEditor({ value, onChange, language, readOnly }: CodeEditorProps) {
  const getLanguageExtension = () => {
    switch (language) {
      case 'javascript': return javascript();
      case 'python': return python();
      default: return javascript();
    }
  };

  return (
    <CodeMirror
      value={value}
      height="400px"
      theme={oneDark}
      extensions={[getLanguageExtension()]}
      onChange={onChange}
      readOnly={readOnly}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLineGutter: true,
        highlightSpecialChars: true,
        foldGutter: true,
        drawSelection: true,
        dropCursor: true,
        allowMultipleSelections: true,
        indentOnInput: true,
        syntaxHighlighting: true,
        bracketMatching: true,
        closeBrackets: true,
        autocompletion: true,
        rectangularSelection: true,
        crosshairCursor: true,
        highlightActiveLine: true,
        highlightSelectionMatches: true,
        closeBracketsKeymap: true,
        searchKeymap: true,
        foldKeymap: true,
        completionKeymap: true,
        lintKeymap: true,
      }}
    />
  );
}
```

---

### 2. Judge0 Integration

**Backend Service:**
```typescript
// server/src/services/codeExecutionService.ts
import axios from 'axios';

const JUDGE0_API = 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_KEY = process.env.RAPIDAPI_KEY;

interface ExecutionRequest {
  language_id: number;
  source_code: string;
  stdin?: string;
  expected_output?: string;
}

interface ExecutionResult {
  stdout: string;
  stderr: string;
  status: {
    id: number;
    description: string;
  };
  time: string;
  memory: number;
}

export class CodeExecutionService {
  private languageIds = {
    javascript: 63,  // Node.js
    python: 71,      // Python 3
    java: 62,        // Java
    cpp: 54,         // C++
    csharp: 51,      // C#
    go: 60,          // Go
    rust: 73,        // Rust
  };

  async executeCode(request: ExecutionRequest): Promise<ExecutionResult> {
    try {
      // Submit code
      const submitResponse = await axios.post(
        `${JUDGE0_API}/submissions`,
        {
          language_id: request.language_id,
          source_code: Buffer.from(request.source_code).toString('base64'),
          stdin: request.stdin ? Buffer.from(request.stdin).toString('base64') : undefined,
          expected_output: request.expected_output ? Buffer.from(request.expected_output).toString('base64') : undefined,
        },
        {
          headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': JUDGE0_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          },
          params: {
            base64_encoded: 'true',
            fields: '*',
          },
        }
      );

      const token = submitResponse.data.token;

      // Poll for result
      let result;
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const resultResponse = await axios.get(
          `${JUDGE0_API}/submissions/${token}`,
          {
            headers: {
              'X-RapidAPI-Key': JUDGE0_KEY,
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            },
            params: {
              base64_encoded: 'true',
              fields: '*',
            },
          }
        );

        result = resultResponse.data;

        if (result.status.id > 2) {
          // Execution completed
          break;
        }

        attempts++;
      }

      return {
        stdout: result.stdout ? Buffer.from(result.stdout, 'base64').toString() : '',
        stderr: result.stderr ? Buffer.from(result.stderr, 'base64').toString() : '',
        status: result.status,
        time: result.time,
        memory: result.memory,
      };
    } catch (error) {
      console.error('Code execution error:', error);
      throw error;
    }
  }

  getLanguageId(language: string): number {
    return this.languageIds[language as keyof typeof this.languageIds] || 63;
  }
}
```

**API Endpoint:**
```typescript
// server/src/routes/codeExecution.ts
import express from 'express';
import { CodeExecutionService } from '../services/codeExecutionService';

const router = express.Router();
const codeExecutionService = new CodeExecutionService();

router.post('/execute', async (req, res) => {
  try {
    const { language, code, stdin, expectedOutput } = req.body;

    const result = await codeExecutionService.executeCode({
      language_id: codeExecutionService.getLanguageId(language),
      source_code: code,
      stdin,
      expected_output: expectedOutput,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Code execution failed' });
  }
});

export default router;
```

---

### 3. Deepgram Enhancement

**Already implemented, but enhance:**
```typescript
// client/src/services/deepgramService.ts
import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';

export class DeepgramService {
  private client;
  private connection: any;

  constructor() {
    this.client = createClient(import.meta.env.VITE_DEEPGRAM_API_KEY);
  }

  async startTranscription(onTranscript: (text: string) => void) {
    this.connection = this.client.listen.live({
      model: 'nova-2',
      language: 'en-US',
      smart_format: true,
      punctuate: true,
      interim_results: true,
    });

    this.connection.on(LiveTranscriptionEvents.Transcript, (data: any) => {
      const transcript = data.channel.alternatives[0].transcript;
      if (transcript && data.is_final) {
        onTranscript(transcript);
      }
    });

    return this.connection;
  }

  async sendAudio(audioData: Blob) {
    if (this.connection) {
      this.connection.send(audioData);
    }
  }

  stop() {
    if (this.connection) {
      this.connection.finish();
    }
  }
}
```

---

### 4. OpenAI Integration

**Backend Service:**
```typescript
// server/src/services/openaiService.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class OpenAIService {
  async generateHint(question: string, userCode: string): Promise<string> {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful coding tutor. Provide hints without giving away the complete solution.',
        },
        {
          role: 'user',
          content: `Question: ${question}\n\nUser's code so far:\n${userCode}\n\nProvide a helpful hint.`,
        },
      ],
      max_tokens: 200,
    });

    return response.choices[0].message.content || '';
  }

  async reviewCode(code: string, language: string): Promise<string> {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert code reviewer. Provide constructive feedback on code quality, best practices, and potential improvements.',
        },
        {
          role: 'user',
          content: `Review this ${language} code:\n\n${code}`,
        },
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content || '';
  }

  async explainError(error: string, code: string): Promise<string> {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful programming assistant. Explain errors in simple terms and suggest fixes.',
        },
        {
          role: 'user',
          content: `Error: ${error}\n\nCode:\n${code}\n\nExplain what went wrong and how to fix it.`,
        },
      ],
      max_tokens: 300,
    });

    return response.choices[0].message.content || '';
  }

  countTokens(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }
}
```

---

### 5. Docker Setup

**Dockerfile:**
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

# Build client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Build server
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy server
COPY --from=builder /app/server/dist ./server
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/server/package.json ./server/

# Copy client build
COPY --from=builder /app/client/dist ./client/dist

EXPOSE 3000

CMD ["node", "server/index.js"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - DEEPGRAM_API_KEY=${DEEPGRAM_API_KEY}
      - RAPIDAPI_KEY=${RAPIDAPI_KEY}
    restart: unless-stopped
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

**Build and Run:**
```bash
# Build
docker-compose build

# Run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Cost Estimation

### Monthly Costs (Estimated)

| Service | Free Tier | Paid (1000 users) |
|---------|-----------|-------------------|
| Deepgram | 45 hours | $50-100 |
| Judge0 (RapidAPI) | 50 calls/day | $30-50 |
| OpenAI GPT-4 | $5 credit | $100-200 |
| Supabase | 500MB DB | $25 |
| Hosting (Docker) | - | $20-50 |
| **Total** | **Free** | **$225-425/month** |

---

## Next Steps

1. **Immediate**: Run `FIX_QUESTIONS_SCHEMA.sql` to fix Practice page
2. **Week 1**: Implement CodeMirror editor
3. **Week 2**: Integrate Judge0 for code execution
4. **Week 3**: Enhance Deepgram voice features
5. **Week 4**: Add OpenAI hints and code review
6. **Week 5**: Dockerize application

Would you like me to start implementing any specific feature?
