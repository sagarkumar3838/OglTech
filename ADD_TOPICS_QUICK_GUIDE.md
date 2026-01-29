# 📚 Quick Guide: Adding Topics to Reference Library

## Method 1: Using SQL (Fastest)

### Step 1: Add Topic Reference

```sql
INSERT INTO topic_references (
  skill_name, 
  category, 
  topic_name, 
  slug, 
  description, 
  difficulty_level, 
  icon, 
  color,
  order_index
) VALUES (
  'React',                          -- Skill name
  'Hooks',                          -- Category
  'useEffect Hook',                 -- Topic name
  'react-useeffect',                -- URL slug (lowercase, dashes)
  'Side effects in React',          -- Description
  'intermediate',                   -- basic | intermediate | advanced
  '⚛️',                             -- Emoji icon
  '#61DAFB',                        -- Color (hex)
  1                                 -- Order in list
);
```

### Step 2: Add Content Sections

```sql
-- Get the topic ID first
SELECT id FROM topic_references WHERE slug = 'react-useeffect';

-- Add content sections
INSERT INTO topic_content_sections (
  topic_id,
  section_title,
  section_type,
  content,
  code_language,
  order_index
) VALUES 
(
  'YOUR_TOPIC_ID_HERE',
  'What is useEffect?',
  'explanation',
  'useEffect is a Hook that lets you perform side effects in functional components.',
  NULL,
  1
),
(
  'YOUR_TOPIC_ID_HERE',
  'Basic Usage',
  'code',
  'import { useEffect } from ''react'';

function Example() {
  useEffect(() => {
    // Side effect code here
    console.log(''Component mounted'');
    
    // Cleanup function
    return () => {
      console.log(''Component unmounted'');
    };
  }, []); // Dependencies array
}',
  'jsx',
  2
),
(
  'YOUR_TOPIC_ID_HERE',
  'Important Note',
  'tip',
  'Always include dependencies in the array to avoid infinite loops!',
  NULL,
  3
);
```

### Section Types Available:
- `explanation` - Text explanation
- `code` - Code block with syntax highlighting
- `syntax` - Syntax reference
- `example` - Example usage
- `table` - Table format
- `list` - List format
- `note` - Blue info box
- `tip` - Yellow tip box
- `warning` - Red warning box

## Method 2: Using TypeScript Script

### Step 1: Create Topic Data

```typescript
import { addTopic } from './scripts/add-topic-content';

const myTopic = {
  skillName: 'React',
  category: 'Hooks',
  topicName: 'useEffect',
  slug: 'react-useeffect',
  description: 'Side effects in React components',
  difficultyLevel: 'intermediate',
  icon: '⚛️',
  color: '#61DAFB',
  sections: [
    {
      title: 'What is useEffect?',
      type: 'explanation',
      content: 'useEffect is a Hook for side effects...',
    },
    {
      title: 'Basic Usage',
      type: 'code',
      content: 'import { useEffect } from "react";\n\n...',
      codeLanguage: 'jsx',
    },
  ],
};

await addTopic(myTopic);
```

### Step 2: Run Script

```bash
npx tsx scripts/add-topic-content.ts
```

## Method 3: Using Supabase Dashboard

1. Go to Supabase Dashboard → Table Editor
2. Select `topic_references` table
3. Click "Insert row"
4. Fill in the fields
5. Click "Save"
6. Repeat for `topic_content_sections`

## 🎨 Icon & Color Guide

### Skill Colors
- HTML: `#E34F26` 📄
- CSS: `#1572B6` 🎨
- JavaScript: `#F7DF1E` ⚡
- React: `#61DAFB` ⚛️
- Node.js: `#339933` 🟢
- TypeScript: `#3178C6` 📘
- Python: `#3776AB` 🐍
- PHP: `#777BB4` 🐘

### Common Icons
- Basics: 📚 📖 📝 📄
- Functions: ⚡ 🔧 ⚙️ 🛠️
- Data: 📦 💾 🗄️ 📊
- Network: 🌐 📡 🔗 📞
- Security: 🔒 🔐 🛡️ 🔑
- Performance: ⚡ 🚀 ⏱️ 📈
- UI: 🎨 🖼️ 🎭 ✨

## 📝 Content Writing Tips

### 1. Explanation Sections
- Keep it simple and clear
- Explain "what" and "why"
- Use analogies when helpful

### 2. Code Sections
- Include comments
- Show complete, working examples
- Use realistic variable names
- Format properly

### 3. Tips & Warnings
- Tips: Best practices, shortcuts, pro tips
- Warnings: Common mistakes, gotchas, pitfalls
- Notes: Additional information, context

## 🔄 Bulk Import Template

```sql
-- Import multiple topics at once
INSERT INTO topic_references (skill_name, category, topic_name, slug, description, difficulty_level, icon, color, order_index) VALUES
('React', 'Hooks', 'useState', 'react-usestate', 'State management', 'intermediate', '🎣', '#61DAFB', 1),
('React', 'Hooks', 'useEffect', 'react-useeffect', 'Side effects', 'intermediate', '🎣', '#61DAFB', 2),
('React', 'Hooks', 'useContext', 'react-usecontext', 'Context API', 'advanced', '🎣', '#61DAFB', 3),
('React', 'Hooks', 'useReducer', 'react-usereducer', 'Complex state', 'advanced', '🎣', '#61DAFB', 4),
('React', 'Hooks', 'useRef', 'react-useref', 'DOM references', 'intermediate', '🎣', '#61DAFB', 5);
```

## 🎯 Real-World Example

Let's add a complete topic for "CSS Grid":

```sql
-- 1. Add topic
INSERT INTO topic_references (
  skill_name, category, topic_name, slug, description, 
  difficulty_level, icon, color, order_index
) VALUES (
  'CSS', 'Layout', 'CSS Grid', 'css-grid', 
  'Two-dimensional layout system',
  'intermediate', '🎛️', '#1572B6', 12
) RETURNING id;

-- 2. Add content (replace YOUR_ID with the returned id)
INSERT INTO topic_content_sections (topic_id, section_title, section_type, content, code_language, order_index) VALUES
(
  'YOUR_ID',
  'What is CSS Grid?',
  'explanation',
  'CSS Grid is a powerful two-dimensional layout system that allows you to create complex responsive layouts with rows and columns.',
  NULL,
  1
),
(
  'YOUR_ID',
  'Basic Grid Container',
  'code',
  '.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 100px auto 100px;
  gap: 20px;
}',
  'css',
  2
),
(
  'YOUR_ID',
  'Grid Item Placement',
  'code',
  '.item {
  grid-column: 1 / 3;  /* Span columns 1-2 */
  grid-row: 1 / 2;     /* Span row 1 */
}',
  'css',
  3
),
(
  'YOUR_ID',
  'Pro Tip',
  'tip',
  'Use Firefox DevTools Grid Inspector to visualize your grid layout!',
  NULL,
  4
);
```

## 📊 Topic Categories by Skill

### HTML
- Basics, Text, Media, Forms, Tables, Semantic, Advanced

### CSS
- Basics, Box Model, Typography, Layout, Responsive, Animation, Advanced

### JavaScript
- Basics, Control Flow, Functions, Arrays, Objects, DOM, Async, ES6+

### React
- Basics, Components, Hooks, State Management, Routing, Performance

### Node.js
- Basics, Modules, File System, HTTP, Express, Database, Security

## ✅ Checklist for Adding Topics

- [ ] Topic has clear, descriptive name
- [ ] Slug is lowercase with dashes
- [ ] Description is concise (< 100 chars)
- [ ] Appropriate difficulty level
- [ ] Relevant icon and color
- [ ] At least 3 content sections
- [ ] Code examples are complete and working
- [ ] Includes at least one tip or note
- [ ] Content is accurate and up-to-date
- [ ] Tested in the UI

## 🚀 Quick Commands

```bash
# View all topics
SELECT skill_name, topic_name, slug FROM topic_references ORDER BY skill_name, order_index;

# Count topics by skill
SELECT skill_name, COUNT(*) FROM topic_references GROUP BY skill_name;

# Find topics without content
SELECT tr.topic_name 
FROM topic_references tr 
LEFT JOIN topic_content_sections tcs ON tr.id = tcs.topic_id 
WHERE tcs.id IS NULL;

# Delete a topic and its content
DELETE FROM topic_references WHERE slug = 'topic-slug';
```

## 📞 Need Help?

- Check existing topics for examples
- Review `seed-topic-content.sql` for patterns
- Test in development first
- Use Supabase SQL Editor for quick edits

---

**Ready to add topics?** Start with Method 1 (SQL) for the fastest results! 🚀
