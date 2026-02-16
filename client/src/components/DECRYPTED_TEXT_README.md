# DecryptedText Component

A React component that creates an animated text decryption effect with customizable scrambling animations. Perfect for hero sections, headings, and interactive text elements.

## Features

- 🎭 **Multiple Animation Modes**: Hover, view, or both
- 🔄 **Sequential or Random**: Reveal characters one by one or all at once
- 🎯 **Reveal Directions**: Start, end, or center-out reveal
- 🎨 **Fully Customizable**: Speed, characters, iterations, and styling
- ♿ **Accessible**: Includes screen reader support
- 🎬 **Framer Motion**: Built with smooth animations

## Installation

The component is already installed in your project at:
```
client/src/components/DecryptedText.tsx
```

## Basic Usage

```tsx
import DecryptedText from './components/DecryptedText';

// Simple hover effect
<DecryptedText text="Hover me!" />

// Animate on view (runs once when scrolled into view)
<DecryptedText 
  text="This animates when visible"
  animateOn="view"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | **required** | The text to display and animate |
| `speed` | `number` | `50` | Animation speed in milliseconds |
| `maxIterations` | `number` | `10` | Number of scramble iterations (non-sequential mode) |
| `sequential` | `boolean` | `false` | Reveal characters one by one |
| `revealDirection` | `'start' \| 'end' \| 'center'` | `'start'` | Direction of sequential reveal |
| `useOriginalCharsOnly` | `boolean` | `false` | Only use characters from the original text |
| `characters` | `string` | `'ABC...xyz!@#...'` | Characters to use for scrambling |
| `className` | `string` | `''` | CSS class for revealed characters |
| `encryptedClassName` | `string` | `''` | CSS class for scrambled characters |
| `parentClassName` | `string` | `''` | CSS class for the parent span |
| `animateOn` | `'view' \| 'hover' \| 'both'` | `'hover'` | When to trigger animation |

## Examples

### Example 1: Default Hover Effect
```tsx
<DecryptedText text="Hover to decrypt!" />
```

### Example 2: Custom Speed and Characters
```tsx
<DecryptedText
  text="Custom animation"
  speed={60}
  maxIterations={15}
  characters="ABCD1234!?"
  className="text-blue-500"
  encryptedClassName="text-gray-400"
/>
```

### Example 3: Sequential Reveal on View
```tsx
<DecryptedText
  text="Reveals character by character"
  animateOn="view"
  sequential={true}
  revealDirection="start"
  speed={30}
/>
```

### Example 4: Center-Out Reveal
```tsx
<DecryptedText
  text="Reveals from center outward"
  animateOn="view"
  sequential={true}
  revealDirection="center"
  speed={40}
/>
```

### Example 5: Use Original Characters Only
```tsx
<DecryptedText
  text="HELLO WORLD"
  useOriginalCharsOnly={true}
  sequential={true}
  animateOn="view"
/>
```

### Example 6: Hero Section (Current Implementation)
```tsx
<h1 className="text-6xl font-bold">
  <DecryptedText
    text="Anyone can learn skills"
    animateOn="view"
    speed={30}
    sequential={true}
    revealDirection="start"
    className="text-white"
    encryptedClassName="text-white/40"
  />
  <br />
  <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
    <DecryptedText
      text="Only a few build a brand"
      animateOn="view"
      speed={30}
      sequential={true}
      className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
      encryptedClassName="text-indigo-400/30"
    />
  </span>
</h1>
```

## Animation Modes

### Hover Mode (`animateOn="hover"`)
- Animates when user hovers over the text
- Resets when hover ends
- Good for interactive elements

### View Mode (`animateOn="view"`)
- Animates once when scrolled into view
- Uses Intersection Observer
- Perfect for hero sections and headings

### Both Mode (`animateOn="both"`)
- Animates on view AND on hover
- Combines both behaviors

## Reveal Directions

### Start (`revealDirection="start"`)
```
H → HE → HEL → HELL → HELLO
```

### End (`revealDirection="end"`)
```
O → LO → LLO → ELLO → HELLO
```

### Center (`revealDirection="center"`)
```
L → LL → ELL → ELLO → HELLO
```

## Styling

### Revealed Characters
Use `className` prop to style revealed characters:
```tsx
<DecryptedText
  text="Styled text"
  className="text-blue-500 font-bold"
/>
```

### Encrypted Characters
Use `encryptedClassName` prop to style scrambled characters:
```tsx
<DecryptedText
  text="Styled text"
  encryptedClassName="text-gray-400 opacity-50"
/>
```

### Parent Container
Use `parentClassName` prop to style the container:
```tsx
<DecryptedText
  text="Styled text"
  parentClassName="inline-block px-4 py-2 bg-gray-100 rounded"
/>
```

## Accessibility

The component includes proper accessibility features:
- Screen reader text with `sr-only` class
- Aria-hidden on animated text
- Semantic HTML structure

## Performance Tips

1. **Speed**: Lower values = faster animation (30-50ms recommended)
2. **MaxIterations**: Lower values = shorter animation (5-15 recommended)
3. **Sequential**: More performant than random scrambling
4. **Characters**: Fewer characters = better performance

## Common Use Cases

### Hero Headings
```tsx
<h1>
  <DecryptedText
    text="Welcome to the Future"
    animateOn="view"
    sequential={true}
    speed={30}
  />
</h1>
```

### Interactive Buttons
```tsx
<button>
  <DecryptedText
    text="Click Me"
    animateOn="hover"
    speed={20}
    maxIterations={5}
  />
</button>
```

### Loading States
```tsx
<DecryptedText
  text="Loading..."
  animateOn="view"
  speed={100}
  useOriginalCharsOnly={true}
/>
```

### Cyberpunk/Tech Aesthetic
```tsx
<DecryptedText
  text="SYSTEM ONLINE"
  characters="01"
  speed={20}
  sequential={true}
  className="text-green-400 font-mono"
  encryptedClassName="text-green-600/30 font-mono"
/>
```

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers
- Requires Intersection Observer API (supported in all modern browsers)

## Dependencies

- `react` (^18.0.0)
- `framer-motion` (^11.0.0)

## Credits

Inspired by text decryption effects commonly seen in cyberpunk and tech-themed interfaces.

## License

Part of the SkillEval project.
