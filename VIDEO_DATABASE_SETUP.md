# Video Database Setup Guide

## Overview
Videos are now stored in Supabase database and fetched dynamically on the home page.

## Database Setup

### 1. Create the Videos Table

Run the SQL script in your Supabase SQL Editor:

```bash
# In Supabase Dashboard:
# 1. Go to SQL Editor
# 2. Copy contents from create-videos-table.sql
# 3. Click "Run"
```

Or use the file:
```
create-videos-table.sql
```

### 2. Table Structure

```sql
videos (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  video_type TEXT ('hero' | 'parallax'),
  position INTEGER,
  alt_text TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### 3. Default Videos Included

The SQL script automatically inserts:
- **1 Hero Video**: Main background video
- **4 Parallax Videos**: Scrolling section videos

## Features

### ✅ Dynamic Video Loading
- Videos fetched from Supabase on page load
- Automatic fallback if database is unavailable
- Cached for performance

### ✅ Video Types
1. **Hero Video** (`video_type = 'hero'`)
   - Main background video in hero section
   - Only one active at a time
   
2. **Parallax Videos** (`video_type = 'parallax'`)
   - Multiple videos in scrolling section
   - Ordered by `position` field

### ✅ Admin Features
- Add new videos
- Update existing videos
- Toggle active/inactive status
- Delete videos
- Reorder parallax videos

## API Service

### Location
```
client/src/services/videoService.ts
```

### Available Functions

```typescript
// Fetch hero video
const heroVideo = await getHeroVideo();

// Fetch all parallax videos
const parallaxVideos = await getParallaxVideos();

// Fetch all videos
const allVideos = await getAllVideos();

// Add new video (admin)
await addVideo({
  title: 'New Video',
  video_url: '/path/to/video.mp4',
  video_type: 'parallax',
  position: 5,
  alt_text: 'Description',
  is_active: true
});

// Update video (admin)
await updateVideo(videoId, { title: 'Updated Title' });

// Delete video (admin)
await deleteVideo(videoId);

// Toggle active status (admin)
await toggleVideoStatus(videoId, false);
```

## Usage in Components

### Home Page Implementation

```typescript
import { getHeroVideo, getParallaxVideos } from '../services/videoService';

const Home = () => {
  const [heroVideo, setHeroVideo] = useState(null);
  const [parallaxVideos, setParallaxVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const hero = await getHeroVideo();
      const parallax = await getParallaxVideos();
      
      setHeroVideo(hero);
      setParallaxVideos(parallax);
    };

    fetchVideos();
  }, []);

  return (
    <div>
      <HeroSection video={heroVideo} />
      <ParallaxSection videos={parallaxVideos} />
    </div>
  );
};
```

## Adding New Videos

### Method 1: SQL Insert

```sql
INSERT INTO public.videos (
  title, 
  description, 
  video_url, 
  video_type, 
  position, 
  alt_text
) VALUES (
  'My New Video',
  'Description of the video',
  '/assets/videos/my-video.mp4',
  'parallax',
  5,
  'Alt text for accessibility'
);
```

### Method 2: Using the Service (in code)

```typescript
import { addVideo } from '../services/videoService';

await addVideo({
  title: 'My New Video',
  description: 'Description',
  video_url: '/assets/videos/my-video.mp4',
  video_type: 'parallax',
  position: 5,
  alt_text: 'Alt text',
  is_active: true
});
```

## Video URL Options

### 1. Local Videos
```
/assets/videos/my-video.mp4
```
Place videos in: `client/public/assets/videos/`

### 2. External CDN
```
https://cdn.pixabay.com/video/2023/08/08/175206-853155969_tiny.mp4
```

### 3. Supabase Storage
```
https://your-project.supabase.co/storage/v1/object/public/videos/my-video.mp4
```

## Security

### Row Level Security (RLS)
- ✅ Public can READ active videos
- ✅ Only authenticated users can WRITE
- ✅ Automatic timestamp updates

### Policies Created
1. `Allow public read access to videos` - Anyone can view active videos
2. `Allow authenticated users to manage videos` - Admins can manage

## Performance

### Optimizations
- Videos fetched once on page load
- Indexed by `video_type` and `is_active`
- Indexed by `position` for ordering
- Lazy loading for parallax videos

### Caching
Videos are stored in component state and don't refetch on re-renders.

## Fallback Behavior

If database fetch fails:
- **Hero Video**: Uses default `/assets/images/206779_small.mp4`
- **Parallax Videos**: Section hidden if no videos available

## Testing

### 1. Check Database
```sql
SELECT * FROM public.videos WHERE is_active = true;
```

### 2. Test API
```typescript
import { getAllVideos } from '../services/videoService';

const videos = await getAllVideos();
console.log('Videos:', videos);
```

### 3. Verify on Page
- Open home page
- Check browser console for any errors
- Videos should load and play automatically

## Troubleshooting

### Videos Not Loading?

1. **Check Supabase Connection**
   ```typescript
   import { supabase } from '../config/supabase';
   console.log('Supabase:', supabase);
   ```

2. **Check RLS Policies**
   - Ensure public read policy exists
   - Check if videos are marked `is_active = true`

3. **Check Video URLs**
   - Verify URLs are accessible
   - Check browser console for 404 errors

4. **Check Database**
   ```sql
   SELECT * FROM public.videos;
   ```

### Videos Not Playing?

1. **Check Video Format**
   - Use MP4 format
   - H.264 codec recommended

2. **Check Autoplay**
   - Videos must be muted for autoplay
   - Add `playsInline` for mobile

3. **Check File Size**
   - Large videos may load slowly
   - Use compressed versions

## Future Enhancements

### Planned Features
- [ ] Admin UI for video management
- [ ] Video upload to Supabase Storage
- [ ] Video thumbnails/posters
- [ ] Multiple video formats (WebM, OGG)
- [ ] Video analytics (views, plays)
- [ ] A/B testing different videos
- [ ] Video scheduling (start/end dates)

## Files Created

1. `create-videos-table.sql` - Database schema
2. `client/src/services/videoService.ts` - API service
3. `client/src/pages/Home.tsx` - Updated to use database
4. `VIDEO_DATABASE_SETUP.md` - This guide

## Summary

✅ Videos stored in Supabase database
✅ Dynamic loading on page load
✅ Fallback for failed fetches
✅ Admin functions for management
✅ RLS security enabled
✅ Performance optimized
✅ Easy to add/update videos

---

**Status**: ✅ Complete and ready to use
**Database**: Supabase
**Table**: `public.videos`
