import admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
});

const db = admin.firestore();

const oglCareers = [
  {
    id: 'ogl-developer',
    name: 'OGL Developer',
    description: 'Full-stack developer role covering frontend and backend development',
    experienceLevel: 'Mid-Level',
    skills: [
      { name: 'HTML', required: true },
      { name: 'CSS', required: true },
      { name: 'JavaScript', required: true },
      { name: 'TypeScript', required: false },
      { name: 'React', required: true },
      { name: 'Node.js', required: true },
    ],
  },
  {
    id: 'ogl-tester',
    name: 'OGL Tester',
    description: 'Manual and automated testing specialist',
    experienceLevel: 'Entry-Level',
    skills: [
      { name: 'Testing Tools', required: true },
      { name: 'JavaScript', required: true },
      { name: 'TypeScript', required: false },
      { name: 'HTML', required: true },
      { name: 'CSS', required: true },
    ],
  },
  {
    id: 'ogl-frontend-developer',
    name: 'OGL Frontend Developer',
    description: 'Specialized in building user interfaces and client-side applications',
    experienceLevel: 'Mid-Level',
    skills: [
      { name: 'HTML', required: true },
      { name: 'CSS', required: true },
      { name: 'JavaScript', required: true },
      { name: 'TypeScript', required: true },
      { name: 'React', required: true },
      { name: 'jQuery', required: false },
    ],
  },
  {
    id: 'ogl-backend-developer',
    name: 'OGL Backend Developer',
    description: 'Server-side development and API design specialist',
    experienceLevel: 'Mid-Level',
    skills: [
      { name: 'JavaScript', required: true },
      { name: 'TypeScript', required: true },
      { name: 'Python', required: true },
      { name: 'Java', required: true },
      { name: 'Node.js', required: true },
    ],
  },
  {
    id: 'ogl-devops-developer',
    name: 'OGL DevOps Developer',
    description: 'Infrastructure automation and deployment specialist',
    experienceLevel: 'Senior',
    skills: [
      { name: 'Cloud Platforms', required: true },
      { name: 'Docker', required: true },
      { name: 'Kubernetes', required: true },
      { name: 'CI/CD', required: true },
      { name: 'Python', required: true },
    ],
  },
  {
    id: 'ogl-cloud-developer',
    name: 'OGL Cloud Developer',
    description: 'Cloud-native application development specialist',
    experienceLevel: 'Senior',
    skills: [
      { name: 'Cloud Platforms', required: true },
      { name: 'JavaScript', required: true },
      { name: 'Python', required: true },
      { name: 'Serverless', required: true },
      { name: 'Microservices', required: true },
    ],
  },
  {
    id: 'ogl-qa-developer',
    name: 'OGL QA Developer',
    description: 'Quality assurance and test automation engineer',
    experienceLevel: 'Entry-Level',
    skills: [
      { name: 'Testing Tools', required: true },
      { name: 'TypeScript', required: true },
      { name: 'JavaScript', required: true },
      { name: 'Java', required: false },
      { name: 'HTML', required: true },
      { name: 'CSS', required: true },
    ],
  },
  {
    id: 'ogl-content-developer',
    name: 'OGL Content Developer',
    description: 'Web content development and basic frontend implementation',
    experienceLevel: 'Fresher',
    skills: [
      { name: 'HTML', required: true },
      { name: 'CSS', required: true },
      { name: 'JavaScript', required: true },
      { name: 'jQuery', required: true },
      { name: 'OGL Knowledge', required: true },
    ],
  },
];

async function seedOGLCareers() {
  console.log('🌱 Starting OGL career seeding...');

  try {
    const batch = db.batch();

    for (const career of oglCareers) {
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
    console.log('✨ OGL career seeding completed successfully!');
    console.log(`📊 Total careers added: ${oglCareers.length}`);
  } catch (error) {
    console.error('❌ Error seeding careers:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

seedOGLCareers();
