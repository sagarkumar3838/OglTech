import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface VideoData {
  title: string;
  description: string;
  video_url: string;
  video_type: 'hero' | 'parallax';
  position: number;
  alt_text: string;
  is_active: boolean;
}

const localVideos: VideoData[] = [
  {
    title: 'Main Hero Background - Students Learning',
    description: 'Primary hero section background video showing students and team collaboration',
    video_url: '/assets/images/206779_small.mp4',
    video_type: 'hero',
    position: 1,
    alt_text: 'Students collaborating and learning together',
    is_active: true,
  },
  {
    title: 'Coding and Development Scene',
    description: 'Parallax video showing coding and software development',
    video_url: '/assets/images/13232-246463976_small.mp4',
    video_type: 'parallax',
    position: 1,
    alt_text: 'Developer coding and programming',
    is_active: true,
  },
  {
    title: 'Team Collaboration and Learning',
    description: 'Parallax video showing team collaboration and skill development',
    video_url: '/assets/images/206779_small.mp4',
    video_type: 'parallax',
    position: 2,
    alt_text: 'Team working together on technical projects',
    is_active: true,
  },
  {
    title: 'Technical Assessment',
    description: 'Parallax video showing technical skill assessment',
    video_url: 'https://cdn.pixabay.com/video/2023/04/28/160827-822725703_tiny.mp4',
    video_type: 'parallax',
    position: 3,
    alt_text: 'Developer taking technical assessment',
    is_active: true,
  },
  {
    title: 'Developer Workspace',
    description: 'Parallax video showing professional developer workspace',
    video_url: 'https://cdn.pixabay.com/video/2022/12/05/142408-779071817_tiny.mp4',
    video_type: 'parallax',
    position: 4,
    alt_text: 'Professional coding environment and workspace',
    is_active: true,
  },
];

async function uploadVideos() {
  console.log('🎬 Starting video upload to database...\n');

  try {
    // Check if videos table exists
    const { data: existingVideos, error: checkError } = await supabase
      .from('videos')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('❌ Error checking videos table:', checkError.message);
      console.log('\n💡 Make sure you have run create-videos-table.sql first!');
      process.exit(1);
    }

    // Optional: Clear existing videos
    // Uncomment the following lines if you want to start fresh
    /*
    console.log('🗑️  Clearing existing videos...');
    const { error: deleteError } = await supabase
      .from('videos')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('❌ Error clearing videos:', deleteError.message);
    } else {
      console.log('✅ Existing videos cleared\n');
    }
    */

    // Insert videos
    let successCount = 0;
    let errorCount = 0;

    for (const video of localVideos) {
      console.log(`📹 Adding: ${video.title}`);
      console.log(`   Type: ${video.video_type} | Position: ${video.position}`);
      console.log(`   URL: ${video.video_url}`);

      const { data, error } = await supabase
        .from('videos')
        .insert([video])
        .select();

      if (error) {
        console.error(`   ❌ Error: ${error.message}\n`);
        errorCount++;
      } else {
        console.log(`   ✅ Added successfully\n`);
        successCount++;
      }
    }

    // Summary
    console.log('═══════════════════════════════════════');
    console.log(`✅ Successfully added: ${successCount} videos`);
    if (errorCount > 0) {
      console.log(`❌ Failed to add: ${errorCount} videos`);
    }
    console.log('═══════════════════════════════════════\n');

    // Verify and display all videos
    console.log('📋 Current videos in database:\n');
    const { data: allVideos, error: fetchError } = await supabase
      .from('videos')
      .select('*')
      .order('video_type', { ascending: true })
      .order('position', { ascending: true });

    if (fetchError) {
      console.error('❌ Error fetching videos:', fetchError.message);
    } else if (allVideos) {
      console.log('HERO VIDEOS:');
      allVideos
        .filter((v) => v.video_type === 'hero')
        .forEach((v) => {
          console.log(`  • ${v.title}`);
          console.log(`    URL: ${v.video_url}`);
          console.log(`    Active: ${v.is_active ? '✅' : '❌'}\n`);
        });

      console.log('PARALLAX VIDEOS:');
      allVideos
        .filter((v) => v.video_type === 'parallax')
        .forEach((v) => {
          console.log(`  ${v.position}. ${v.title}`);
          console.log(`     URL: ${v.video_url}`);
          console.log(`     Active: ${v.is_active ? '✅' : '❌'}\n`);
        });

      console.log(`Total videos: ${allVideos.length}`);
    }

    console.log('\n✨ Video upload complete!');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Run the upload
uploadVideos();
