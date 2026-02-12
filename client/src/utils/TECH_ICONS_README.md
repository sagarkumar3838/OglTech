# Tech Icons Integration

This project uses tech icons from [Devicon](https://devicon.dev/) to display technology logos throughout the application.

## Usage

### Import the TechIcon component

```tsx
import { TechIcon } from '../utils/techIcons';
```

### Basic Usage

```tsx
<TechIcon name="javascript" size={24} />
<TechIcon name="react" size={32} />
<TechIcon name="python" size={40} />
```

### With Custom Styling

```tsx
<TechIcon 
  name="typescript" 
  size={24} 
  className="text-blue-600" 
/>
```

### Variant Support

Devicon supports multiple variants:

```tsx
{/* Plain colored icon (default) */}
<TechIcon name="nodejs" variant="plain" colored={true} size={24} />

{/* Original colored icon (with wordmark/full logo) */}
<TechIcon name="nodejs" variant="original" colored={true} size={24} />

{/* Line icon (outline style) */}
<TechIcon name="nodejs" variant="line" colored={true} size={24} />

{/* Plain monochrome icon */}
<TechIcon name="nodejs" variant="plain" colored={false} size={24} />
```

## Supported Technologies

The following technologies are mapped and available:

### Web Development
- html, css, javascript, typescript, react, angular, vue

### Backend
- java, python, nodejs, csharp, php, ruby, go, rust

### Database
- sql, oracle, postgresql, mongodb, redis

### Mobile
- kotlin, swift, flutter, reactnative

### DevOps & Cloud
- docker, kubernetes, linux, aws, azure, gcp, terraform, ansible

### Graphics & Game Dev
- opengl, glsl, cpp, unity, unreal

### DevTools
- devtools, webpack, git, vscode

### Testing
- selenium, jest, cypress

## How It Works

1. The `TechIcon` component uses Devicon CSS classes to display icons
2. Devicon is loaded via CDN in `client/index.html`
3. Icons are rendered as `<i>` elements with appropriate Devicon classes
4. The component automatically maps common names to Devicon class names

## Adding New Technologies

To add support for a new technology:

1. Open `client/src/utils/techIcons.tsx`
2. Add the mapping to the `deviconMap` object:

```tsx
const deviconMap: Record<string, string> = {
  // ... existing mappings
  'newtechnology': 'devicon-name',
};
```

3. Find the correct Devicon name at [devicon.dev](https://devicon.dev/)

4. The icon will automatically be available via:

```tsx
<TechIcon name="newtechnology" size={24} />
```

## Where Tech Icons Are Used

- **Practice Page**: Language selector and header
- **Dashboard**: Skills progress cards and recent tests
- **DashboardSimple**: Skills progress cards
- **TechIconsShowcase**: Demo component showing all available icons

## Advantages of Devicon

- **Comprehensive**: 150+ technology icons
- **Consistent Design**: All icons follow the same design language
- **Multiple Variants**: Plain, original, and line styles
- **Colored & Monochrome**: Support for both colored and monochrome versions
- **Font-based**: Icons are rendered as fonts, making them scalable and lightweight
- **No Network Fallback Needed**: Icons are loaded once via CDN

## CDN Integration

Devicon is loaded via CDN in the HTML head:

```html
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
```
