import axios, { AxiosInstance } from 'axios';
import { Career, Evaluation, Scorecard } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 120000, // 120 seconds (2 minutes) - allows time for Render free tier to wake up
  headers: {
    'Content-Type': 'application/json'
  }
});

// Careers
export const getCareers = () => api.get<{ careers: Career[] }>('/careers');
export const getCareerById = (id: string) => api.get<Career>(`/careers/${id}`);
export const createCareer = (data: Partial<Career>) => api.post('/careers', data);

// Questions
export const generateQuestions = (skill: string, level: string, count: number, useAI: boolean = true) => 
  api.post<Evaluation>('/questions/generate', { skill, level, count, useAI });
export const getQuestions = (evaluationId: string) => 
  api.get<{ questions: any[] }>(`/questions/${evaluationId}`);

// Evaluations
export const submitEvaluation = (data: {
  evaluationId: string;
  userId: string;
  candidateName: string;
  answers: (string | null)[];
}) => api.post('/evaluations/submit', data);

export const getEvaluation = (evaluationId: string) => 
  api.get(`/evaluations/${evaluationId}`);
export const getUserEvaluations = (userId: string) => 
  api.get(`/evaluations/user/${userId}`);

// Scorecards
export const generateScorecard = (data: { submissionId: string; careerId?: string; skillName?: string; level?: string }) => 
  api.post<Scorecard>('/scorecards/generate', data);
export const getScorecard = (scorecardId: string) => 
  api.get<Scorecard>(`/scorecards/${scorecardId}`);
export const getAllScorecards = () => 
  api.get<{ scorecards: Scorecard[] }>('/scorecards');

// Progress
export const getUserProgress = (userId: string, careerId: string) => 
  api.get(`/progress/${userId}/${careerId}`);
export const updateProgress = (data: any) => 
  api.post('/progress/update', data);
export const checkLevelUnlock = (userId: string, careerId: string, skillName: string, level: string) => 
  api.get(`/progress/check-unlock/${userId}/${careerId}/${skillName}/${level}`);
export const getSkillProgress = (userId: string, careerId: string, skillName: string) => 
  api.get(`/progress/skill/${userId}/${careerId}/${skillName}`);
export const getProgressStats = (userId: string, careerId: string) => 
  api.get(`/progress/stats/${userId}/${careerId}`);

export default api;
