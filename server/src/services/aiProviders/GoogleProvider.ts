import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { BaseAIProvider } from './BaseAIProvider';
import { Evaluation } from '../../types';
import config from '../../config/env';

export class GoogleProvider extends BaseAIProvider {
  name = 'Google Gemini';
  private apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${config.google.model}:generateContent`;

  async generateQuestions(skill: string, level: string, count: number): Promise<Evaluation> {
    try {
      const response = await axios.post(
        `${this.apiUrl}?key=${config.google.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `${this.SYSTEM_PROMPT}\n\n${this.createUserPrompt(skill, level, count)}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const text = response.data.candidates[0].content.parts[0].text;
      
      // Extract JSON from markdown code blocks if present
      let jsonText = text;
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }

      const result = JSON.parse(jsonText);

      result.evaluation_id = uuidv4();
      result.generated_at = new Date().toISOString();
      result.questions = result.questions.map((q: any) => ({
        ...q,
        question_id: uuidv4(),
        created_at: new Date().toISOString(),
      }));

      return result;
    } catch (error) {
      console.error('Google Gemini Error:', error);
      throw new Error('Failed to generate questions with Google Gemini');
    }
  }

  async analyzePerformance(data: any): Promise<any> {
    try {
      const response = await axios.post(
        `${this.apiUrl}?key=${config.google.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `You are an expert technical evaluator.\n\n${this.createAnalysisPrompt(data)}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const text = response.data.candidates[0].content.parts[0].text;
      
      let jsonText = text;
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }

      return JSON.parse(jsonText);
    } catch (error) {
      console.error('Google Gemini Analysis Error:', error);
      throw new Error('Failed to analyze performance with Google Gemini');
    }
  }
}
