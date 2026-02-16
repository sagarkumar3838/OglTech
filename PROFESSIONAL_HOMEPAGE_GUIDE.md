# Professional Homepage - Implementation Guide

## Overview

A modern, professional edutech homepage inspired by Anyflow Labs with:
- Three.js animated particle background
- GSAP scroll-triggered animations
- Smooth parallax effects
- Professional gradient design
- No background video (replaced with 3D particles)

## Features

### 1. Three.js Background
- Animated particle system (1500 particles)
- Connecting lines between particles
- Smooth rotation and movement
- Responsive and performant

### 2. GSAP Animations
- Hero section fade-in animations
- Scroll-triggered section reveals
- Staggered feature card animations
- Smooth easing functions

### 3. Mouse Parallax
- Hero content follows mouse movement
- Subtle spring animation
- Enhances interactivity

### 4. Design Elements
- Dark theme with gradient accents
- Glass morphism effects
- Hover animations on cards
- Floating stats section
- Scroll indicator

## Installation

Packages installed:
```bash
npm install gsap @barba/core three @types/three
```

## File Structure

```
client/src/pages/
├── Home.tsx                    # Original homepage
├── HomeProfessional.tsx        # New professional homepage
```

## Usage

### Option 1: Replace Current Homepage

In `client/src/App.tsx`, update the import:

```tsx
// Change from:
import Home from './pages/Home';

// To:
import Home from './pages/HomeProfessional';
```

### Option 2: Add as New Route

In `client/src/App.tsx`, add a new route:

```tsx
import HomeProfessional from './pages/HomeProfessional';

// In routes:
<Route path="/home-pro" element={<HomeProfessional />} />
```

## Customization

### Colors

Update gradient colors in the component:
```tsx
// Hero title gradient
bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400

// Feature card gradients
from-indigo-500 to-purple-500
from-purple-500 to-pink-500
// etc.
```

### Particle System

Adjust particle count and appearance:
```tsx
const particlesCount = 1500; // Increase/decrease particles
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.015,        // Particle size
  color: '#6366f1',   // Particle color
  opacity: 0.8        // Transparency
});
```

### Animation Speed

Modify GSAP animation durations:
```tsx
gsap.from('.hero-title', {
  y: 100,
  opacity: 0,
  duration: 1.2,  // Adjust speed
  ease: 'power4.out'
});
```

## Performance

- Three.js renderer uses `setPixelRatio(Math.min(window.devicePixelRatio, 2))` for optimal performance
- Particle count optimized for smooth 60fps
- GSAP animations use hardware-accelerated transforms
- Scroll triggers properly cleaned up on unmount

## Browser Support

- Modern browsers with WebGL support
- Fallback: Background will be transparent if WebGL unavailable
- Mobile optimized with responsive design

## Sections

1. **Hero Section**
   - Large animated title
   - Subtitle with description
   - CTA buttons
   - Floating stats
   - Scroll indicator

2. **Features Grid**
   - 6 feature cards
   - Icon animations
   - Hover effects
   - Gradient backgrounds

3. **How It Works**
   - 3-step process
   - Numbered icons
   - Scroll animations

4. **CTA Section**
   - Gradient background
   - Call-to-action button
   - Grid pattern overlay

5. **Footer**
   - Reuses existing Footer component

## Next Steps

1. Test the new homepage
2. Adjust colors to match your brand
3. Add more sections if needed
4. Optimize images and assets
5. Test on mobile devices

## Barba.js Integration (Optional)

For page transitions, you can add Barba.js:

```tsx
import barba from '@barba/core';

useEffect(() => {
  barba.init({
    transitions: [{
      name: 'fade',
      leave(data) {
        return gsap.to(data.current.container, {
          opacity: 0,
          duration: 0.5
        });
      },
      enter(data) {
        return gsap.from(data.next.container, {
          opacity: 0,
          duration: 0.5
        });
      }
    }]
  });
}, []);
```

## Troubleshooting

### Three.js not rendering
- Check browser console for WebGL errors
- Ensure canvas ref is properly attached
- Verify Three.js is imported correctly

### Animations not working
- Ensure GSAP is registered: `gsap.registerPlugin(ScrollTrigger)`
- Check that elements have correct class names
- Verify scroll triggers are set up correctly

### Performance issues
- Reduce particle count
- Lower pixel ratio
- Disable some animations on mobile

## Credits

Inspired by:
- Anyflow Labs (https://labs.anyflow.agency/)
- Modern web design trends
- Three.js examples
- GSAP showcase projects
