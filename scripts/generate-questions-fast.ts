import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'your_supabase_url';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your_supabase_anon_key';
const openaiKey = process.env.OPENAI_API_KEY || 'your_openai_api_key';

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ apiKey: openaiKey });

// Skills to generate questions for
const skills = [
  'HTML',
  'CSS',
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'Testing Tools',
  'Docker',
  'Kubernetes',
  'Cloud Platforms',
  'jQuery',
  'OGL Knowledge'
];

const levels = ['BASIC', 'INTERMEDIATE', 'ADVANCED'];

async function generateQuestionsForSkill(skill: string, level: string, count: number = 5) {
  console.log(`\n🤖 Generating ${count} ${level} questions for ${skill}...`);

  const prompt = `Generate ${count} technical evaluation questions for ${skill} at ${level} level.

Level Guidelines:
- BASIC: Understanding concepts, reading code, identifying syntax
- INTERMEDIATE: Modifying code, debugging, applying concepts
- ADVANCED: Creating solutions from scratch, architecture, best practices

Return a JSON array with this exact structure:
[
  {
    "type": "mcq",
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": "Option A",
    "explanation": "Why this is correct"
  }
]

Requirements:
- Mix of question types: mcq (multiple choice)
- Practical, real-world scenarios
- Clear, unambiguous questions
- Detailed explanations
- Return ONLY valid JSON array, no markdown`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a technical interviewer creating evaluation questions. Return only valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = response.choices[0].message.content?.trim() || '[]';
    
    // Remove markdown code blocks if present
    const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const questions = JSON.parse(jsonContent);
    
    // Insert questions into Supabase
    const questionsToInsert = questions.map((q: any) => ({
      question_id: `${skill.toLowerCase().replace(/\s+/g, '-')}-${level.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      skill: skill,
      level: level,
      type: q.type || 'mcq',
      question: q.question,
      options: q.options || [],
      correct_answer: q.correct_answer,
      explanation: q.explanation || '',
      verified: true,
      usage_count: 0
    }));

    const { data, error } = await supabase
      .from('questions')
      .insert(questionsToInsert);

    if (error) {
      console.error(`❌ Error inserting questions:`, error.message);
      return 0;
    }

    console.log(`✅ Generated and saved ${questions.length} questions`);
    return questions.length;

  } catch (error: any) {
    console.error(`❌ Error generating questions:`, error.message);
    return 0;
  }
}

async function main() {
  console.log('🚀 Fast Question Generation Started!\n');
  console.log(`Generating questions for ${skills.length} skills × ${levels.length} levels`);
  console.log(`Total: ${skills.length * levels.length * 5} questions\n`);

  let totalGenerated = 0;

  for (const skill of skills) {
    for (const level of levels) {
      const count = await generateQuestionsForSkill(skill, level, 5);
      totalGenerated += count;
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log(`\n✅ COMPLETE! Generated ${totalGenerated} questions total`);
  console.log('\nVerify in Supabase:');
  console.log('https://supabase.com/dashboard/project/ksjgsgebjnpwyycnptom/editor/17524');
}

main().catch(console.error);
