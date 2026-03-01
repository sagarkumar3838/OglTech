---
inclusion: always
---

# Design System Rules for Skill Evaluation Platform

This document provides comprehensive guidelines for integrating Figma designs into the codebase using the Model Context Protocol.

## Tech Stack Overview

- **Framework**: React 18 with TypeScript
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS + DaisyUI
- **UI Components**: Radix UI + shadcn/ui
- **Animations**: Framer Motion + GSAP
- **Build Tool**: Vite
- **Backend**: Supabase (PostgreSQL + Auth)

## 1. Token Definitions

### Color System

Design tokens are defined in two locations:

**Location 1: `client/src/index.css` (CSS Variables)**
```css
:root {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F8FAFC;
  --bg-card: #FFFFFF;
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --text-muted: #64748B;
  --border-color: #E2E8F0;
  --brand-primary: #4F46E5;
  --brand-hover: #4338CA;
  --accent-glow: #22D3EE;
  --success: #16A34A;
  --warning: #F59E0B;
  --danger: #EF4444;
}

.dark {
  --bg-primary: #0B1220;
  --bg-secondary: #0F172A;
  --bg-card: #111827;
  --text-primary: #E5E7EB;
  --text-secondary: #94A3B8;
  --brand-primary: #6366F1;
  --brand-hover: #818CF8;
}
```

**Location 2: `client/tailwind.config.js` (Tailwind Tokens)**
```javascript
colors: {
  brand: {
    DEFAULT: '#4F46E5',
    hover: '#4338CA',
    light: '#6366F1',
    'light-hover': '#818CF8',
  },
  accent: {
    DEFAULT: '#22D3EE',
    glow: '#22D3EE',
  },
}
```

### Typography

- **Font Family**: System font stack (Apple System, Segoe UI, Roboto)
- **Code Font**: source-code-pro, Menlo, Monaco, Consolas
- **Sizes**: Use Tailwind's default scale (text-sm, text-base, text-lg, etc.)

### Spacing

- Use Tailwind's spacing scale: `p-4`, `m-6`, `gap-2`, etc.
- Common patterns: `p-6` for card padding, `gap-4` for flex/grid gaps

## 2. Component Library

### Location
All UI components are in `client/src/components/ui/`

### Component Architecture

**Base Pattern**: shadcn/ui + Radix UI primitives
```typescript
// Example: Button component
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
  }
)
```

### Available Components

**Core UI**: button, card, input, select, dialog, dropdown-menu, popover, tooltip, tabs, accordion
**Forms**: form, label, checkbox, radio-group, switch, slider, textarea
**Data Display**: table, badge, avatar, separator, progress
**Feedback**: alert, toast, skeleton, loading-dots
**Navigation**: navigation-menu, menubar, breadcrumb
**Animated**: animated-button, shimmer-button, floating-navbar, hero-parallax, particles-background
**Glass Effects**: glass-card, GlassCard (with glassmorphism)

### Component Usage Pattern
```typescript
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

<Card className="glass-card">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Button variant="default" size="lg">Click Me</Button>
  </CardContent>
</Card>
```

## 3. Styling Approach

### CSS Methodology
- **Primary**: Tailwind CSS utility classes
- **Component Variants**: class-variance-authority (CVA)
- **Class Merging**: `cn()` utility from `@/lib/utils`

### Utility Function
```typescript
// client/src/lib/utils.ts
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Global Styles
Location: `client/src/index.css`

**Key Classes**:
- `.glass` - Glassmorphism effect with backdrop blur
- `.glass-card` - Card with glass effect
- `.glass-nav` - Navigation with glass effect
- `.btn-primary` - Primary button style
- `.gradient-text` - Gradient text effect
- `.card-hover` - Premium hover effect for cards
- `.badge` - Badge/pill component
- `.skeleton` - Loading skeleton animation

### Responsive Design
- Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Mobile-first approach
- Common pattern: `flex flex-col md:flex-row`

## 4. Icon System

### Primary Icon Library: Devicon
Location: `client/src/utils/techIcons.tsx`

```typescript
import { TechIcon, getDeviconClass } from '@/utils/techIcons'

// Usage 1: Component
<TechIcon name="react" variant="plain" colored={true} size={24} />

// Usage 2: Class name
const iconClass = getDeviconClass('javascript', 'plain', true)
// Returns: "devicon-javascript-plain-colored"
```

**Supported Technologies**: HTML, CSS, JavaScript, TypeScript, React, Angular, Vue, Node.js, Python, Java, Docker, Kubernetes, AWS, Azure, GCP, and 40+ more

### Secondary Icon Libraries
- **Lucide React**: `import { Icon } from 'lucide-react'`
- **Heroicons**: `import { Icon } from '@heroicons/react/24/outline'`
- **Font Awesome**: `import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'`
- **React Icons**: `import { Icon } from 'react-icons/fa'`

## 5. Asset Management

### Media Storage
- **Database**: Supabase Storage
- **Service**: `client/src/services/mediaService.ts` and `client/src/services/videoService.ts`
- **Local Development**: Assets in `client/public/` or imported directly

### Asset Patterns
```typescript
// Import static assets
import logo from '@/assets/logo.png'

// Use from public folder
<img src="/images/hero.jpg" alt="Hero" />

// From Supabase
import { getMediaUrl } from '@/services/mediaService'
const imageUrl = getMediaUrl('hero1.jpg')
```

## 6. Animation System

### Libraries
- **Framer Motion**: Primary animation library
- **GSAP**: Complex animations and timelines
- **CSS Animations**: Simple transitions

### Common Animation Patterns

**Framer Motion**:
```typescript
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

**CSS Animations** (from `index.css`):
- `.animate-fade-in-up` - Fade in with upward motion
- `.animate-float` - Floating animation
- `.animate-glow` - Glowing effect
- `.animate-shimmer` - Shimmer loading effect

## 7. Project Structure

```
client/src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── animations/      # Animation components
│   ├── section-components/  # Page sections
│   ├── Layout.tsx       # Main layout wrapper
│   ├── Footer.tsx       # Footer component
│   └── ResizableNavbar.tsx  # Navigation
├── pages/               # Route pages
├── contexts/            # React contexts (Auth, Theme)
├── hooks/               # Custom React hooks
├── services/            # API services (Supabase)
├── utils/               # Utility functions
├── lib/                 # Library configurations
├── types/               # TypeScript types
└── config/              # App configuration



## 8. Figma MCP Integration Guidelines

### Core Principles

When converting Figma designs to code:

1. **Treat Figma output as design reference**, not final code
2. **Replace Tailwind utilities** with project's design tokens when applicable
3. **Reuse existing components** instead of duplicating functionality
4. **Maintain 1:1 visual parity** with Figma designs
5. **Validate against Figma screenshots** for accuracy

### Design Token Mapping

When Figma MCP returns Tailwind classes, map them to our design system:

**Colors**:
- `bg-indigo-600` → `bg-brand` or `var(--brand-primary)`
- `bg-cyan-400` → `bg-accent` or `var(--accent-glow)`
- `text-slate-900` → `text-light-text-primary` or `var(--text-primary)`
- `border-gray-200` → `border-light-border` or `var(--border-color)`

**Spacing**:
- Keep Tailwind spacing (`p-6`, `gap-4`) as-is
- Adjust only if conflicts with existing patterns

**Typography**:
- Use existing font stack (system fonts)
- Map font sizes to Tailwind scale

### Component Reuse Strategy

**Before creating new components**, check if these exist:

```typescript
// Buttons
import { Button } from "@/components/ui/button"
<Button variant="default|outline|ghost" size="default|sm|lg">

// Cards
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

// Inputs
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Dialogs/Modals
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"

// Icons
import { TechIcon } from "@/utils/techIcons"
import { Icon } from "lucide-react"
```

### Glass Effects

For glassmorphism designs from Figma:

```typescript
// Use existing glass classes
<div className="glass-card">
  {/* Content */}
</div>

// Or glass navigation
<nav className="glass-nav">
  {/* Nav items */}
</nav>
```

### Animation Integration

When Figma designs include animations:

```typescript
// Use Framer Motion for interactions
import { motion } from 'framer-motion'

<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="card-hover"
>
  {/* Content */}
</motion.div>

// Or use CSS animation classes
<div className="animate-fade-in-up">
  {/* Content */}
</div>
```

### Responsive Patterns

Ensure Figma designs are responsive:

```typescript
// Mobile-first approach
<div className="flex flex-col md:flex-row gap-4">
  <div className="w-full md:w-1/2">Column 1</div>
  <div className="w-full md:w-1/2">Column 2</div>
</div>

// Hide/show based on screen size
<div className="hidden md:block">Desktop only</div>
<div className="block md:hidden">Mobile only</div>
```

### Dark Mode Support

All Figma conversions must support dark mode:

```typescript
// Use CSS variables (automatically switches)
<div style={{ 
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-primary)'
}}>

// Or Tailwind dark mode classes
<div className="bg-light-bg-card dark:bg-dark-bg-card">
  <p className="text-light-text-primary dark:text-dark-text-primary">
    Content
  </p>
</div>
```

### Code Connect Workflow

1. **Get design context** from Figma URL
2. **Review generated code** and adapt to design system
3. **Reuse existing components** where possible
4. **Map to design tokens** (colors, spacing, typography)
5. **Add dark mode support**
6. **Test responsiveness**
7. **Link component** using Code Connect

### Example Conversion

**Figma MCP Output**:
```typescript
<div className="bg-indigo-600 text-white p-6 rounded-lg">
  <h2 className="text-2xl font-bold">Title</h2>
  <p className="text-gray-100">Description</p>
  <button className="bg-cyan-400 px-4 py-2 rounded">Click</button>
</div>
```

**Adapted to Design System**:
```typescript
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

<Card className="glass-card bg-brand text-white">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-light-text-primary dark:text-dark-text-primary">
      Description
    </p>
    <Button variant="default" className="bg-accent">
      Click
    </Button>
  </CardContent>
</Card>
```

### Quality Checklist

Before finalizing Figma-to-code conversions:

- [ ] Uses existing components from `@/components/ui/`
- [ ] Maps to design tokens (CSS variables or Tailwind config)
- [ ] Supports dark mode
- [ ] Responsive on mobile, tablet, desktop
- [ ] Matches Figma screenshot visually
- [ ] Uses `cn()` utility for class merging
- [ ] Follows TypeScript best practices
- [ ] Includes proper accessibility attributes

