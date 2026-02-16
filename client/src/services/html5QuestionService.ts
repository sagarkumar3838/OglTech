import api from './api';

export interface HTML5Feature {
  name: string;
  category?: string;
}

export interface HTML5Question {
  type: string;
  question: string;
  options?: string[];
  correct_answer: any;
  explanation?: string;
  code_snippet?: string;
}

export interface HTML5QuestionResponse {
  feature: string;
  questions: HTML5Question[];
}

// Comprehensive list of HTML5 features
export const HTML5_FEATURES: HTML5Feature[] = [
  { name: "Web Workers API", category: "APIs" },
  { name: "Service Workers", category: "APIs" },
  { name: "WebSockets", category: "Communication" },
  { name: "Canvas 2D Context", category: "Graphics" },
  { name: "WebGL", category: "Graphics" },
  { name: "WebRTC", category: "Communication" },
  { name: "IndexedDB", category: "Storage" },
  { name: "File API", category: "APIs" },
  { name: "Drag and Drop", category: "Interaction" },
  { name: "Geolocation", category: "APIs" },
  { name: "Web Storage", category: "Storage" },
  { name: "Application Cache", category: "Storage" },
  { name: "Web SQL Database", category: "Storage" },
  { name: "Server-Sent Events", category: "Communication" },
  { name: "Web Messaging", category: "Communication" },
  { name: "XMLHttpRequest Level 2", category: "Communication" },
  { name: "History API", category: "APIs" },
  { name: "ContentEditable", category: "Editing" },
  { name: "DesignMode", category: "Editing" },
  { name: "Microdata", category: "Semantics" },
  { name: "WebVTT", category: "Media" },
  { name: "Fullscreen API", category: "APIs" },
  { name: "Page Visibility API", category: "APIs" },
  { name: "Vibration API", category: "Device" },
  { name: "Battery Status API", category: "Device" },
  { name: "Network Information API", category: "Device" }
];

export class HTML5QuestionService {
  /**
   * Generate questions for specific HTML5 features
   */
  static async generateQuestions(
    features: string[],
    level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' = 'BASIC',
    questionsPerFeature: number = 2,
    useAI: boolean = true
  ): Promise<HTML5QuestionResponse[]> {
    try {
      const response = await api.post('/questions/generate-html5', {
        features,
        level,
        questionsPerFeature,
        useAI
      });

      return response.data.data.questionsByFeature;
    } catch (error: any) {
      console.error('Error generating HTML5 questions:', error);
      throw new Error(error.response?.data?.error || 'Failed to generate questions');
    }
  }

  /**
   * Generate questions for all HTML5 features
   */
  static async generateAllFeatureQuestions(
    level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' = 'BASIC',
    questionsPerFeature: number = 2
  ): Promise<HTML5QuestionResponse[]> {
    const featureNames = HTML5_FEATURES.map(f => f.name);
    return this.generateQuestions(featureNames, level, questionsPerFeature);
  }

  /**
   * Generate questions for features by category
   */
  static async generateByCategory(
    category: string,
    level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' = 'BASIC',
    questionsPerFeature: number = 2
  ): Promise<HTML5QuestionResponse[]> {
    const features = HTML5_FEATURES
      .filter(f => f.category === category)
      .map(f => f.name);
    
    return this.generateQuestions(features, level, questionsPerFeature);
  }

  /**
   * Get all available categories
   */
  static getCategories(): string[] {
    const categories = new Set(HTML5_FEATURES.map(f => f.category).filter(Boolean));
    return Array.from(categories) as string[];
  }

  /**
   * Get features by category
   */
  static getFeaturesByCategory(category: string): HTML5Feature[] {
    return HTML5_FEATURES.filter(f => f.category === category);
  }
}
