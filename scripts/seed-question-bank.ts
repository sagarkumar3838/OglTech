import admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Sample high-quality questions for the question bank
const sampleQuestions = [
  // HTML - BASIC
  {
    skill_area: 'HTML',
    level: 'BASIC',
    type: 'mcq',
    question: 'Which HTML element is used to define the title of a document that appears in the browser tab?',
    options: ['<title>', '<head>', '<meta>', '<header>'],
    correct_answer: '<title>',
    expected_skills: ['HTML basics', 'Document structure'],
    difficulty_weight: 5,
  },
  {
    skill_area: 'HTML',
    level: 'BASIC',
    type: 'mcq',
    question: 'What is the correct HTML element for inserting a line break?',
    options: ['<br>', '<break>', '<lb>', '<newline>'],
    correct_answer: '<br>',
    expected_skills: ['HTML basics', 'Text formatting'],
    difficulty_weight: 4,
  },
  // HTML - INTERMEDIATE
  {
    skill_area: 'HTML',
    level: 'INTERMEDIATE',
    type: 'scenario',
    question: 'You need to create a form that collects user email and requires validation. Which combination is most appropriate?',
    options: [
      '<input type="text" name="email">',
      '<input type="email" name="email" required>',
      '<input type="text" name="email" pattern="email">',
      '<email-input name="email">'
    ],
    correct_answer: '<input type="email" name="email" required>',
    expected_skills: ['Forms', 'HTML5 validation', 'Input types'],
    difficulty_weight: 7,
  },
  // CSS - BASIC
  {
    skill_area: 'CSS',
    level: 'BASIC',
    type: 'mcq',
    question: 'Which CSS property is used to change the text color of an element?',
    options: ['color', 'text-color', 'font-color', 'text-style'],
    correct_answer: 'color',
    expected_skills: ['CSS basics', 'Text styling'],
    difficulty_weight: 4,
  },
  {
    skill_area: 'CSS',
    level: 'BASIC',
    type: 'mcq',
    question: 'What is the correct CSS syntax to make all <p> elements bold?',
    options: [
      'p {font-weight: bold;}',
      'p {text-weight: bold;}',
      '<p style="bold">',
      'p {font: bold;}'
    ],
    correct_answer: 'p {font-weight: bold;}',
    expected_skills: ['CSS syntax', 'Font properties'],
    difficulty_weight: 5,
  },
  // CSS - INTERMEDIATE
  {
    skill_area: 'CSS',
    level: 'INTERMEDIATE',
    type: 'scenario',
    question: 'You need to center a div both horizontally and vertically within its parent. Which modern CSS approach is most appropriate?',
    options: [
      'margin: auto;',
      'display: flex; justify-content: center; align-items: center;',
      'text-align: center; vertical-align: middle;',
      'position: absolute; top: 50%; left: 50%;'
    ],
    correct_answer: 'display: flex; justify-content: center; align-items: center;',
    expected_skills: ['Flexbox', 'Layout', 'Centering'],
    difficulty_weight: 8,
  },
  // JavaScript - BASIC
  {
    skill_area: 'JavaScript',
    level: 'BASIC',
    type: 'mcq',
    question: 'Which method is used to add an element to the end of an array?',
    options: ['push()', 'add()', 'append()', 'insert()'],
    correct_answer: 'push()',
    expected_skills: ['Arrays', 'Array methods'],
    difficulty_weight: 5,
  },
  {
    skill_area: 'JavaScript',
    level: 'BASIC',
    type: 'code_reasoning',
    question: 'What will be the output of: console.log(typeof null)?',
    options: ['"null"', '"undefined"', '"object"', '"number"'],
    correct_answer: '"object"',
    expected_skills: ['Data types', 'typeof operator'],
    difficulty_weight: 6,
  },
  // JavaScript - INTERMEDIATE
  {
    skill_area: 'JavaScript',
    level: 'INTERMEDIATE',
    type: 'scenario',
    question: 'You need to fetch data from an API and handle errors properly. Which approach is most appropriate?',
    options: [
      'fetch(url).then(res => res.json())',
      'try { fetch(url) } catch(e) { }',
      'fetch(url).then(res => res.json()).catch(err => console.error(err))',
      'async function getData() { const res = await fetch(url); }'
    ],
    correct_answer: 'fetch(url).then(res => res.json()).catch(err => console.error(err))',
    expected_skills: ['Promises', 'Error handling', 'Fetch API'],
    difficulty_weight: 8,
  },
  // HTML - ADVANCED
  {
    skill_area: 'HTML',
    level: 'ADVANCED',
    type: 'scenario',
    question: 'You are building an accessible modal dialog. Which ARIA attributes are essential for screen reader compatibility?',
    options: [
      'role="dialog" aria-modal="true" aria-labelledby="title"',
      'role="popup" aria-hidden="false"',
      'role="modal" aria-visible="true"',
      'role="dialog" tabindex="0"'
    ],
    correct_answer: 'role="dialog" aria-modal="true" aria-labelledby="title"',
    expected_skills: ['ARIA', 'Accessibility', 'Modal dialogs'],
    difficulty_weight: 9,
  },
  // CSS - ADVANCED
  {
    skill_area: 'CSS',
    level: 'ADVANCED',
    type: 'scenario',
    question: 'You need to optimize CSS performance for a large application. Which strategy is most effective?',
    options: [
      'Use inline styles for everything',
      'Minimize reflows by batching DOM changes and using CSS transforms',
      'Use !important for all styles',
      'Load all CSS at the end of the document'
    ],
    correct_answer: 'Minimize reflows by batching DOM changes and using CSS transforms',
    expected_skills: ['Performance', 'Reflow optimization', 'CSS transforms'],
    difficulty_weight: 10,
  },
  // JavaScript - ADVANCED
  {
    skill_area: 'JavaScript',
    level: 'ADVANCED',
    type: 'code_reasoning',
    question: 'What is the output of: console.log(0.1 + 0.2 === 0.3)?',
    options: ['true', 'false', 'undefined', 'NaN'],
    correct_answer: 'false',
    expected_skills: ['Floating point arithmetic', 'JavaScript quirks', 'Number precision'],
    difficulty_weight: 9,
  },
];

async function seedQuestionBank() {
  console.log('🌱 Starting question bank seeding...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const question of sampleQuestions) {
    try {
      const questionId = uuidv4();
      await db.collection('question_bank').doc(questionId).set({
        question_id: questionId,
        ...question,
        verified: true, // Pre-verified sample questions
        added_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });

      console.log(`✓ Added: ${question.skill_area} - ${question.level} - ${question.type}`);
      successCount++;
    } catch (error) {
      console.error(`✗ Error adding question:`, error);
      errorCount++;
    }
  }

  console.log(`\n📊 Seeding complete!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Errors: ${errorCount}`);
  console.log(`   Total: ${sampleQuestions.length}\n`);

  // Show statistics
  const stats = await getStatistics();
  console.log('📈 Question Bank Statistics:');
  console.log(`   Total questions: ${stats.total}`);
  console.log(`   Verified: ${stats.verified}`);
  console.log(`\n   By Skill:`);
  Object.entries(stats.bySkill).forEach(([skill, count]) => {
    console.log(`     ${skill}: ${count}`);
  });
  console.log(`\n   By Level:`);
  Object.entries(stats.byLevel).forEach(([level, count]) => {
    console.log(`     ${level}: ${count}`);
  });

  process.exit(0);
}

async function getStatistics() {
  const snapshot = await db.collection('question_bank').get();
  const questions = snapshot.docs.map((doc) => doc.data());

  const stats = {
    total: questions.length,
    verified: questions.filter((q) => q.verified).length,
    bySkill: {} as Record<string, number>,
    byLevel: {} as Record<string, number>,
  };

  questions.forEach((q) => {
    stats.bySkill[q.skill_area] = (stats.bySkill[q.skill_area] || 0) + 1;
    stats.byLevel[q.level] = (stats.byLevel[q.level] || 0) + 1;
  });

  return stats;
}

// Run seeding
seedQuestionBank().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
