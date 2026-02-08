# 🎯 Practice System Implementation Guide

## Overview

Build a complete skill assessment system with:
- Multiple programming languages
- 3 difficulty levels per language
- Job role recommendations based on scores
- CSV-based question management

## 📋 Step-by-Step Implementation

### Phase 1: Database Setup

#### Step 1.1: Create Questions Table (if not exists)

```sql
-- Run in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill TEXT NOT NULL,
  level TEXT NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX idx_questions_skill_level ON questions(skill, level);
```

#### Step 1.2: Create Job Roles Table

```sql
-- Job roles with skill requirements
CREATE TABLE IF NOT EXISTS job_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_name TEXT NOT NULL,
  category TEXT NOT NULL,
  required_skills JSONB NOT NULL,
  min_score_percentage INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert job roles
INSERT INTO job_roles (role_name, category, required_skills, min_score_percentage, description) VALUES
-- Web Development
('Frontend Developer', 'web-development', '["HTML", "CSS", "JavaScript"]', 70, 'Build user interfaces and web applications'),
('Backend Developer', 'web-development', '["Python", "Node.js", "SQL"]', 70, 'Develop server-side logic and APIs'),
('Full Stack Developer', 'web-development', '["HTML", "CSS", "JavaScript", "Python", "SQL"]', 75, 'Handle both frontend and backend development'),

-- Mobile Development
('Mobile App Developer', 'mobile-development', '["Java", "Kotlin", "Swift"]', 70, 'Create mobile applications for iOS and Android'),
('React Native Developer', 'mobile-development', '["JavaScript", "React"]', 70, 'Build cross-platform mobile apps'),

-- DevOps
('DevOps Engineer', 'devops', '["Linux", "Docker", "Kubernetes", "Python"]', 75, 'Automate deployment and infrastructure'),
('Cloud Engineer', 'devops', '["AWS", "Azure", "Docker"]', 70, 'Manage cloud infrastructure and services'),

-- Cybersecurity
('Security Analyst', 'cybersecurity', '["Networking", "Linux", "Python"]', 75, 'Identify and mitigate security threats'),
('Penetration Tester', 'cybersecurity', '["Networking", "Linux", "Python", "Security Tools"]', 80, 'Test systems for vulnerabilities'),

-- OpenGL/Graphics
('Graphics Programmer', 'graphics', '["OpenGL", "C++", "Math"]', 75, 'Develop 3D graphics and rendering systems'),
('Game Developer', 'graphics', '["OpenGL", "C++", "Unity"]', 70, 'Create video games and interactive experiences'),
('Shader Developer', 'graphics', '["OpenGL", "GLSL", "Math"]', 80, 'Write custom shaders and visual effects'),
('3D Engine Developer', 'graphics', '["OpenGL", "C++", "Math", "Physics"]', 85, 'Build game engines and 3D frameworks'),
('AR/VR Developer', 'graphics', '["OpenGL", "C++", "Unity"]', 75, 'Create augmented and virtual reality applications'),
('Computer Vision Engineer', 'graphics', '["OpenGL", "Python", "Math"]', 80, 'Develop image processing and CV systems'),
('Rendering Engineer', 'graphics', '["OpenGL", "C++", "GLSL"]', 85, 'Optimize rendering pipelines and performance'),
('Technical Artist', 'graphics', '["OpenGL", "GLSL", "Art Tools"]', 70, 'Bridge art and programming in game development');
```

#### Step 1.3: Create User Results Table

```sql
-- Store user test results
CREATE TABLE IF NOT EXISTS practice_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  skill TEXT NOT NULL,
  level TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage DECIMAL NOT NULL,
  recommended_roles JSONB,
  completed_at TIMESTAMP DEFAULT NOW()
);

-- Add index
CREATE INDEX idx_practice_results_user ON practice_results(user_id, completed_at DESC);
```

### Phase 2: Create CSV Question Files

#### Step 2.1: CSV File Structure

Create folder: `question-bank/`

**File naming convention:**
- `{language}_{level}.csv`
- Example: `javascript_beginner.csv`, `python_intermediate.csv`

**CSV Format:**
```csv
question_text,option_a,option_b,option_c,option_d,correct_answer,explanation
"What is JavaScript?","A programming language","A database","An operating system","A web server","A","JavaScript is a programming language used for web development"
```

#### Step 2.2: Languages to Create

Create CSV files for each:

**Web Development:**
1. HTML (beginner, intermediate, advanced)
2. CSS (beginner, intermediate, advanced)
3. JavaScript (beginner, intermediate, advanced)
4. TypeScript (beginner, intermediate, advanced)
5. React (beginner, intermediate, advanced)

**Backend:**
6. Python (beginner, intermediate, advanced)
7. Node.js (beginner, intermediate, advanced)
8. Java (beginner, intermediate, advanced)
9. SQL (beginner, intermediate, advanced)

**Mobile:**
10. Kotlin (beginner, intermediate, advanced)
11. Swift (beginner, intermediate, advanced)

**DevOps:**
12. Docker (beginner, intermediate, advanced)
13. Kubernetes (beginner, intermediate, advanced)
14. Linux (beginner, intermediate, advanced)

**Graphics/OpenGL:**
15. OpenGL (beginner, intermediate, advanced)
16. GLSL (beginner, intermediate, advanced)
17. C++ (beginner, intermediate, advanced)

**Total: 51 CSV files (17 languages × 3 levels)**

#### Step 2.3: Sample CSV Template

Create `question-bank/template.csv`:
```csv
question_text,option_a,option_b,option_c,option_d,correct_answer,explanation
"Sample question here?","Option A","Option B","Option C","Option D","A","Explanation here"
```

### Phase 3: Upload Script

#### Step 3.1: Create Upload Script

Create `scripts/upload-practice-questions.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface QuestionRow {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
}

async function uploadQuestionsFromCSV(filePath: string, skill: string, level: string) {
  const questions: any[] = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row: QuestionRow) => {
        questions.push({
          skill,
          level,
          question_text: row.question_text,
          question_type: 'multiple-choice',
          options: {
            a: row.option_a,
            b: row.option_b,
            c: row.option_c,
            d: row.option_d
          },
          correct_answer: row.correct_answer.toLowerCase(),
          explanation: row.explanation
        });
      })
      .on('end', async () => {
        console.log(`Uploading ${questions.length} questions for ${skill} (${level})...`);
        
        const { data, error } = await supabase
          .from('questions')
          .insert(questions);
        
        if (error) {
          console.error(`Error uploading ${skill} ${level}:`, error);
          reject(error);
        } else {
          console.log(`✓ Uploaded ${questions.length} questions for ${skill} (${level})`);
          resolve(data);
        }
      })
      .on('error', reject);
  });
}

async function uploadAllQuestions() {
  const questionBankDir = path.join(__dirname, '../question-bank');
  const files = fs.readdirSync(questionBankDir).filter(f => f.endsWith('.csv'));
  
  for (const file of files) {
    const [skill, level] = file.replace('.csv', '').split('_');
    const filePath = path.join(questionBankDir, file);
    
    try {
      await uploadQuestionsFromCSV(filePath, skill, level);
    } catch (error) {
      console.error(`Failed to upload ${file}:`, error);
    }
  }
  
  console.log('\n✓ All questions uploaded!');
}

uploadAllQuestions();
```

#### Step 3.2: Create Batch Upload Script

Create `UPLOAD_PRACTICE_QUESTIONS.bat`:

```batch
@echo off
echo ========================================
echo Uploading Practice Questions
echo ========================================
echo.

echo Compiling TypeScript...
call npx ts-node scripts/upload-practice-questions.ts

echo.
echo ========================================
echo Upload Complete!
echo ========================================
pause
```

### Phase 4: Update Frontend

#### Step 4.1: Update Practice Page

Update `client/src/pages/Practice.tsx`:

```typescript
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const LANGUAGES = [
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'react', label: 'React' },
  { value: 'python', label: 'Python' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'java', label: 'Java' },
  { value: 'sql', label: 'SQL' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'swift', label: 'Swift' },
  { value: 'docker', label: 'Docker' },
  { value: 'kubernetes', label: 'Kubernetes' },
  { value: 'linux', label: 'Linux' },
  { value: 'opengl', label: 'OpenGL' },
  { value: 'glsl', label: 'GLSL' },
  { value: 'cpp', label: 'C++' },
];

const LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export default function Practice() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [skill, setSkill] = useState('javascript');
  const [level, setLevel] = useState('beginner');
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [recommendedRoles, setRecommendedRoles] = useState<any[]>([]);

  useEffect(() => {
    loadQuestions();
  }, [skill, level]);

  const loadQuestions = async () => {
    setLoading(true);
    setShowResults(false);
    setSelectedAnswers({});
    
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('skill', skill)
        .eq('level', level)
        .limit(20);
      
      if (error) throw error;
      
      setQuestions(data || []);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Calculate score
    let correctCount = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct_answer) {
        correctCount++;
      }
    });
    
    const percentage = (correctCount / questions.length) * 100;
    setScore(correctCount);
    setShowResults(true);
    
    // Get job recommendations
    const { data: roles } = await supabase
      .from('job_roles')
      .select('*')
      .lte('min_score_percentage', percentage)
      .contains('required_skills', [skill]);
    
    setRecommendedRoles(roles || []);
    
    // Save result
    if (user) {
      await supabase.from('practice_results').insert({
        user_id: user.id,
        skill,
        level,
        score: correctCount,
        total_questions: questions.length,
        percentage,
        recommended_roles: roles
      });
    }
  };

  const allAnswered = questions.every(q => selectedAnswers[q.id]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Practice Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <Select value={skill} onValueChange={setSkill}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map(lvl => (
                    <SelectItem key={lvl.value} value={lvl.value}>
                      {lvl.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {loading && <p>Loading questions...</p>}
            
            {!loading && questions.length === 0 && (
              <p>No questions available for this combination.</p>
            )}
            
            {!loading && questions.length > 0 && (
              <div className="space-y-6">
                {questions.map((q, idx) => (
                  <div key={q.id} className="space-y-3">
                    <p className="font-medium text-lg">
                      {idx + 1}. {q.question_text}
                    </p>
                    <div className="space-y-2">
                      {Object.entries(q.options).map(([key, value]: [string, any]) => {
                        const isSelected = selectedAnswers[q.id] === key;
                        const isCorrect = showResults && q.correct_answer === key;
                        const isWrong = showResults && isSelected && !isCorrect;
                        
                        return (
                          <button
                            key={key}
                            onClick={() => !showResults && setSelectedAnswers(prev => ({
                              ...prev,
                              [q.id]: key
                            }))}
                            className={`w-full text-left border rounded-lg p-3 transition-all ${
                              isCorrect ? 'border-green-500 bg-green-50' :
                              isWrong ? 'border-red-500 bg-red-50' :
                              isSelected ? 'border-blue-500 bg-blue-50' :
                              'border-gray-200 hover:border-blue-300'
                            }`}
                            disabled={showResults}
                          >
                            <span className="font-medium">{key.toUpperCase()}.</span> {value}
                          </button>
                        );
                      })}
                    </div>
                    {showResults && q.explanation && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!showResults && questions.length > 0 && (
              <Button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="mt-6"
              >
                Submit Test
              </Button>
            )}

            {showResults && (
              <div className="mt-6 space-y-4">
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardContent className="pt-6">
                    <h3 className="text-2xl font-bold mb-2">
                      Score: {score} / {questions.length}
                    </h3>
                    <p className="text-lg">
                      Percentage: {((score / questions.length) * 100).toFixed(1)}%
                    </p>
                  </CardContent>
                </Card>

                {recommendedRoles.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Recommended Job Roles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recommendedRoles.map(role => (
                          <div key={role.id} className="border rounded-lg p-4">
                            <h4 className="font-bold text-lg">{role.role_name}</h4>
                            <p className="text-sm text-gray-600">{role.description}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              Category: {role.category}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button onClick={loadQuestions} variant="outline">
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
```

### Phase 5: Generate Questions with AI

#### Step 5.1: Create Question Generator Script

Create `scripts/generate-practice-questions.ts`:

```typescript
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const LANGUAGES = [
  'html', 'css', 'javascript', 'typescript', 'react',
  'python', 'nodejs', 'java', 'sql',
  'kotlin', 'swift',
  'docker', 'kubernetes', 'linux',
  'opengl', 'glsl', 'cpp'
];

const LEVELS = ['beginner', 'intermediate', 'advanced'];

async function generateQuestions(language: string, level: string, count: number = 30) {
  const prompt = `Generate ${count} multiple-choice questions for ${language} at ${level} level.

Format as CSV with these columns:
question_text,option_a,option_b,option_c,option_d,correct_answer,explanation

Requirements:
- Questions should test practical knowledge
- Options should be plausible
- Correct answer should be A, B, C, or D
- Include brief explanation
- Escape commas and quotes properly

Example:
"What is ${language}?","A programming language","A database","An OS","A framework","A","${language} is a programming language"`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7
  });

  return response.choices[0].message.content;
}

async function generateAllQuestions() {
  const outputDir = path.join(__dirname, '../question-bank');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const language of LANGUAGES) {
    for (const level of LEVELS) {
      console.log(`Generating ${language} ${level}...`);
      
      try {
        const csv = await generateQuestions(language, level);
        const filename = `${language}_${level}.csv`;
        const filepath = path.join(outputDir, filename);
        
        fs.writeFileSync(filepath, csv!);
        console.log(`✓ Created ${filename}`);
        
        // Wait to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error generating ${language} ${level}:`, error);
      }
    }
  }
  
  console.log('\n✓ All questions generated!');
}

generateAllQuestions();
```

#### Step 5.2: Create Generation Script

Create `GENERATE_ALL_PRACTICE_QUESTIONS.bat`:

```batch
@echo off
echo ========================================
echo Generating Practice Questions with AI
echo ========================================
echo.
echo This will generate 51 CSV files (17 languages x 3 levels)
echo Estimated time: 10-15 minutes
echo.
pause

call npx ts-node scripts/generate-practice-questions.ts

echo.
echo ========================================
echo Generation Complete!
echo ========================================
echo.
echo Next step: Run UPLOAD_PRACTICE_QUESTIONS.bat
echo.
pause
```

### Phase 6: Testing & Deployment

#### Step 6.1: Test Locally

```bash
# 1. Generate questions
GENERATE_ALL_PRACTICE_QUESTIONS.bat

# 2. Upload to database
UPLOAD_PRACTICE_QUESTIONS.bat

# 3. Start app
cd client
npm run dev

# 4. Test practice page
# Go to http://localhost:3000/practice
```

#### Step 6.2: Verify Data

```sql
-- Check questions count
SELECT skill, level, COUNT(*) as count
FROM questions
GROUP BY skill, level
ORDER BY skill, level;

-- Check job roles
SELECT * FROM job_roles;

-- Check user results
SELECT * FROM practice_results
ORDER BY completed_at DESC
LIMIT 10;
```

## 📊 Summary

### What You'll Have:

1. **17 Programming Languages**
   - Web: HTML, CSS, JavaScript, TypeScript, React
   - Backend: Python, Node.js, Java, SQL
   - Mobile: Kotlin, Swift
   - DevOps: Docker, Kubernetes, Linux
   - Graphics: OpenGL, GLSL, C++

2. **3 Difficulty Levels Each**
   - Beginner
   - Intermediate
   - Advanced

3. **51 CSV Files**
   - 30 questions per file
   - Total: 1,530 questions

4. **16 Job Roles**
   - Web Development (3 roles)
   - Mobile Development (2 roles)
   - DevOps (2 roles)
   - Cybersecurity (2 roles)
   - Graphics/OpenGL (8 roles)

5. **Smart Recommendations**
   - Based on test scores
   - Matched to required skills
   - Personalized career paths

## 🚀 Quick Start Commands

```bash
# Generate all questions
GENERATE_ALL_PRACTICE_QUESTIONS.bat

# Upload to database
UPLOAD_PRACTICE_QUESTIONS.bat

# Test locally
cd client && npm run dev
```

That's it! Your complete practice system is ready! 🎉
