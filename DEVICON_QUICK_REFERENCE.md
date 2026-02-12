# Devicon Quick Reference Card

## 🚀 Quick Start

```tsx
import { TechIcon } from '../utils/techIcons';

// Basic usage
<TechIcon name="javascript" size={24} />
```

## 📋 Common Patterns

### Simple Icon
```tsx
<TechIcon name="react" size={24} />
```

### With Label
```tsx
<div className="flex items-center gap-2">
  <TechIcon name="python" size={20} />
  <span>Python</span>
</div>
```

### Different Variants
```tsx
<TechIcon name="nodejs" variant="plain" size={24} />
<TechIcon name="nodejs" variant="original" size={24} />
<TechIcon name="nodejs" variant="line" size={24} />
```

### Colored vs Monochrome
```tsx
<TechIcon name="docker" colored={true} size={24} />
<TechIcon name="docker" colored={false} size={24} className="text-blue-600" />
```

### With Hover Effect
```tsx
<TechIcon 
  name="kubernetes" 
  size={32}
  className="hover:scale-110 transition-transform cursor-pointer"
/>
```

## 🎨 Variants

| Variant | Description | Example |
|---------|-------------|---------|
| `plain` | Simple icon (default) | `<TechIcon name="react" variant="plain" />` |
| `original` | Full logo with wordmark | `<TechIcon name="react" variant="original" />` |
| `line` | Outline/line style | `<TechIcon name="react" variant="line" />` |

## 📏 Common Sizes

| Size | Use Case | Example |
|------|----------|---------|
| 16px | Small inline icons | `<TechIcon name="html" size={16} />` |
| 20px | List items | `<TechIcon name="css" size={20} />` |
| 24px | Standard UI elements | `<TechIcon name="javascript" size={24} />` |
| 32px | Cards, headers | `<TechIcon name="typescript" size={32} />` |
| 40px | Hero sections | `<TechIcon name="react" size={40} />` |
| 64px | Feature highlights | `<TechIcon name="nodejs" size={64} />` |

## 🔤 Technology Names

### Web Development
`html`, `css`, `javascript`, `typescript`, `react`, `angular`, `vue`

### Backend
`java`, `python`, `nodejs`, `csharp`, `php`, `ruby`, `go`, `rust`

### Database
`sql`, `oracle`, `postgresql`, `mongodb`, `redis`

### Mobile
`kotlin`, `swift`, `flutter`, `reactnative`

### DevOps & Cloud
`docker`, `kubernetes`, `linux`, `aws`, `azure`, `gcp`, `terraform`, `ansible`

### Graphics & Game Dev
`opengl`, `cpp`, `unity`, `unreal`

### DevTools
`git`, `webpack`, `vscode`, `chrome`

### Testing
`selenium`, `jest`, `cypress`

## 🎯 Props Reference

```tsx
interface TechIconProps {
  name: string;              // Technology name (required)
  variant?: 'plain' | 'original' | 'line';  // Icon style (default: 'plain')
  colored?: boolean;         // Use brand colors (default: true)
  size?: number;            // Icon size in pixels (default: 24)
  className?: string;       // Additional CSS classes
}
```

## 💡 Tips & Tricks

### Responsive Sizing
```tsx
<TechIcon 
  name="react" 
  size={24}
  className="sm:text-2xl md:text-3xl lg:text-4xl"
/>
```

### Dark Mode Support
```tsx
<TechIcon 
  name="python" 
  colored={false}
  size={24}
  className="text-gray-800 dark:text-gray-200"
/>
```

### Grid Layout
```tsx
<div className="grid grid-cols-4 gap-4">
  {technologies.map(tech => (
    <TechIcon key={tech} name={tech} size={32} />
  ))}
</div>
```

### Animated Icons
```tsx
<TechIcon 
  name="docker" 
  size={32}
  className="animate-pulse"
/>
```

## 🔧 Adding New Technology

1. Visit [devicon.dev](https://devicon.dev/)
2. Find the icon name
3. Add to `deviconMap` in `client/src/utils/techIcons.tsx`:

```tsx
const deviconMap: Record<string, string> = {
  // ... existing mappings
  'newtechnology': 'devicon-classname',
};
```

4. Use it:
```tsx
<TechIcon name="newtechnology" size={24} />
```

## 🐛 Troubleshooting

### Icon Not Showing?
1. Check Devicon CDN is loaded in `index.html`
2. Verify technology name in `deviconMap`
3. Try different variant: `plain`, `original`, or `line`

### Icon Too Small?
```tsx
// Increase size prop
<TechIcon name="react" size={48} />
```

### Want Custom Color?
```tsx
// Use monochrome + CSS class
<TechIcon 
  name="nodejs" 
  colored={false}
  className="text-green-600"
/>
```

## 📚 Resources

- [Devicon Website](https://devicon.dev/)
- [Full Documentation](client/src/utils/TECH_ICONS_README.md)
- [Migration Guide](DEVICON_MIGRATION_GUIDE.md)
- [Implementation Summary](TECH_ICONS_IMPLEMENTATION.md)

## ⚡ Performance

- **Single CSS file** - All icons in one request
- **Font-based** - Instant rendering, perfect scaling
- **~50KB total** - Includes 150+ icons
- **Cached** - Loads once, works forever

---

**Quick Copy-Paste:**
```tsx
import { TechIcon } from '../utils/techIcons';

<TechIcon name="javascript" size={24} />
```
