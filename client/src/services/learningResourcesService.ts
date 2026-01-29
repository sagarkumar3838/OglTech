import { SkillType } from '../types';

// Type alias for compatibility
type Skill = SkillType;

// Interface for learning resources
export interface LearningResource {
  mdnLink: string;
  youtubeLink: string;
  topic: string;
  description?: string;
}

// Comprehensive learning resources mapped by topic keywords
const learningResourcesMap: Record<Skill, Record<string, LearningResource>> = {
  html: {
    'HTML Basics': {
      mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
      youtubeLink: 'https://www.youtube.com/watch?v=qz0aGYrrlhU',
      topic: 'HTML Introduction',
      description: 'Learn the fundamentals of HTML'
    },
    'HTML Headings': {
      mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements',
      youtubeLink: 'https://www.youtube.com/watch?v=6CxCgx1oTvU',
      topic: 'HTML Heading Elements',
      description: 'Understanding h1-h6 heading tags'
    },
    'HTML Line Breaks': {
      mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/br',
      youtubeLink: 'https://www.youtube.com/watch?v=X4jc_CHBwl0',
      topic: 'HTML Line Break Element',
      description: 'Using the br tag for line breaks'
    },
    'HTML Links': {
      mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a',
      youtubeLink: 'https://www.youtube.com/watch?v=eddsQe7HGoo',
      topic: 'HTML Anchor Links',
      description: 'Creating hyperlinks with the anchor tag'
    },
    'HTML Document Structure': {
      mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html',
      youtubeLink: 'https://www.youtube.com/watch?v=salY_Sm6mv4',
      topic: 'HTML Document Structure',
      description: 'Understanding HTML document structure'
    },
    'HTML Lists': {
      mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul',
      youtubeLink: 'https://www.youtube.com/watch?v=09oErCBjVns',
      topic: 'HTML Lists',
      description: 'Creating ordered and unordered lists'
    }
  },
  css: {
    'CSS Basics': {
      mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
      youtubeLink: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc',
      topic: 'CSS Introduction',
      description: 'Learn the fundamentals of CSS'
    }
  },
  javascript: {
    'JavaScript Variables': {
      mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_Types#declarations',
      youtubeLink: 'https://www.youtube.com/watch?v=Z_yXBpTgZ7A',
      topic: 'JavaScript Variables',
      description: 'Declaring and using variables'
    }
  },
  jquery: {
    'jQuery Basics': {
      mdnLink: 'https://developer.mozilla.org/en-US/docs/Glossary/jQuery',
      youtubeLink: 'https://www.youtube.com/watch?v=JjIvF-QKx8A',
      topic: 'jQuery Introduction',
      description: 'Getting started with jQuery'
    }
  },
  devtools: {
    'Browser DevTools': {
      mdnLink: 'https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_are_browser_developer_tools',
      youtubeLink: 'https://www.youtube.com/watch?v=x4q86IjJFag',
      topic: 'Browser Developer Tools',
      description: 'Introduction to browser developer tools'
    }
  }
};

// Get learning resources for a specific topic
export const getLearningResourcesByTopic = (skill: Skill, topic: string): LearningResource | null => {
  const skillResources = learningResourcesMap[skill];
  if (!skillResources) return null;
  return skillResources[topic] || null;
};

// Get learning resources by question text (fuzzy matching)
export const getLearningResourcesByQuestion = (skill: Skill, questionText: string): LearningResource => {
  const skillResources = learningResourcesMap[skill];
  if (!skillResources) {
    return getDefaultLearningResource(skill);
  }

  const questionLower = questionText.toLowerCase();

  // Direct topic matching
  for (const [topic, resource] of Object.entries(skillResources)) {
    const topicKeywords = topic.toLowerCase().split(' ');
    if (topicKeywords.some(keyword => questionLower.includes(keyword))) {
      return resource;
    }
  }

  return getDefaultLearningResource(skill);
};

// Get default learning resource for a skill
export const getDefaultLearningResource = (skill: Skill): LearningResource => {
  const defaults: Record<Skill, LearningResource> = {
    html: {
      mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
      youtubeLink: 'https://www.youtube.com/watch?v=qz0aGYrrlhU',
      topic: 'HTML Fundamentals',
      description: 'Complete HTML tutorial for beginners'
    },
    css: {
      mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
      youtubeLink: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc',
      topic: 'CSS Fundamentals',
      description: 'Complete CSS tutorial for beginners'
    },
    javascript: {
      mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      youtubeLink: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
      topic: 'JavaScript Fundamentals',
      description: 'Complete JavaScript tutorial for beginners'
    },
    jquery: {
      mdnLink: 'https://developer.mozilla.org/en-US/docs/Glossary/jQuery',
      youtubeLink: 'https://www.youtube.com/watch?v=JjIvF-QKx8A',
      topic: 'jQuery Fundamentals',
      description: 'Complete jQuery tutorial for beginners'
    },
    devtools: {
      mdnLink: 'https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_are_browser_developer_tools',
      youtubeLink: 'https://www.youtube.com/watch?v=x4q86IjJFag',
      topic: 'Browser Developer Tools',
      description: 'Complete DevTools tutorial for beginners'
    }
  };

  return defaults[skill];
};

// Get all available topics for a skill
export const getAvailableTopics = (skill: Skill): string[] => {
  const skillResources = learningResourcesMap[skill];
  return skillResources ? Object.keys(skillResources) : [];
};

// Search resources by keyword
export const searchLearningResources = (skill: Skill, keyword: string): LearningResource[] => {
  const skillResources = learningResourcesMap[skill];
  if (!skillResources) return [];

  const keywordLower = keyword.toLowerCase();
  const results: LearningResource[] = [];

  for (const [topic, resource] of Object.entries(skillResources)) {
    if (
      topic.toLowerCase().includes(keywordLower) ||
      resource.topic.toLowerCase().includes(keywordLower) ||
      resource.description?.toLowerCase().includes(keywordLower)
    ) {
      results.push(resource);
    }
  }

  return results;
};
