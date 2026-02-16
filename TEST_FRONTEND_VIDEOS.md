# Test Video Links in Frontend

## Step 1: Verify Data in Database
Run `TEST_VIDEO_LINKS_QUICK.sql` in Supabase SQL Editor to confirm video links exist.

## Step 2: Test in Your App

### Quick Test:
1. Open your app: `npm run dev` (in client folder)
2. Go to Practice page
3. Select any skill (JavaScript, Python, HTML, CSS, etc.)
4. Select any level (Beginner/Intermediate/Advanced)
5. Answer all questions
6. Click "Submit Test"
7. Scroll down to see your results

### What You Should See:
After submitting, for each question you'll see:

```
📚 Learn More:
[📖 Documentation] [🎥 Video (EN)] [🎥 हिंदी] [🎥 ಕನ್ನಡ] [🎥 தமிழ்] [🎥 తెలుగు]
```

The links will ONLY show if that question has video/documentation data.

## Step 3: Check Browser Console
Open browser DevTools (F12) and check:
- Network tab: Look for the Supabase query to `questions` table
- Console tab: Check if questions have the video fields

## Step 4: Inspect Question Data
In browser console, after questions load, type:
```javascript
// This will show you the question data structure
console.log(questions[0]);
```

Look for these fields:
- `mdn_link`
- `youtube_english`
- `youtube_hindi`
- `youtube_kannada`
- `youtube_tamil`
- `youtube_telugu`

## Troubleshooting:

### If videos don't show:
1. Check if the SQL was run successfully (you showed it was ✓)
2. Refresh your browser (Ctrl+F5 to clear cache)
3. Check if the question you're testing actually HAS video links in the database
4. Verify the Practice.tsx code is checking for these fields (it already does - I saw it in the code)

### The code already handles it:
The Practice page already has this code (lines 700-750):
```tsx
{(q.mdn_link || q.youtube_english) && (
  <div className="bg-purple-50 ...">
    <strong>📚 Learn More:</strong>
    {q.mdn_link && <a href={q.mdn_link}>📖 Documentation</a>}
    {q.youtube_english && <a href={q.youtube_english}>🎥 Video (EN)</a>}
    {q.youtube_hindi && <a href={q.youtube_hindi}>🎥 हिंदी</a>}
    ...
  </div>
)}
```

So it should work automatically once the data is in the database!
