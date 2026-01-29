import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { BaseAIProvider } from './BaseAIProvider';
import { Evaluation } from '../../types';
import config from '../../config/env';

export class OpenAIProvider extends BaseAIProvider {
  name = 'OpenAI';
  private client: OpenAI;

  constructor() {
    super();
    this.client = new OpenAI({
      apiKey: config.openai.apiKey,
    });
  }

  async generateQuestions(skill: string, level: string, count: number): Promise<Evaluation> {
    try {
      const completion = await this.client.chat.completions.create({
        model: config.openai.model,
        messages: [
          { role: 'system', content: this.SYSTEM_PROMPT },
          { role: 'user', content: this.createUserPrompt(skill, level, count) },
        ],
        temperature: 0.9,
        response_format: { type: 'json_object' },
      });

      const response = JSON.parse(completion.choices[0].message.content || '{}');

      response.evaluation_id = uuidv4();
      response.generated_at = new Date().toISOString();
      response.questions = response.questions.map((q: any) => ({
        ...q,
        question_id: uuidv4(),
        created_at: new Date().toISOString(),
      }));

      return response;
    } catch (error) {
      console.error('OpenAI Error:', error);
      throw new Error('Failed to generate questions with OpenAI');
    }
  }

  async analyzePerformance(data: any): Promise<any> {
    try {
      const completion = await this.client.chat.completions.create({
        model: config.openai.model,
        messages: [
          { role: 'system', content: 'You are an expert technical evaluator.' },
          { role: 'user', content: this.createAnalysisPrompt(data) },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });

      return JSON.parse(completion.choices[0].message.content || '{}');
    } catch (error) {
      console.error('OpenAI Analysis Error:', error);
      throw new Error('Failed to analyze performance with OpenAI');
    }
  }
}
