import Anthropic from '@anthropic-ai/sdk';
import { v4 as uuidv4 } from 'uuid';
import { BaseAIProvider } from './BaseAIProvider';
import { Evaluation } from '../../types';
import config from '../../config/env';

export class AnthropicProvider extends BaseAIProvider {
  name = 'Anthropic Claude';
  private client: Anthropic;

  constructor() {
    super();
    this.client = new Anthropic({
      apiKey: config.anthropic.apiKey,
    });
  }

  async generateQuestions(skill: string, level: string, count: number): Promise<Evaluation> {
    try {
      const message = await this.client.messages.create({
        model: config.anthropic.model,
        max_tokens: 4096,
        temperature: 0.9,
        system: this.SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: this.createUserPrompt(skill, level, count),
          },
        ],
      });

      const content = message.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      const response = JSON.parse(content.text);

      response.evaluation_id = uuidv4();
      response.generated_at = new Date().toISOString();
      response.questions = response.questions.map((q: any) => ({
        ...q,
        question_id: uuidv4(),
        created_at: new Date().toISOString(),
      }));

      return response;
    } catch (error) {
      console.error('Anthropic Error:', error);
      throw new Error('Failed to generate questions with Anthropic Claude');
    }
  }

  async analyzePerformance(data: any): Promise<any> {
    try {
      const message = await this.client.messages.create({
        model: config.anthropic.model,
        max_tokens: 2048,
        temperature: 0.7,
        system: 'You are an expert technical evaluator.',
        messages: [
          {
            role: 'user',
            content: this.createAnalysisPrompt(data),
          },
        ],
      });

      const content = message.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      return JSON.parse(content.text);
    } catch (error) {
      console.error('Anthropic Analysis Error:', error);
      throw new Error('Failed to analyze performance with Anthropic Claude');
    }
  }
}
