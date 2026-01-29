import { supabase } from '../config/supabase';

// ============================================
// Types
// ============================================

export interface UserCareerSelection {
  id: string;
  user_id: string;
  career_id: string;
  career_name: string;
  selected_at: string;
  is_active: boolean;
  priority: number;
}

export interface UserTestResult {
  id: string;
  user_id: string;
  career_id: string;
  skill_name: string;
  level: 'easy' | 'medium' | 'hard';
  score: number;
  total_questions: number;
  percentage: number;
  passed: boolean;
  time_taken?: number;
  completed_at: string;
  scorecard_data?: any;
}

export interface UserSkillProgress {
  id: string;
  user_id: string;
  career_id: string;
  skill_name: string;
  easy_completed: boolean;
  easy_score?: number;
  medium_completed: boolean;
  medium_score?: number;
  hard_completed: boolean;
  hard_score?: number;
  overall_completion: number;
  last_updated: string;
}

export interface CareerRecommendation {
  id: string;
  user_id: string;
  current_career_id: string;
  recommended_career_id: string;
  recommended_career_name: string;
  reason: string;
  based_on_skills: string[];
  confidence_score: number;
  created_at: string;
  is_viewed: boolean;
  is_accepted: boolean;
  recommendation_type?: 'progression' | 'switch';
  transferable_skills?: string[];
  new_skills_needed?: string[];
}

export interface CareerSwitchPath {
  id: string;
  from_career_id: string;
  to_career_id: string;
  to_career_name: string;
  matching_skills: string[];
  additional_skills_needed: string[];
  difficulty_level?: string;
  estimated_time_months?: number;
  salary_change_percentage?: number;
  job_market_demand?: string;
  description?: string;
  why_switch?: string;
}

export interface SkillCompatibility {
  id: string;
  skill_name: string;
  compatible_careers: string[];
  transferability_score: number;
}

export interface LearningResource {
  id: string;
  skill_name: string;
  level: string;
  title: string;
  description?: string;
  resource_type: 'video' | 'article' | 'course' | 'practice';
  resource_url?: string;
  duration_minutes?: number;
  is_free: boolean;
}

export interface CareerProgressionPath {
  id: string;
  from_career_id: string;
  to_career_id: string;
  to_career_name: string;
  required_skills: string[];
  recommended_skills?: string[];
  difficulty_level?: string;
  estimated_time_months?: number;
  description?: string;
}

// ============================================
// Career Selection Functions
// ============================================

export const selectCareer = async (
  userId: string,
  careerId: string,
  careerName: string,
  priority: number = 1
): Promise<UserCareerSelection | null> => {
  try {
    const { data, error } = await supabase
      .from('user_career_selections')
      .insert([{
        user_id: userId,
        career_id: careerId,
        career_name: careerName,
        priority,
        is_active: true
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error selecting career:', error);
    return null;
  }
};

export const getUserCareerSelections = async (userId: string): Promise<UserCareerSelection[]> => {
  try {
    const { data, error } = await supabase
      .from('user_career_selections')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('priority', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching career selections:', error);
    return [];
  }
};

export const updateCareerSelection = async (
  id: string,
  updates: Partial<UserCareerSelection>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_career_selections')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating career selection:', error);
    return false;
  }
};

// ============================================
// Test Results Functions
// ============================================

export const saveTestResult = async (
  testResult: Omit<UserTestResult, 'id' | 'completed_at'>
): Promise<UserTestResult | null> => {
  try {
    const { data, error} = await supabase
      .from('user_test_results')
      .insert([testResult])
      .select()
      .single();

    if (error) throw error;

    // Update skill progress
    await updateSkillProgress(
      testResult.user_id,
      testResult.career_id,
      testResult.skill_name,
      testResult.level,
      testResult.score,
      testResult.passed
    );

    return data;
  } catch (error) {
    console.error('Error saving test result:', error);
    return null;
  }
};

export const getUserTestResults = async (
  userId: string,
  careerId?: string
): Promise<UserTestResult[]> => {
  try {
    let query = supabase
      .from('user_test_results')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (careerId) {
      query = query.eq('career_id', careerId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching test results:', error);
    return [];
  }
};

// ============================================
// Skill Progress Functions
// ============================================

const updateSkillProgress = async (
  userId: string,
  careerId: string,
  skillName: string,
  level: 'easy' | 'medium' | 'hard',
  score: number,
  passed: boolean
): Promise<void> => {
  try {
    // Get existing progress
    const { data: existing } = await supabase
      .from('user_skill_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('career_id', careerId)
      .eq('skill_name', skillName)
      .single();

    const updates: any = {
      [`${level}_completed`]: passed,
      [`${level}_score`]: score,
      last_updated: new Date().toISOString()
    };

    // Calculate overall completion
    const easyDone = level === 'easy' ? passed : (existing?.easy_completed || false);
    const mediumDone = level === 'medium' ? passed : (existing?.medium_completed || false);
    const hardDone = level === 'hard' ? passed : (existing?.hard_completed || false);
    
    const completedLevels = [easyDone, mediumDone, hardDone].filter(Boolean).length;
    updates.overall_completion = (completedLevels / 3) * 100;

    if (existing) {
      // Update existing
      await supabase
        .from('user_skill_progress')
        .update(updates)
        .eq('id', existing.id);
    } else {
      // Insert new
      await supabase
        .from('user_skill_progress')
        .insert([{
          user_id: userId,
          career_id: careerId,
          skill_name: skillName,
          ...updates
        }]);
    }

    // Check if user completed all levels and generate recommendations
    if (updates.overall_completion === 100) {
      await generateCareerRecommendations(userId, careerId, skillName);
    }
  } catch (error) {
    console.error('Error updating skill progress:', error);
  }
};

export const getUserSkillProgress = async (
  userId: string,
  careerId?: string
): Promise<UserSkillProgress[]> => {
  try {
    let query = supabase
      .from('user_skill_progress')
      .select('*')
      .eq('user_id', userId)
      .order('overall_completion', { ascending: false });

    if (careerId) {
      query = query.eq('career_id', careerId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching skill progress:', error);
    return [];
  }
};

// ============================================
// Career Recommendations Functions
// ============================================

const generateCareerRecommendations = async (
  userId: string,
  currentCareerId: string,
  completedSkill: string
): Promise<void> => {
  try {
    // Get all completed skills for this career
    const { data: allProgress } = await supabase
      .from('user_skill_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('career_id', currentCareerId)
      .gte('overall_completion', 80); // At least 80% complete

    const completedSkills = allProgress?.map(p => p.skill_name) || [];

    // ============================================
    // 1. Generate Progression Recommendations
    // ============================================
    const { data: progressionPaths } = await supabase
      .from('career_progression_paths')
      .select('*')
      .eq('from_career_id', currentCareerId);

    if (progressionPaths && progressionPaths.length > 0) {
      for (const path of progressionPaths) {
        const matchedSkills = path.required_skills.filter((skill: string) => 
          completedSkills.includes(skill)
        );

        const confidenceScore = (matchedSkills.length / path.required_skills.length) * 100;

        if (confidenceScore >= 50) {
          const reason = `You've mastered ${matchedSkills.length} out of ${path.required_skills.length} required skills. ${
            confidenceScore >= 80 
              ? 'You\'re ready to advance to this role!' 
              : 'Complete the remaining skills to unlock this career advancement.'
          }`;

          await createRecommendationIfNotExists(userId, currentCareerId, {
            recommended_career_id: path.to_career_id,
            recommended_career_name: path.to_career_name,
            reason,
            based_on_skills: matchedSkills,
            confidence_score: confidenceScore,
            recommendation_type: 'progression',
            transferable_skills: matchedSkills,
            new_skills_needed: path.required_skills.filter((s: string) => !matchedSkills.includes(s))
          });
        }
      }
    }

    // ============================================
    // 2. Generate Career Switch Recommendations
    // ============================================
    const { data: switchPaths } = await supabase
      .from('career_switch_paths')
      .select('*')
      .eq('from_career_id', currentCareerId);

    if (switchPaths && switchPaths.length > 0) {
      for (const path of switchPaths) {
        const matchedSkills = path.matching_skills.filter((skill: string) => 
          completedSkills.includes(skill)
        );

        const matchPercentage = (matchedSkills.length / path.matching_skills.length) * 100;

        if (matchPercentage >= 30) { // Lower threshold for switches
          const salaryInfo = path.salary_change_percentage 
            ? ` Expected salary change: ${path.salary_change_percentage > 0 ? '+' : ''}${path.salary_change_percentage}%.`
            : '';
          
          const demandInfo = path.job_market_demand 
            ? ` Job market demand: ${path.job_market_demand}.`
            : '';

          const reason = `${path.why_switch || 'Consider switching careers based on your skills.'}${salaryInfo}${demandInfo} You have ${matchedSkills.length} transferable skills.`;

          await createRecommendationIfNotExists(userId, currentCareerId, {
            recommended_career_id: path.to_career_id,
            recommended_career_name: path.to_career_name,
            reason,
            based_on_skills: matchedSkills,
            confidence_score: matchPercentage,
            recommendation_type: 'switch',
            transferable_skills: matchedSkills,
            new_skills_needed: path.additional_skills_needed || []
          });
        }
      }
    }

    // ============================================
    // 3. Generate Skill-Based Career Suggestions
    // ============================================
    // For each completed skill, find compatible careers
    for (const skill of completedSkills) {
      const { data: compatibility } = await supabase
        .from('skill_compatibility')
        .select('*')
        .eq('skill_name', skill)
        .single();

      if (compatibility && compatibility.compatible_careers) {
        // Check if any compatible career is not already recommended
        for (const compatibleCareer of compatibility.compatible_careers) {
          // Skip if it's the current career
          if (compatibleCareer === currentCareerId) continue;

          // Check if already recommended
          const { data: existing } = await supabase
            .from('career_recommendations')
            .select('id')
            .eq('user_id', userId)
            .eq('recommended_career_id', compatibleCareer)
            .single();

          if (!existing) {
            const reason = `Your expertise in ${skill} (transferability: ${compatibility.transferability_score}%) makes you a great fit for this role. Consider exploring this career path.`;

            await createRecommendationIfNotExists(userId, currentCareerId, {
              recommended_career_id: compatibleCareer,
              recommended_career_name: compatibleCareer.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
              reason,
              based_on_skills: [skill],
              confidence_score: compatibility.transferability_score,
              recommendation_type: 'switch',
              transferable_skills: [skill],
              new_skills_needed: []
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error generating recommendations:', error);
  }
};

// Helper function to avoid duplicate recommendations
const createRecommendationIfNotExists = async (
  userId: string,
  currentCareerId: string,
  recommendation: {
    recommended_career_id: string;
    recommended_career_name: string;
    reason: string;
    based_on_skills: string[];
    confidence_score: number;
    recommendation_type: 'progression' | 'switch';
    transferable_skills: string[];
    new_skills_needed: string[];
  }
): Promise<void> => {
  try {
    const { data: existing } = await supabase
      .from('career_recommendations')
      .select('id')
      .eq('user_id', userId)
      .eq('current_career_id', currentCareerId)
      .eq('recommended_career_id', recommendation.recommended_career_id)
      .single();

    if (!existing) {
      await supabase
        .from('career_recommendations')
        .insert([{
          user_id: userId,
          current_career_id: currentCareerId,
          ...recommendation
        }]);
    }
  } catch (error) {
    // Ignore duplicate errors
    if (!error.message?.includes('duplicate')) {
      console.error('Error creating recommendation:', error);
    }
  }
};

export const getUserRecommendations = async (
  userId: string,
  currentCareerId?: string
): Promise<CareerRecommendation[]> => {
  try {
    let query = supabase
      .from('career_recommendations')
      .select('*')
      .eq('user_id', userId)
      .order('confidence_score', { ascending: false });

    if (currentCareerId) {
      query = query.eq('current_career_id', currentCareerId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};

export const markRecommendationViewed = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('career_recommendations')
      .update({ is_viewed: true })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking recommendation viewed:', error);
    return false;
  }
};

export const acceptRecommendation = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('career_recommendations')
      .update({ is_accepted: true, is_viewed: true })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error accepting recommendation:', error);
    return false;
  }
};

// ============================================
// Learning Resources Functions
// ============================================

export const getLearningResources = async (
  skillName: string,
  level?: string
): Promise<LearningResource[]> => {
  try {
    let query = supabase
      .from('learning_resources')
      .select('*')
      .eq('skill_name', skillName);

    if (level) {
      query = query.eq('level', level);
    }

    const { data, error } = await query.order('duration_minutes', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching learning resources:', error);
    return [];
  }
};

// ============================================
// Career Progression Paths Functions
// ============================================

export const getCareerProgressionPaths = async (
  fromCareerId: string
): Promise<CareerProgressionPath[]> => {
  try {
    const { data, error } = await supabase
      .from('career_progression_paths')
      .select('*')
      .eq('from_career_id', fromCareerId)
      .order('difficulty_level', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching career progression paths:', error);
    return [];
  }
};

export const getCareerProgressionPath = async (
  fromCareerId: string,
  toCareerId: string
): Promise<CareerProgressionPath | null> => {
  try {
    const { data, error } = await supabase
      .from('career_progression_paths')
      .select('*')
      .eq('from_career_id', fromCareerId)
      .eq('to_career_id', toCareerId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching career progression path:', error);
    return null;
  }
};

// ============================================
// Career Switch Functions
// ============================================

export const getCareerSwitchPaths = async (
  fromCareerId: string
): Promise<CareerSwitchPath[]> => {
  try {
    const { data, error } = await supabase
      .from('career_switch_paths')
      .select('*')
      .eq('from_career_id', fromCareerId)
      .order('salary_change_percentage', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching career switch paths:', error);
    return [];
  }
};

export const getCareerSwitchPath = async (
  fromCareerId: string,
  toCareerId: string
): Promise<CareerSwitchPath | null> => {
  try {
    const { data, error } = await supabase
      .from('career_switch_paths')
      .select('*')
      .eq('from_career_id', fromCareerId)
      .eq('to_career_id', toCareerId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching career switch path:', error);
    return null;
  }
};

export const getSkillCompatibility = async (
  skillName: string
): Promise<SkillCompatibility | null> => {
  try {
    const { data, error } = await supabase
      .from('skill_compatibility')
      .select('*')
      .eq('skill_name', skillName)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching skill compatibility:', error);
    return null;
  }
};

export const getAllCompatibleCareers = async (
  skills: string[]
): Promise<{ career: string; matchScore: number; matchingSkills: string[] }[]> => {
  try {
    const careerMatches: Map<string, { score: number; skills: string[] }> = new Map();

    for (const skill of skills) {
      const compatibility = await getSkillCompatibility(skill);
      
      if (compatibility) {
        for (const career of compatibility.compatible_careers) {
          const existing = careerMatches.get(career) || { score: 0, skills: [] };
          existing.score += compatibility.transferability_score;
          existing.skills.push(skill);
          careerMatches.set(career, existing);
        }
      }
    }

    // Convert to array and sort by score
    return Array.from(careerMatches.entries())
      .map(([career, data]) => ({
        career,
        matchScore: Math.round(data.score / skills.length),
        matchingSkills: data.skills
      }))
      .sort((a, b) => b.matchScore - a.matchScore);
  } catch (error) {
    console.error('Error getting compatible careers:', error);
    return [];
  }
};

// ============================================
// Career Switch Request
// ============================================

export const requestCareerSwitch = async (
  userId: string,
  fromCareerId: string,
  toCareerId: string,
  toCareerName: string
): Promise<boolean> => {
  try {
    // Deactivate old career
    await supabase
      .from('user_career_selections')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('career_id', fromCareerId);

    // Add new career
    await selectCareer(userId, toCareerId, toCareerName, 1);

    return true;
  } catch (error) {
    console.error('Error switching career:', error);
    return false;
  }
};

// ============================================
// Get Personalized Career Suggestions
// ============================================

export const getPersonalizedCareerSuggestions = async (
  userId: string,
  currentCareerId: string
): Promise<{
  progressions: CareerRecommendation[];
  switches: CareerRecommendation[];
  skillBased: CareerRecommendation[];
}> => {
  try {
    const recommendations = await getUserRecommendations(userId, currentCareerId);

    return {
      progressions: recommendations.filter(r => r.recommendation_type === 'progression'),
      switches: recommendations.filter(r => r.recommendation_type === 'switch'),
      skillBased: recommendations.filter(r => 
        r.recommendation_type === 'switch' && r.based_on_skills.length === 1
      )
    };
  } catch (error) {
    console.error('Error getting personalized suggestions:', error);
    return { progressions: [], switches: [], skillBased: [] };
  }
};
