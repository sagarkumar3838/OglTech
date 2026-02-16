# Homepage Media & Animation Guide

## Where Everything is Located

### 1. Hero Video/Image (Top Section)
**File:** `client/src/components/SmoothScrollHero.tsx`
**Lines:** 79-130 (CenterImage component)

**What it does:**
- Shows a large video or image at the top of the homepage
- Fetches from database using `getHeroMedia()` from `mediaService.ts`
- Falls back to `/assets/images/206779_small.mp4` if no database entry

**How to change:**
```typescript
// Line 115: Default fallback video
const mediaUrl = heroMedia?.media_url || '/assets/images/206779_small.mp4';

// To change the hero video/image:
// Option 1: Add to database with usage_type = 'hero'
// Option 2: Change the fallback path above
```

**Database Control:**
- Table: `media`
- Filter: `usage_type = 'hero'` and `media_type = 'video' or 'image'`
- Position: 1 (first entry)

---

### 2. Parallax Images (Scrolling Images)
**File:** `client/src/components/SmoothScrollHero.tsx`
**Lines:** 200-260 (ParallaxImages component)

**What it does:**
- Shows 4 images that scroll at different speeds (parallax effect)
- Fetches from database using `getParallaxMedia()` from `mediaService.ts`
- Falls back to local images if no database entries

**Fallback Images (Lines 227-232):**
```typescript
const fallbackImages = [
  { src: "/assets/images/business-7836199.jpg", alt: "Business team collaboration" },
  { src: "/assets/images/man-597178.jpg", alt: "Professional developer" },
  { src: "/assets/images/pexels-cottonbro-4880411.jpg", alt: "Technical assessment" },
  { src: "/assets/images/student-7378904.jpg", alt: "Student learning" },
];
```

**Text Overlays on Images (Lines 212-225):**
```typescript
const careerMessages = [
  {
    title: "Transform your profile into a Professional Brand",
    subtitle: "Join 1,000+ professionals who have built a personal brand",
    gradient: "from-indigo-600 to-purple-600"
  },
  // ... 3 more messages
];
```

**Database Control:**
- Table: `media`
- Filter: `usage_type = 'parallax'` and `media_type = 'image'`
- Position: 1, 2, 3, 4 (order matters)

---

### 3. Hero Text & Animations
**File:** `client/src/components/SmoothScrollHero.tsx`
**Lines:** 135-195 (Hero Content Overlay)

**Main Headline (Lines 141-165):**
```typescript
<DecryptedText
  text="Anyone can learn skills"
  animateOn="view"
  speed={80}
  sequential={true}
/>
```

**Subtitle (Lines 167-177):**
```typescript
<DecryptedText
  text="Build skills. Prove them. Brand yourself."
  animateOn="view"
  speed={80}
/>
```

**Buttons (Lines 179-195):**
- "Explore Careers" button → Links to `/careers`
- "Test your Skills" button → Links to `/login`

**Trust Badges (Lines 197-213):**
- Secure & Private
- 1000+ Assessments
- 15 Min Tests

---

### 4. Features Section
**File:** `client/src/pages/Home.tsx`
**Lines:** 40-110 (FeaturesSection component)

**Features Array (Lines 42-49):**
```typescript
const features = [
  { icon: Brain, title: "AI-Powered Assessments", desc: "...", color: "from-indigo-500 to-purple-500" },
  { icon: BarChart3, title: "Detailed Analytics", desc: "...", color: "from-purple-500 to-pink-500" },
  // ... 4 more features
];
```

**Tech Icons Showcase (Line 52):**
```typescript
const techShowcase = ['html', 'css', 'javascript', 'typescript', 'react', 'python', 'java', 'nodejs', 'docker', 'aws', 'kubernetes', 'mongodb'];
```

---

### 5. How It Works Section
**File:** `client/src/pages/Home.tsx`
**Lines:** 113-150 (HowItWorksSection component)

**Steps (Lines 127-131):**
```typescript
{ num: 1, title: "Choose a Career Path", desc: "...", color: "from-indigo-500 to-purple-600" },
{ num: 2, title: "Take the Assessment", desc: "...", color: "from-purple-500 to-pink-600" },
{ num: 3, title: "Get Detailed Results", desc: "...", color: "from-pink-500 to-red-600" },
```

---

### 6. Stats Section
**File:** `client/src/pages/Home.tsx`
**Lines:** 153-182 (StatsSection component)

**Stats Array (Lines 160-165):**
```typescript
{ value: 5000, suffix: "+", label: "Questions" },
{ value: 10, suffix: "+", label: "Skills Covered" },
{ value: 1000, suffix: "+", label: "Assessments" },
{ value: 95, suffix: "%", label: "Accuracy" },
```

---

### 7. Testimonials Section
**File:** `client/src/pages/Home.tsx`
**Lines:** 185-220 (TestimonialsSection component)

**Benefits Array (Lines 197-201):**
```typescript
{ benefit: "Save 80% of screening time", desc: "..." },
{ benefit: "Eliminate bias", desc: "..." },
{ benefit: "Better hiring decisions", desc: "..." },
```

---

## Animation Libraries Used

### 1. Framer Motion
**File:** All animation components
**What it does:** Smooth animations, scroll effects, parallax

**Key animations:**
- `motion.div` - Animated divs
- `useScroll` - Scroll-based animations
- `useTransform` - Transform values based on scroll
- `initial/animate/whileInView` - Animation states

### 2. Lenis (Smooth Scroll)
**File:** `client/src/components/SmoothScrollHero.tsx`
**Line:** 44-49
**What it does:** Smooth scrolling effect

```typescript
<ReactLenis
  root
  options={{
    lerp: 0.05,  // Smoothness (lower = smoother)
  }}
>
```

### 3. DecryptedText
**File:** `client/src/components/DecryptedText.tsx`
**What it does:** Text decryption animation effect

**Usage:**
```typescript
<DecryptedText
  text="Your text here"
  animateOn="view"
  speed={80}
  sequential={true}
/>
```

---

## How to Change Media

### Option 1: Change in Database (Recommended)
1. Add images to `client/dist/assets/images/`
2. Run SQL to insert into `media` table:
   - For hero: `usage_type = 'hero'`, `position = 1`
   - For parallax: `usage_type = 'parallax'`, `position = 1-4`
3. Refresh app - changes appear automatically

### Option 2: Change Fallback Images
Edit `client/src/components/SmoothScrollHero.tsx`:

**Hero video (Line 115):**
```typescript
const mediaUrl = heroMedia?.media_url || '/assets/images/YOUR_VIDEO.mp4';
```

**Parallax images (Lines 227-232):**
```typescript
const fallbackImages = [
  { src: "/assets/images/YOUR_IMAGE1.jpg", alt: "Description" },
  { src: "/assets/images/YOUR_IMAGE2.jpg", alt: "Description" },
  { src: "/assets/images/YOUR_IMAGE3.jpg", alt: "Description" },
  { src: "/assets/images/YOUR_IMAGE4.jpg", alt: "Description" },
];
```

---

## Media Service
**File:** `client/src/services/mediaService.ts`

**Functions:**
- `getHeroMedia()` - Fetches hero video/image
- `getParallaxMedia()` - Fetches parallax images
- `getAllMedia()` - Fetches all media
- `addMedia()` - Adds new media (admin)
- `updateMedia()` - Updates media (admin)
- `deleteMedia()` - Deletes media (admin)

---

## Quick Reference

| What | File | Line | How to Change |
|------|------|------|---------------|
| Hero Video | SmoothScrollHero.tsx | 115 | Database or fallback path |
| Parallax Images | SmoothScrollHero.tsx | 227-232 | Database or fallback array |
| Hero Text | SmoothScrollHero.tsx | 141-177 | Edit DecryptedText components |
| Image Overlays | SmoothScrollHero.tsx | 212-225 | Edit careerMessages array |
| Features | Home.tsx | 42-49 | Edit features array |
| Stats | Home.tsx | 160-165 | Edit stats array |
| Steps | Home.tsx | 127-131 | Edit steps array |

---

## File Locations Summary

```
client/
├── src/
│   ├── pages/
│   │   └── Home.tsx                    # Main homepage structure
│   ├── components/
│   │   ├── SmoothScrollHero.tsx        # Hero video + parallax images
│   │   ├── DecryptedText.tsx           # Text animation
│   │   ├── Footer.tsx                  # Footer
│   │   ├── ContactSection.tsx          # Contact form
│   │   ├── FaqSection.tsx              # FAQ
│   │   └── PricingSection.tsx          # Pricing
│   └── services/
│       └── mediaService.ts             # Database media fetching
└── dist/
    └── assets/
        └── images/                     # All images and videos
```

---

## Need Help?

- To add new images: Use `add-img1-img2-only.sql`
- To remove duplicates: Use `find-and-remove-duplicate-images.sql`
- To verify images: Use `verify-images-in-database.sql`
- Full guide: See `IMAGE_STORAGE_GUIDE.md`
