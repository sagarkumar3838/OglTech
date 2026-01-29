import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import * as dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

interface Skill {
  name: string;
  required: boolean;
}

interface Career {
  id: string;
  name: string;
  description: string;
  experienceLevel: string;
  skills: Skill[];
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const oglCareers: Career[] = [
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

async function seedOGLCareers(): Promise<void> {
  console.log('🌱 Starting OGL career seeding...');

  try {
    for (const career of oglCareers) {
      const { id, ...careerData } = career;
      const careerRef = doc(db, 'careers', id);
      
      await setDoc(careerRef, {
        ...careerData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      console.log(`✅ Added career: ${career.name}`);
    }

    console.log('✨ OGL career seeding completed successfully!');
    console.log(`📊 Total careers added: ${oglCareers.length}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding careers:', error);
    process.exit(1);
  }
}

seedOGLCareers();
