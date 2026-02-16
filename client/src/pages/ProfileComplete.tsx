import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Briefcase,
  Target,
  Code,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Github,
  Linkedin,
  Twitter,
  Sparkles
} from 'lucide-react';

interface ProfileData {
  fullName: string;
  bio: string;
  currentRole: string;
  experienceLevel: string;
  skills: string[];
  interests: string[];
  learningGoals: string[];
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  preferredLearningStyle: string;
}

const ProfileComplete = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/profile';

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: user?.email?.split('@')[0] || '',
    bio: '',
    currentRole: '',
    experienceLevel: '',
    skills: [],
    interests: [],
    learningGoals: [],
    githubUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    preferredLearningStyle: ''
  });

  const [tempSkill, setTempSkill] = useState('');
  const [tempInterest, setTempInterest] = useState('');
  const [tempGoal, setTempGoal] = useState('');

  const experienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const learningStyles = ['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic'];
  
  const suggestedSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript',
    'HTML/CSS', 'SQL', 'Git', 'AWS', 'Docker'
  ];

  const suggestedInterests = [
    'Web Development', 'Mobile Apps', 'AI/ML', 'Cloud Computing',
    'DevOps', 'Cybersecurity', 'Data Science', 'Game Development'
  ];

  const progress = (currentStep / totalSteps) * 100;

  const handleAddSkill = (skill: string) => {
    if (skill && !profileData.skills.includes(skill)) {
      setProfileData({ ...profileData, skills: [...profileData.skills, skill] });
      setTempSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(s => s !== skill)
    });
  };

  const handleAddInterest = (interest: string) => {
    if (interest && !profileData.interests.includes(interest)) {
      setProfileData({ ...profileData, interests: [...profileData.interests, interest] });
      setTempInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setProfileData({
      ...profileData,
      interests: profileData.interests.filter(i => i !== interest)
    });
  };

  const handleAddGoal = (goal: string) => {
    if (goal && !profileData.learningGoals.includes(goal)) {
      setProfileData({ ...profileData, learningGoals: [...profileData.learningGoals, goal] });
      setTempGoal('');
    }
  };

  const handleRemoveGoal = (goal: string) => {
    setProfileData({
      ...profileData,
      learningGoals: profileData.learningGoals.filter(g => g !== goal)
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Save profile data to backend/localStorage
    console.log('Profile Data:', profileData);
    
    // Navigate to redirect URL
    navigate(redirectTo);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return profileData.fullName && profileData.bio;
      case 2:
        return profileData.currentRole && profileData.experienceLevel;
      case 3:
        return profileData.skills.length > 0 && profileData.interests.length > 0;
      case 4:
        return profileData.learningGoals.length > 0 && profileData.preferredLearningStyle;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Help us personalize your learning experience</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Card */}
        <Card className="shadow-2xl border-0">
          <CardContent className="p-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                    <p className="text-gray-600">Tell us about yourself</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <Input
                    placeholder="John Doe"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    className="text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio *
                  </label>
                  <Textarea
                    placeholder="Tell us about yourself, your background, and what you're passionate about..."
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="min-h-[120px]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {profileData.bio.length} / 500 characters
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Professional Background */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Briefcase className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Professional Background</h2>
                    <p className="text-gray-600">Your current role and experience</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Role *
                  </label>
                  <Input
                    placeholder="e.g., Frontend Developer, Student, Career Changer"
                    value={profileData.currentRole}
                    onChange={(e) => setProfileData({ ...profileData, currentRole: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Experience Level *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {experienceLevels.map((level) => (
                      <button
                        key={level}
                        onClick={() => setProfileData({ ...profileData, experienceLevel: level })}
                        className={`p-4 rounded-lg border-2 transition ${
                          profileData.experienceLevel === level
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold">{level}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Social Links (Optional)
                  </label>
                  <div className="flex items-center gap-2">
                    <Github className="w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="GitHub URL"
                      value={profileData.githubUrl}
                      onChange={(e) => setProfileData({ ...profileData, githubUrl: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="LinkedIn URL"
                      value={profileData.linkedinUrl}
                      onChange={(e) => setProfileData({ ...profileData, linkedinUrl: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Twitter className="w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Twitter URL"
                      value={profileData.twitterUrl}
                      onChange={(e) => setProfileData({ ...profileData, twitterUrl: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Skills & Interests */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Code className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Skills & Interests</h2>
                    <p className="text-gray-600">What do you know and want to learn?</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Skills * (Select at least 1)
                  </label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Add a skill..."
                      value={tempSkill}
                      onChange={(e) => setTempSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill(tempSkill)}
                    />
                    <Button onClick={() => handleAddSkill(tempSkill)}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profileData.skills.map((skill) => (
                      <Badge
                        key={skill}
                        className="bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestedSkills
                      .filter(s => !profileData.skills.includes(s))
                      .map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => handleAddSkill(skill)}
                        >
                          + {skill}
                        </Badge>
                      ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Interests * (Select at least 1)
                  </label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Add an interest..."
                      value={tempInterest}
                      onChange={(e) => setTempInterest(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddInterest(tempInterest)}
                    />
                    <Button onClick={() => handleAddInterest(tempInterest)}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profileData.interests.map((interest) => (
                      <Badge
                        key={interest}
                        className="bg-purple-500 text-white cursor-pointer hover:bg-purple-600"
                        onClick={() => handleRemoveInterest(interest)}
                      >
                        {interest} ×
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestedInterests
                      .filter(i => !profileData.interests.includes(i))
                      .map((interest) => (
                        <Badge
                          key={interest}
                          variant="outline"
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => handleAddInterest(interest)}
                        >
                          + {interest}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Learning Goals */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Learning Goals</h2>
                    <p className="text-gray-600">What do you want to achieve?</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Learning Goals * (Add at least 1)
                  </label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="e.g., Master React, Get AWS Certified..."
                      value={tempGoal}
                      onChange={(e) => setTempGoal(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddGoal(tempGoal)}
                    />
                    <Button onClick={() => handleAddGoal(tempGoal)}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.learningGoals.map((goal) => (
                      <Badge
                        key={goal}
                        className="bg-green-500 text-white cursor-pointer hover:bg-green-600"
                        onClick={() => handleRemoveGoal(goal)}
                      >
                        {goal} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Preferred Learning Style *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {learningStyles.map((style) => (
                      <button
                        key={style}
                        onClick={() => setProfileData({ ...profileData, preferredLearningStyle: style })}
                        className={`p-4 rounded-lg border-2 transition ${
                          profileData.preferredLearningStyle === style
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold">{style}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-blue-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">You're almost done!</h3>
                      <p className="text-sm text-gray-600">
                        Complete your profile to unlock personalized learning recommendations and track your progress.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="min-w-[120px]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="min-w-[120px] bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={!canProceed()}
                  className="min-w-[120px] bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  Complete Profile
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Skip Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate(redirectTo)}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileComplete;
