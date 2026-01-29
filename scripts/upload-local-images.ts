import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface MediaData {
  title: string;
  description: string;
  media_url: string;
  media_type: 'image' | 'video';
  usage_type: 'hero' | 'parallax';
  position: number;
  alt_text: string;
  is_active: boolean;
}

const localImages: MediaData[] = [
  {
    title: 'Business Team Collaboration',
    description: 'Professional team working together on business projects',
    media_url: '/assets/images/business-7836199.jpg',
    media_type: 'image',
    usage_type: 'parallax',
    position: 1,
    alt_text: 'Business team collaboration and planning',
    is_active: true,
  },
  {
    title: 'Professional Developer at Work',
    description: 'Developer working on technical projects',
    media_url: '/assets/images/man-597178.jpg',
    media_type: 'image',
    usage_type: 'parallax',
    position: 2,
    alt_text: 'Professional developer coding',
    is_active: true,
  },
  {
    title: 'Technical Assessment Session',
    description: 'Professional taking technical skill assessment',
    media_url: '/assets/images/pexels-cottonbro-4880411.jpg',
    media_type: 'image',
    usage_type: 'parallax',
    position: 3,
    alt_text: 'Technical assessment and evaluation',
    is_active: true,
  },
  {
    title: 'Student Learning and Development',
    description: 'Students engaged in learning and skill development',
    media_url: '/assets/images/student-7378904.jpg',
    media_type: 'image',
    usage_type: 'parallax',
    position: 4,
    alt_text: 'Student learning and skill development',
    is_active: true,
  },
];

async function uploadImages() {
  console.log('🖼️  Starting image upload to database...\n');

  try {
    // Check if media table exists
    const { data: existingMedia, error: checkError } = await supabase
      .from('media')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('❌ Error checking media table:', checkError.message);
      console.log('\n💡 Make sure you have run create-media-table.sql first!');
      process.exit(1);
    }

    // Insert images
    let successCount = 0;
    let errorCount = 0;

    for (const image of localImages) {
      console.log(`🖼️  Adding: ${image.title}`);
      console.log(`   Type: ${image.media_type} | Usage: ${image.usage_type} | Position: ${image.position}`);
      console.log(`   URL: ${image.media_url}`);

      const { data, error } = await supabase
        .from('media')
        .insert([image])
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
    console.log(`✅ Successfully added: ${successCount} images`);
    if (errorCount > 0) {
      console.log(`❌ Failed to add: ${errorCount} images`);
    }
    console.log('═══════════════════════════════════════\n');

    // Verify and display all media
    console.log('📋 Current media in database:\n');
    const { data: allMedia, error: fetchError } = await supabase
      .from('media')
      .select('*')
      .order('usage_type', { ascending: true })
      .order('position', { ascending: true });

    if (fetchError) {
      console.error('❌ Error fetching media:', fetchError.message);
    } else if (allMedia) {
      console.log('HERO MEDIA:');
      allMedia
        .filter((m) => m.usage_type === 'hero')
        .forEach((m) => {
          console.log(`  • ${m.title} (${m.media_type})`);
          console.log(`    URL: ${m.media_url}`);
          console.log(`    Active: ${m.is_active ? '✅' : '❌'}\n`);
        });

      console.log('PARALLAX MEDIA:');
      allMedia
        .filter((m) => m.usage_type === 'parallax')
        .forEach((m) => {
          console.log(`  ${m.position}. ${m.title} (${m.media_type})`);
          console.log(`     URL: ${m.media_url}`);
          console.log(`     Active: ${m.is_active ? '✅' : '❌'}\n`);
        });

      console.log(`Total media items: ${allMedia.length}`);
      console.log(`Images: ${allMedia.filter(m => m.media_type === 'image').length}`);
      console.log(`Videos: ${allMedia.filter(m => m.media_type === 'video').length}`);
    }

    console.log('\n✨ Image upload complete!');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Run the upload
uploadImages();
