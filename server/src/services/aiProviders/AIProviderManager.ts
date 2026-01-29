import { OpenAIProvider } from './OpenAIProvider';
import { XAIProvider } from './XAIProvider';
import { AnthropicProvider } from './AnthropicProvider';
import { GoogleProvider } from './GoogleProvider';
import { GroqProvider } from './GroqProvider';
import { DeepSeekProvider } from './DeepSeekProvider';
import { AIProvider, Evaluation } from '../../types';
import config from '../../config/env';

export class AIProviderManager {
  private providers: Map<string, AIProvider> = new Map();
  private providerOrder: string[] = [];
  private currentProviderIndex = 0;

  constructor() {
    // Initialize all available providers
    const availableProviders: Record<string, () => AIProvider> = {
      openai: () => new OpenAIProvider(),
      anthropic: () => new AnthropicProvider(),
      google: () => new GoogleProvider(),
      groq: () => new GroqProvider(),
      deepseek: () => new DeepSeekProvider(),
      xai: () => new XAIProvider(),
    };

    // Check which providers have API keys
    const configuredProviders: Record<string, boolean> = {
      openai: !!config.openai.apiKey,
      anthropic: !!config.anthropic.apiKey,
      google: !!config.google.apiKey,
      groq: !!config.groq.apiKey,
      deepseek: !!config.deepseek.apiKey,
      xai: !!config.xai.apiKey,
    };

    // Initialize providers based on priority and availability
    for (const providerName of config.aiProviderPriority) {
      const normalizedName = providerName.trim().toLowerCase();
      if (configuredProviders[normalizedName] && availableProviders[normalizedName]) {
        try {
          const provider = availableProviders[normalizedName]();
          this.providers.set(normalizedName, provider);
          this.providerOrder.push(normalizedName);
          console.log(`✓ Initialized ${provider.name}`);
        } catch (error) {
          console.error(`✗ Failed to initialize ${normalizedName}:`, error);
        }
      }
    }

    // Add any remaining configured providers not in priority list
    for (const [name, isConfigured] of Object.entries(configuredProviders)) {
      if (isConfigured && !this.providers.has(name) && availableProviders[name]) {
        try {
          const provider = availableProviders[name]();
          this.providers.set(name, provider);
          this.providerOrder.push(name);
          console.log(`✓ Initialized ${provider.name} (fallback)`);
        } catch (error) {
          console.error(`✗ Failed to initialize ${name}:`, error);
        }
      }
    }

    if (this.providers.size === 0) {
      throw new Error(
        'No AI providers configured. Please set at least one API key: OPENAI_API_KEY, ANTHROPIC_API_KEY, GOOGLE_API_KEY, GROQ_API_KEY, DEEPSEEK_API_KEY, or XAI_API_KEY'
      );
    }

    console.log(
      `\n🤖 AI Provider Manager initialized with ${this.providers.size} provider(s):`
    );
    console.log(`   Priority order: ${this.providerOrder.join(' → ')}\n`);
  }

  private getNextProvider(): AIProvider {
    const providerName = this.providerOrder[this.currentProviderIndex];
    const provider = this.providers.get(providerName)!;
    this.currentProviderIndex = (this.currentProviderIndex + 1) % this.providerOrder.length;
    return provider;
  }

  /**
   * Get provider by name
   */
  getProvider(name: string): AIProvider | undefined {
    return this.providers.get(name.toLowerCase());
  }

  /**
   * Get all available provider names
   */
  getAvailableProviders(): string[] {
    return this.providerOrder;
  }

  /**
   * Get provider statistics
   */
  getProviderStats(): Record<string, { name: string; available: boolean }> {
    const stats: Record<string, { name: string; available: boolean }> = {};
    
    this.providers.forEach((provider, key) => {
      stats[key] = {
        name: provider.name,
        available: true,
      };
    });

    return stats;
  }

  async generateQuestions(skill: string, level: string, count: number): Promise<Evaluation> {
    let lastError: Error | null = null;
    const attemptedProviders: string[] = [];

    // Try all providers in order
    for (let i = 0; i < this.providerOrder.length; i++) {
      const provider = this.getNextProvider();
      attemptedProviders.push(provider.name);
      
      try {
        console.log(`[${i + 1}/${this.providerOrder.length}] Attempting to generate questions with ${provider.name}...`);
        const startTime = Date.now();
        const result = await provider.generateQuestions(skill, level, count);
        const duration = Date.now() - startTime;
        console.log(`✓ Successfully generated ${count} questions with ${provider.name} in ${duration}ms`);
        return result;
      } catch (error) {
        console.error(`✗ ${provider.name} failed:`, error instanceof Error ? error.message : error);
        lastError = error as Error;
        
        // If we have more providers, try the next one
        if (i < this.providerOrder.length - 1) {
          console.log(`→ Falling back to next provider...`);
          continue;
        }
      }
    }

    // All providers failed
    throw new Error(
      `All ${this.providerOrder.length} AI providers failed. Attempted: ${attemptedProviders.join(', ')}. Last error: ${lastError?.message}`
    );
  }

  async analyzePerformance(data: any): Promise<any> {
    let lastError: Error | null = null;
    const attemptedProviders: string[] = [];

    for (let i = 0; i < this.providerOrder.length; i++) {
      const provider = this.getNextProvider();
      attemptedProviders.push(provider.name);
      
      try {
        console.log(`[${i + 1}/${this.providerOrder.length}] Attempting to analyze performance with ${provider.name}...`);
        const startTime = Date.now();
        const result = await provider.analyzePerformance(data);
        const duration = Date.now() - startTime;
        console.log(`✓ Successfully analyzed performance with ${provider.name} in ${duration}ms`);
        return result;
      } catch (error) {
        console.error(`✗ ${provider.name} analysis failed:`, error instanceof Error ? error.message : error);
        lastError = error as Error;
        
        if (i < this.providerOrder.length - 1) {
          console.log(`→ Falling back to next provider...`);
          continue;
        }
      }
    }

    throw new Error(
      `All ${this.providerOrder.length} AI providers failed. Attempted: ${attemptedProviders.join(', ')}. Last error: ${lastError?.message}`
    );
  }
}

// Singleton instance
export const aiProviderManager = new AIProviderManager();
