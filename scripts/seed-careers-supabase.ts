import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const oglCareers = [
  {
    name: 'OGL Developer',
    description: 'Full-stack developer role covering frontend and backend development',
    experience_level: 'Mid-Level',
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
    name: 'OGL Tester',
    description: 'Manual and automated testing specialist',
    experience_level: 'Entry-Level',
    skills: [
      { name: 'Testing Tools', required: true },
      { name: 'JavaScript', required: true },
      { name: 'TypeScript', required: false },
      { name: 'HTML', required: true },
      { name: 'CSS', required: true },
    ],
  },
  {
    name: 'OGL Frontend Developer',
    description: 'Specialized in building user interfaces and client-side applications',
    experience_level: 'Mid-Level',
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
    name: 'OGL Backend Developer',
    description: 'Server-side development and API design specialist',
    experience_level: 'Mid-Level',
    skills: [
      { name: 'JavaScript', required: true },
      { name: 'TypeScript', required: true },
      { name: 'Python', required: true },
      { name: 'Java', required: true },
      { name: 'Node.js', required: true },
    ],
  },
  {
    name: 'OGL DevOps Developer',
    description: 'Infrastructure automation and deployment specialist',
    experience_level: 'Senior',
    skills: [
      { name: 'Cloud Platforms', required: true },
      { name: 'Docker', required: true },
      { name: 'Kubernetes', required: true },
      { name: 'CI/CD', required: true },
      { name: 'Python', required: true },
    ],
  },
  {
    name: 'OGL Cloud Developer',
    description: 'Cloud-native application development specialist',
    experience_level: 'Senior',
    skills: [
      { name: 'Cloud Platforms', required: true },
      { name: 'JavaScript', required: true },
      { name: 'Python', required: true },
      { name: 'Serverless', required: true },
      { name: 'Microservices', required: true },
    ],
  },
  {
    name: 'OGL QA Developer',
    description: 'Quality assurance and test automation engineer',
    experience_level: 'Entry-Level',
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
    name: 'OGL Content Developer',
    description: 'Web content development and basic frontend implementation',
    experience_level: 'Fresher',
    skills: [
      { name: 'HTML', required: true },
      { name: 'CSS', required: true },
      { name: 'JavaScript', required: true },
      { name: 'jQuery', required: true },
      { name: 'OGL Knowledge', required: true },
    ],
  },
];

async function seedCareersToSupabase() {
  console.log('🌱 Starting Supabase career seeding...\n');

  try {
    // Check if careers already exist
    const { data: existingCareers, error: checkError } = await supabase
      .from('careers')
      .select('id');

    if (checkError) {
      console.error('❌ Error checking existing careers:', checkError);
      throw checkError;
    }

    if (existingCareers && existingCareers.length > 0) {
      console.log(`⚠️  Found ${existingCareers.length} existing careers`);
      console.log('   Deleting existing careers...');
      
      const { error: deleteError } = await supabase
        .from('careers')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (deleteError) {
        console.error('❌ Error deleting careers:', deleteError);
      } else {
        console.log('✅ Deleted existing careers\n');
      }
    }

    // Insert new careers
    const { data, error } = await supabase
      .from('careers')
      .insert(oglCareers)
      .select();

    if (error) {
      console.error('❌ Error inserting careers:', error);
      throw error;
    }

    console.log('✨ Career seeding completed successfully!\n');
    console.log(`📊 Total careers added: ${data?.length || oglCareers.length}\n`);
    
    data?.forEach((career: any) => {
      console.log(`✅ ${career.name} (${career.experience_level})`);
      console.log(`   Skills: ${career.skills.map((s: any) => s.name).join(', ')}`);
    });

    console.log('\n🎉 All done! Your careers are ready in Supabase.');
  } catch (error) {
    console.error('❌ Error seeding careers:', error);
    throw error;
  }
}

seedCareersToSupabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
