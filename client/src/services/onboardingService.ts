import { supabase } from '../config/supabase';

// ============================================
// Types
// ============================================

export interface UserOnboardingStatus {
  id: string;
  user_id: string;
  profile_completed: boolean;
  profile_completed_at?: string;
  career_selected: boolean;
  career_selected_at?: string;
  first_test_taken: boolean;
  first_test_taken_at?: string;
  onboarding_completed: boolean;
  onboarding_completed_at?: string;
  current_step: 'profile' | 'career' | 'test' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface UserTestPerformance {
  id: string;
  user_id: string;
  career_id: string;
  skill_name: string;
  
  // Easy Level
  easy_attempts: number;
  easy_best_score: number;
  easy_best_percentage: number;
  easy_passed: boolean;
  easy_last_attempt?: string;
  
  // Medium Level
  medium_attempts: number;
  medium_best_score: number;
  medium_best_percentage: number;
  medium_passed: boolean;
  medium_last_attempt?: string;
  
  // Hard Level
  hard_attempts: number;
  hard_best_score: number;
  hard_best_percentage: number;
  hard_passed: boolean;
  hard_last_attempt?: string;
  
  // Overall
  total_attempts: number;
  average_score: number;
  skill_mastery_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  user_id: string;
  email: string;
  full_name?: string;
  is_profile_complete: boolean;
  onboarding_step: string;
  onboarding_completed: boolean;
  active_careers: number;
  primary_career?: string;
  total_tests_taken: number;
  tests_passed: number;
  average_score: number;
  skills_mastered: number;
  skills_in_progress: number;
  unread_recommendations: number;
  last_test_date?: string;
  last_activity_date?: string;
}

export interface ProfileData {
  full_name?: string;
  phone?: string;
  location?: string;
  education_level?: string;
  years_of_experience?: number;
  current_role?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  bio?: string;
  profile_picture_url?: string;
}

// ============================================
// Onboarding Status Functions
// ============================================

export const getOnboardingStatus = async (userId: string): Promise<UserOnboardingStatus | null> => {
  try {
    const { data, error } = await supabase
      .from('user_onboarding_status')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // If not found, create it
      if (error.code === 'PGRST116') {
        return await initializeOnboarding(userId);
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching onboarding status:', error);
    return null;
  }
};

const initializeOnboarding = async (userId: string): Promise<UserOnboardingStatus | null> => {
  try {
    const { data, error } = await supabase
      .from('user_onboarding_status')
      .insert([{
        user_id: userId,
        current_step: 'profile'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error initializing onboarding:', error);
    return null;
  }
};

export const updateOnboardingStep = async (
  userId: string,
  step: 'profile' | 'career' | 'test' | 'completed'
): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('update_onboarding_progress', {
      p_user_id: userId,
      p_step: step
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating onboarding step:', error);
    return false;
  }
};

// ============================================
// Profile Functions
// ============================================

export const completeProfile = async (
  userId: string,
  profileData: ProfileData
): Promise<boolean> => {
  try {
    // Update user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        ...profileData,
        is_profile_complete: true,
        updated_at: new Date().toISOString()
      });

    if (profileError) throw profileError;

    // Update onboarding status
    await updateOnboardingStep(userId, 'profile');

    return true;
  } catch (error) {
    console.error('Error completing profile:', error);
    return false;
  }
};

export const getUserProfile = async (userId: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// ============================================
// Dashboard Stats Functions
// ============================================

export const getDashboardStats = async (userId: string): Promise<DashboardStats | null> => {
  try {
    const { data, error } = await supabase
      .from('user_dashboard_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }
};

// ============================================
// Test Performance Functions
// ============================================

export const getTestPerformance = async (
  userId: string,
  careerId?: string
): Promise<UserTestPerformance[]> => {
  try {
    let query = supabase
      .from('user_test_performance')
      .select('*')
      .eq('user_id', userId)
      .order('average_score', { ascending: false });

    if (careerId) {
      query = query.eq('career_id', careerId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching test performance:', error);
    return [];
  }
};

export const getSkillPerformance = async (
  userId: string,
  careerId: string,
  skillName: string
): Promise<UserTestPerformance | null> => {
  try {
    const { data, error } = await supabase
      .from('user_test_performance')
      .select('*')
      .eq('user_id', userId)
      .eq('career_id', careerId)
      .eq('skill_name', skillName)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error fetching skill performance:', error);
    return null;
  }
};

export const recordTestPerformance = async (
  userId: string,
  careerId: string,
  skillName: string,
  level: 'easy' | 'medium' | 'hard',
  score: number,
  totalQuestions: number,
  passed: boolean
): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('update_test_performance', {
      p_user_id: userId,
      p_career_id: careerId,
      p_skill_name: skillName,
      p_level: level,
      p_score: score,
      p_total_questions: totalQuestions,
      p_passed: passed
    });

    if (error) throw error;

    // Update onboarding if this is first test
    const onboarding = await getOnboardingStatus(userId);
    if (onboarding && !onboarding.first_test_taken) {
      await updateOnboardingStep(userId, 'test');
    }

    return true;
  } catch (error) {
    console.error('Error recording test performance:', error);
    return false;
  }
};

// ============================================
// Helper Functions
// ============================================

export const getNextOnboardingStep = (status: UserOnboardingStatus): {
  step: string;
  title: string;
  description: string;
  action: string;
} => {
  if (!status.profile_completed) {
    return {
      step: 'profile',
      title: 'Complete Your Profile',
      description: 'Tell us about yourself to get personalized recommendations',
      action: 'Complete Profile'
    };
  }

  if (!status.career_selected) {
    return {
      step: 'career',
      title: 'Choose Your Career Path',
      description: 'Select up to 2 careers you want to pursue',
      action: 'Choose Career'
    };
  }

  if (!status.first_test_taken) {
    return {
      step: 'test',
      title: 'Take Your First Test',
      description: 'Start with an easy level test to assess your skills',
      action: 'Start Test'
    };
  }

  return {
    step: 'completed',
    title: 'Onboarding Complete!',
    description: 'Continue learning and taking tests to improve your skills',
    action: 'View Dashboard'
  };
};

export const calculateOverallProgress = (performance: UserTestPerformance[]): {
  totalTests: number;
  passedTests: number;
  averageScore: number;
  masteredSkills: number;
} => {
  const totalTests = performance.reduce((sum, p) => sum + p.total_attempts, 0);
  const passedTests = performance.filter(p => 
    p.easy_passed || p.medium_passed || p.hard_passed
  ).length;
  const averageScore = performance.length > 0
    ? performance.reduce((sum, p) => sum + p.average_score, 0) / performance.length
    : 0;
  const masteredSkills = performance.filter(p => 
    p.skill_mastery_level === 'expert' || p.skill_mastery_level === 'advanced'
  ).length;

  return {
    totalTests,
    passedTests,
    averageScore: Math.round(averageScore * 10) / 10,
    masteredSkills
  };
};

export const getSkillMasteryColor = (level?: string): string => {
  switch (level) {
    case 'expert': return 'text-purple-600 bg-purple-100';
    case 'advanced': return 'text-green-600 bg-green-100';
    case 'intermediate': return 'text-blue-600 bg-blue-100';
    case 'beginner': return 'text-yellow-600 bg-yellow-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const getSkillMasteryIcon = (level?: string): string => {
  switch (level) {
    case 'expert': return '👑';
    case 'advanced': return '⭐';
    case 'intermediate': return '📈';
    case 'beginner': return '🌱';
    default: return '❓';
  }
};
