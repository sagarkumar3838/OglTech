import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { BaseAIProvider } from './BaseAIProvider';
import { Evaluation } from '../../types';
import config from '../../config/env';

export class XAIProvider extends BaseAIProvider {
  name = 'X.AI (Grok)';
  private apiUrl = 'https://api.x.ai/v1/chat/completions';

  async generateQuestions(skill: string, level: string, count: number): Promise<Evaluation> {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: config.xai.model,
          messages: [
            { role: 'system', content: this.SYSTEM_PROMPT },
            { role: 'user', content: this.createUserPrompt(skill, level, count) },
          ],
          temperature: 0.9,
          response_format: { type: 'json_object' },
        },
        {
          headers: {
            'Authorization': `Bearer ${config.xai.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = JSON.parse(response.data.choices[0].message.content || '{}');

      result.evaluation_id = uuidv4();
      result.generated_at = new Date().toISOString();
      result.questions = result.questions.map((q: any) => ({
        ...q,
        question_id: uuidv4(),
        created_at: new Date().toISOString(),
      }));

      return result;
    } catch (error) {
      console.error('X.AI Error:', error);
      throw new Error('Failed to generate questions with X.AI');
    }
  }

  async analyzePerformance(data: any): Promise<any> {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: config.xai.model,
          messages: [
            { role: 'system', content: 'You are an expert technical evaluator.' },
            { role: 'user', content: this.createAnalysisPrompt(data) },
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' },
        },
        {
          headers: {
            'Authorization': `Bearer ${config.xai.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return JSON.parse(response.data.choices[0].message.content || '{}');
    } catch (error) {
      console.error('X.AI Analysis Error:', error);
      throw new Error('Failed to analyze performance with X.AI');
    }
  }
}
