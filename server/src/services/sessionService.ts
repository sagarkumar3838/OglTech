import { supabase } from '../config/supabase';

interface EvaluationSession {
  session_id: string;
  user_id: string;
  evaluation_id: string;
  skill: string;
  level: string;
  started_at: Date;
  last_activity: Date;
  is_active: boolean;
  tab_switches: number;
  question_ids: string[];
}

export class SessionService {
  /**
   * Create a new evaluation session
   */
  async createSession(
    userId: string,
    evaluationId: string,
    skill: string,
    level: string,
    questionIds: string[]
  ): Promise<string> {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const { error } = await supabase
      .from('evaluation_sessions')
      .insert({
        session_id: sessionId,
        user_id: userId,
        evaluation_id: evaluationId,
        skill: skill,
        level: level,
        started_at: new Date().toISOString(),
        last_activity: new Date().toISOString(),
        is_active: true,
        tab_switches: 0,
        question_ids: questionIds
      });

    if (error) {
      console.error('Error creating session:', error);
      throw new Error('Failed to create session');
    }

    console.log(`✅ Created session: ${sessionId}`);
    return sessionId;
  }

  /**
   * Validate session - check if still active
   */
  async validateSession(sessionId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('evaluation_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return false;
    }

    // Check if session is too old (e.g., more than 2 hours)
    const startedAt = new Date(data.started_at);
    const now = new Date();
    const hoursDiff = (now.getTime() - startedAt.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > 2) {
      await this.invalidateSession(sessionId, 'timeout');
      return false;
    }

    // Update last activity
    await this.updateActivity(sessionId);
    return true;
  }

  /**
   * Update last activity timestamp
   */
  async updateActivity(sessionId: string): Promise<void> {
    await supabase
      .from('evaluation_sessions')
      .update({
        last_activity: new Date().toISOString()
      })
      .eq('session_id', sessionId);
  }

  /**
   * Record tab switch
   */
  async recordTabSwitch(sessionId: string): Promise<number> {
    const { data } = await supabase
      .from('evaluation_sessions')
      .select('tab_switches')
      .eq('session_id', sessionId)
      .single();

    const newCount = (data?.tab_switches || 0) + 1;

    await supabase
      .from('evaluation_sessions')
      .update({
        tab_switches: newCount,
        last_activity: new Date().toISOString()
      })
      .eq('session_id', sessionId);

    console.log(`⚠️ Tab switch detected! Count: ${newCount}`);
    
    // If too many tab switches, invalidate session
    if (newCount >= 3) {
      await this.invalidateSession(sessionId, 'too_many_tab_switches');
      return -1; // Signal to reset test
    }

    return newCount;
  }

  /**
   * Invalidate session (tab switch, timeout, completion)
   */
  async invalidateSession(sessionId: string, reason: string): Promise<void> {
    await supabase
      .from('evaluation_sessions')
      .update({
        is_active: false,
        invalidation_reason: reason,
        invalidated_at: new Date().toISOString()
      })
      .eq('session_id', sessionId);

    console.log(`❌ Session invalidated: ${sessionId} (${reason})`);
  }

  /**
   * Get session details
   */
  async getSession(sessionId: string): Promise<EvaluationSession | null> {
    const { data, error } = await supabase
      .from('evaluation_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error || !data) {
      return null;
    }

    return data as EvaluationSession;
  }

  /**
   * Get user's previously seen question IDs for a skill/level
   */
  async getUserSeenQuestions(
    userId: string,
    skill: string,
    level: string
  ): Promise<string[]> {
    const { data, error } = await supabase
      .from('evaluation_sessions')
      .select('question_ids')
      .eq('user_id', userId)
      .eq('skill', skill)
      .eq('level', level);

    if (error || !data) {
      return [];
    }

    // Flatten all question IDs from all sessions
    const allQuestionIds = data.flatMap(session => session.question_ids || []);
    
    // Return unique IDs
    return [...new Set(allQuestionIds)];
  }

  /**
   * Complete session successfully
   */
  async completeSession(sessionId: string): Promise<void> {
    await supabase
      .from('evaluation_sessions')
      .update({
        is_active: false,
        completed_at: new Date().toISOString()
      })
      .eq('session_id', sessionId);

    console.log(`✅ Session completed: ${sessionId}`);
  }
}

export default SessionService;
