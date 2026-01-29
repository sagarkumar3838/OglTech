import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface TopicData {
  skillName: string;
  category: string;
  topicName: string;
  slug: string;
  description: string;
  difficultyLevel: 'basic' | 'intermediate' | 'advanced';
  icon: string;
  color: string;
  sections: Array<{
    title: string;
    type: 'syntax' | 'example' | 'explanation' | 'code' | 'table' | 'list' | 'note' | 'warning' | 'tip';
    content: string;
    codeLanguage?: string;
  }>;
  examples?: Array<{
    title: string;
    description: string;
    code: string;
    language: string;
    output?: string;
    explanation?: string;
  }>;
}

async function addTopic(topicData: TopicData) {
  try {
    console.log(`Adding topic: ${topicData.topicName}...`);

    // 1. Insert topic reference
    const { data: topic, error: topicError } = await supabase
      .from('topic_references')
      .insert({
        skill_name: topicData.skillName,
        category: topicData.category,
        topic_name: topicData.topicName,
        slug: topicData.slug,
        description: topicData.description,
        difficulty_level: topicData.difficultyLevel,
        icon: topicData.icon,
        color: topicData.color,
        is_active: true,
      })
      .select()
      .single();

    if (topicError) {
      console.error('Error inserting topic:', topicError);
      return;
    }

    console.log(`✓ Topic created with ID: ${topic.id}`);

    // 2. Insert content sections
    if (topicData.sections && topicData.sections.length > 0) {
      const sections = topicData.sections.map((section, index) => ({
        topic_id: topic.id,
        section_title: section.title,
        section_type: section.type,
        content: section.content,
        code_language: section.codeLanguage,
        order_index: index + 1,
      }));

      const { error: sectionsError } = await supabase
        .from('topic_content_sections')
        .insert(sections);

      if (sectionsError) {
        console.error('Error inserting sections:', sectionsError);
      } else {
        console.log(`✓ Added ${sections.length} content sections`);
      }
    }

    // 3. Insert examples
    if (topicData.examples && topicData.examples.length > 0) {
      const examples = topicData.examples.map((example, index) => ({
        topic_id: topic.id,
        title: example.title,
        description: example.description,
        code: example.code,
        language: example.language,
        output: example.output,
        explanation: example.explanation,
        order_index: index + 1,
      }));

      const { error: examplesError } = await supabase
        .from('topic_examples')
        .insert(examples);

      if (examplesError) {
        console.error('Error inserting examples:', examplesError);
      } else {
        console.log(`✓ Added ${examples.length} examples`);
      }
    }

    console.log(`✅ Successfully added topic: ${topicData.topicName}\n`);
  } catch (error) {
    console.error('Error adding topic:', error);
  }
}

// Example: Add React topics
const reactTopics: TopicData[] = [
  {
    skillName: 'React',
    category: 'Basics',
    topicName: 'JSX',
    slug: 'react-jsx',
    description: 'JavaScript XML syntax for React',
    difficultyLevel: 'basic',
    icon: '⚛️',
    color: '#61DAFB',
    sections: [
      {
        title: 'What is JSX?',
        type: 'explanation',
        content: 'JSX is a syntax extension for JavaScript that lets you write HTML-like markup inside JavaScript files.',
      },
      {
        title: 'Basic JSX Syntax',
        type: 'code',
        content: `const element = <h1>Hello, World!</h1>;

// JSX with expressions
const name = 'John';
const greeting = <h1>Hello, {name}!</h1>;

// JSX with attributes
const image = <img src="photo.jpg" alt="Profile" />;

// JSX with children
const container = (
  <div>
    <h1>Title</h1>
    <p>Paragraph</p>
  </div>
);`,
        codeLanguage: 'jsx',
      },
      {
        title: 'JSX Rules',
        type: 'tip',
        content: '1. Return a single root element\n2. Close all tags\n3. Use camelCase for attributes (className, onClick)\n4. Use curly braces {} for JavaScript expressions',
      },
    ],
  },
  {
    skillName: 'React',
    category: 'Hooks',
    topicName: 'useState',
    slug: 'react-usestate',
    description: 'State management in functional components',
    difficultyLevel: 'intermediate',
    icon: '🎣',
    color: '#61DAFB',
    sections: [
      {
        title: 'useState Hook',
        type: 'explanation',
        content: 'useState is a Hook that lets you add state to functional components.',
      },
      {
        title: 'Basic Usage',
        type: 'code',
        content: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`,
        codeLanguage: 'jsx',
      },
      {
        title: 'Multiple State Variables',
        type: 'code',
        content: `function Form() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState('');

  return (
    <form>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      <input 
        type="number"
        value={age} 
        onChange={(e) => setAge(Number(e.target.value))} 
      />
      <input 
        type="email"
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
    </form>
  );
}`,
        codeLanguage: 'jsx',
      },
      {
        title: 'State with Objects',
        type: 'code',
        content: `function UserProfile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });

  const updateName = (name) => {
    setUser(prev => ({ ...prev, name }));
  };

  return (
    <input 
      value={user.name}
      onChange={(e) => updateName(e.target.value)}
    />
  );
}`,
        codeLanguage: 'jsx',
      },
      {
        title: 'Important Note',
        type: 'warning',
        content: 'State updates are asynchronous. If you need the previous state value, use the functional update form: setCount(prev => prev + 1)',
      },
    ],
  },
];

// Run the script
async function main() {
  console.log('🚀 Starting topic import...\n');

  for (const topic of reactTopics) {
    await addTopic(topic);
  }

  console.log('✅ All topics imported successfully!');
  process.exit(0);
}

// Uncomment to run
// main();

// Export for use in other scripts
export { addTopic, TopicData };
