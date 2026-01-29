import admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
});

const db = admin.firestore();

const careers = [
  {
    id: 'ogl-content-developer',
    name: 'OGL Content Developer',
    description: 'Freshers are hiring - Entry-level position for web content development',
    experienceLevel: 'Fresher',
    skills: [
      { name: 'HTML', level: 'Required', minLevel: 'BASIC' },
      { name: 'CSS', level: 'Required', minLevel: 'BASIC' },
      { name: 'JavaScript', level: 'Required', minLevel: 'BASIC' },
      { name: 'jQuery', level: 'Preferred', minLevel: 'BASIC' },
      { name: 'OGL Knowledge', level: 'Required', minLevel: 'BASIC' },
    ],
  },
  {
    id: 'ogl-sde',
    name: 'OGL Software Development Engineer',
    description: 'Mostly experienced - Full-stack development position',
    experienceLevel: 'Experienced',
    skills: [
      { name: 'HTML', level: 'Required', minLevel: 'INTERMEDIATE' },
      { name: 'CSS', level: 'Required', minLevel: 'INTERMEDIATE' },
      { name: 'JavaScript', level: 'Required', minLevel: 'ADVANCED' },
      { name: 'Java', level: 'Required', minLevel: 'INTERMEDIATE' },
      { name: 'Python', level: 'Required', minLevel: 'INTERMEDIATE' },
      { name: 'React', level: 'Required', minLevel: 'INTERMEDIATE' },
    ],
  },
  {
    id: 'ogl-qa',
    name: 'OGL QA Engineer',
    description: 'Freshers are hardly hired - Quality Assurance and Testing position',
    experienceLevel: 'Fresher/Entry',
    skills: [
      { name: 'TypeScript', level: 'Required', minLevel: 'BASIC' },
      { name: 'Testing Tools', level: 'Required', minLevel: 'INTERMEDIATE' },
      { name: 'Java', level: 'Preferred', minLevel: 'BASIC' },
      { name: 'HTML', level: 'Required', minLevel: 'BASIC' },
      { name: 'CSS', level: 'Required', minLevel: 'BASIC' },
    ],
  },
];

async function seedCareers() {
  console.log('🌱 Starting career seeding...');

  try {
    const batch = db.batch();

    for (const career of careers) {
      const { id, ...careerData } = career;
      const careerRef = db.collection('careers').doc(id);
      
      batch.set(careerRef, {
        ...careerData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      console.log(`✅ Added career: ${career.name}`);
    }

    await batch.commit();
    console.log('✨ Career seeding completed successfully!');
    console.log(`📊 Total careers added: ${careers.length}`);
  } catch (error) {
    console.error('❌ Error seeding careers:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

seedCareers();
