import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { createClient } from '@supabase/supabase-js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBiQVtm1-N6xoIGjFQE6GyluxHbjxl8q_8",
  authDomain: "mentorai1998.firebaseapp.com",
  projectId: "mentorai1998",
  storageBucket: "mentorai1998.firebasestorage.app",
  messagingSenderId: "792042014529",
  appId: "1:792042014529:web:faefd332b8e7a15c1183c0",
  measurementId: "G-QNRWHX5T9Z"
};

// Supabase configuration
const supabaseUrl = 'https://ksjgsgebjnpwyycnptom.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzamdzZ2Viam5wd3l5Y25wdG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMzM5NDEsImV4cCI6MjA4NDYwOTk0MX0.R4w_7BJ7AgzegkpCaJZji154NFlmzjjnOs3VkH4eYjU';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateCareers() {
  console.log('\n📚 Migrating Careers...');
  try {
    const careersRef = collection(db, 'careers');
    const snapshot = await getDocs(careersRef);
    
    const careers = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      description: doc.data().description,
      experience_level: doc.data().experienceLevel || doc.data().experience_level,
      skills: doc.data().skills || []
    }));

    console.log(`Found ${careers.length} careers in Firebase`);

    if (careers.length > 0) {
      const { data, error } = await supabase
        .from('careers')
        .upsert(careers, { onConflict: 'id' });

      if (error) {
        console.error('Error inserting careers:', error);
      } else {
        console.log(`✅ Successfully migrated ${careers.length} careers`);
      }
    }
  } catch (error) {
    console.error('Error migrating careers:', error);
  }
}

async function migrateUserProgress() {
  console.log('\n👤 Migrating User Progress...');
  try {
    const progressRef = collection(db, 'user_progress');
    const snapshot = await getDocs(progressRef);
    
    const progressData = snapshot.docs.map(doc => {
      const data = doc.data();
      // Parse the document ID to extract user_id and career_id
      const [user_id, career_id] = doc.id.split('_');
      
      return {
        id: doc.id,
        user_id: user_id,
        career_id: career_id,
        skill_progress: data.skill_progress || []
      };
    });

    console.log(`Found ${progressData.length} user progress records in Firebase`);

    if (progressData.length > 0) {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert(progressData, { onConflict: 'id' });

      if (error) {
        console.error('Error inserting user progress:', error);
      } else {
        console.log(`✅ Successfully migrated ${progressData.length} user progress records`);
      }
    }
  } catch (error) {
    console.error('Error migrating user progress:', error);
  }
}

async function migrateQuestions() {
  console.log('\n❓ Migrating Questions...');
  try {
    const questionsRef = collection(db, 'questions');
    const snapshot = await getDocs(questionsRef);
    
    const questions = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        question_id: data.question_id || doc.id,
        skill: data.skill,
        level: data.level,
        type: data.type,
        question: data.question,
        options: data.options || [],
        correct_answer: data.correct_answer || data.correctAnswer,
        explanation: data.explanation || null,
        code_snippet: data.code_snippet || data.codeSnippet || null,
        test_cases: data.test_cases || data.testCases || [],
        blanks: data.blanks || [],
        matching_pairs: data.matching_pairs || data.matchingPairs || null,
        verified: data.verified || false,
        usage_count: data.usage_count || data.usageCount || 0
      };
    });

    console.log(`Found ${questions.length} questions in Firebase`);

    if (questions.length > 0) {
      const { data, error } = await supabase
        .from('questions')
        .upsert(questions, { onConflict: 'id' });

      if (error) {
        console.error('Error inserting questions:', error);
      } else {
        console.log(`✅ Successfully migrated ${questions.length} questions`);
      }
    }
  } catch (error) {
    console.error('Error migrating questions:', error);
  }
}

async function migrateEvaluations() {
  console.log('\n📝 Migrating Evaluations...');
  try {
    const evaluationsRef = collection(db, 'evaluations');
    const snapshot = await getDocs(evaluationsRef);
    
    const evaluations = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        evaluation_id: data.evaluation_id || doc.id,
        user_id: data.user_id || data.userId,
        career_id: data.career_id || data.careerId || null,
        skill: data.skill,
        level: data.level,
        question_count: data.question_count || data.questionCount,
        questions: data.questions || [],
        status: data.status || 'generated'
      };
    });

    console.log(`Found ${evaluations.length} evaluations in Firebase`);

    if (evaluations.length > 0) {
      const { data, error } = await supabase
        .from('evaluations')
        .upsert(evaluations, { onConflict: 'id' });

      if (error) {
        console.error('Error inserting evaluations:', error);
      } else {
        console.log(`✅ Successfully migrated ${evaluations.length} evaluations`);
      }
    }
  } catch (error) {
    console.error('Error migrating evaluations:', error);
  }
}

async function migrateSubmissions() {
  console.log('\n📤 Migrating Submissions...');
  try {
    const submissionsRef = collection(db, 'submissions');
    const snapshot = await getDocs(submissionsRef);
    
    const submissions = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        submission_id: data.submission_id || doc.id,
        evaluation_id: data.evaluation_id || data.evaluationId,
        user_id: data.user_id || data.userId,
        candidate_name: data.candidate_name || data.candidateName,
        answers: data.answers || []
      };
    });

    console.log(`Found ${submissions.length} submissions in Firebase`);

    if (submissions.length > 0) {
      const { data, error } = await supabase
        .from('submissions')
        .upsert(submissions, { onConflict: 'id' });

      if (error) {
        console.error('Error inserting submissions:', error);
      } else {
        console.log(`✅ Successfully migrated ${submissions.length} submissions`);
      }
    }
  } catch (error) {
    console.error('Error migrating submissions:', error);
  }
}

async function migrateScorecards() {
  console.log('\n🏆 Migrating Scorecards...');
  try {
    const scorecardsRef = collection(db, 'scorecards');
    const snapshot = await getDocs(scorecardsRef);
    
    const scorecards = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        scorecard_id: data.scorecard_id || doc.id,
        submission_id: data.submission_id || data.submissionId,
        user_id: data.user_id || data.userId,
        candidate_name: data.candidate_name || data.candidateName,
        skill: data.skill,
        level_attempted: data.level_attempted || data.levelAttempted,
        overall_score: data.overall_score || data.overallScore,
        correct_count: data.correct_count || data.correctCount,
        total_questions: data.total_questions || data.totalQuestions,
        level_readiness: data.level_readiness || data.levelReadiness,
        observed_maturity: data.observed_maturity || data.observedMaturity || null,
        dimension_scores: data.dimension_scores || data.dimensionScores || {},
        question_breakdown: data.question_breakdown || data.questionBreakdown || [],
        strengths: data.strengths || [],
        gaps: data.gaps || [],
        recommendations: data.recommendations || [],
        hiring_recommendation: data.hiring_recommendation || data.hiringRecommendation,
        evaluator_summary: data.evaluator_summary || data.evaluatorSummary || null
      };
    });

    console.log(`Found ${scorecards.length} scorecards in Firebase`);

    if (scorecards.length > 0) {
      const { data, error } = await supabase
        .from('scorecards')
        .upsert(scorecards, { onConflict: 'id' });

      if (error) {
        console.error('Error inserting scorecards:', error);
      } else {
        console.log(`✅ Successfully migrated ${scorecards.length} scorecards`);
      }
    }
  } catch (error) {
    console.error('Error migrating scorecards:', error);
  }
}

async function migrateEvaluationCache() {
  console.log('\n💾 Migrating Evaluation Cache...');
  try {
    const cacheRef = collection(db, 'evaluation_cache');
    const snapshot = await getDocs(cacheRef);
    
    const cacheData = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        cache_key: data.cache_key || data.cacheKey || doc.id,
        skill: data.skill,
        level: data.level,
        question_count: data.question_count || data.questionCount,
        questions: data.questions || [],
        usage_count: data.usage_count || data.usageCount || 1
      };
    });

    console.log(`Found ${cacheData.length} cache entries in Firebase`);

    if (cacheData.length > 0) {
      const { data, error } = await supabase
        .from('evaluation_cache')
        .upsert(cacheData, { onConflict: 'id' });

      if (error) {
        console.error('Error inserting cache:', error);
      } else {
        console.log(`✅ Successfully migrated ${cacheData.length} cache entries`);
      }
    }
  } catch (error) {
    console.error('Error migrating cache:', error);
  }
}

async function main() {
  console.log('🚀 Starting Firebase to Supabase Migration...\n');
  console.log('Firebase Project: mentorai1998');
  console.log('Supabase Project: ksjgsgebjnpwyycnptom');
  
  await migrateCareers();
  await migrateUserProgress();
  await migrateQuestions();
  await migrateEvaluations();
  await migrateSubmissions();
  await migrateScorecards();
  await migrateEvaluationCache();
  
  console.log('\n✅ Migration Complete!');
  console.log('\nNext steps:');
  console.log('1. Verify data in Supabase dashboard');
  console.log('2. Test the application with Supabase');
  console.log('3. Deploy the updated frontend');
}

main().catch(console.error);
