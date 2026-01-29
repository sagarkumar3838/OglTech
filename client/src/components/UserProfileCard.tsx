import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userProfileService } from '../services/userProfileService';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  User,
  Briefcase,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Edit,
  Target,
  Code,
  BookOpen,
  Loader2
} from 'lucide-react';

interface UserProfile {
  full_name: string;
  bio: string;
  avatar_url?: string;
  user_role: string;
  experience_level: string;
  skills: string[];
  interests: string[];
  learning_goals: string[];
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  preferred_learning_style: string;
  location?: string;
}

export function UserProfileCard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const profileData = await userProfileService.getUserProfile(user.id);
      if (profileData) {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm border p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Complete Your Profile</h3>
              <p className="text-sm text-gray-600">
                Add your information to personalize your learning experience
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate('/profile')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            Complete Profile
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-white to-blue-50 shadow-lg border-2 border-blue-100">
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                  {profile.full_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            {/* Name and Role */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile.full_name}</h2>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Briefcase className="w-4 h-4" />
                <span className="font-medium">{profile.user_role}</span>
                <span>•</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {profile.experience_level}
                </Badge>
              </div>
              {profile.location && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Code className="w-4 h-4 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Skills</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.slice(0, 5).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {profile.skills.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{profile.skills.length - 5} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Interests</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.interests.slice(0, 5).map((interest, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-purple-50 text-purple-700">
                    {interest}
                  </Badge>
                ))}
                {profile.interests.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{profile.interests.length - 5} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Learning Goals */}
          {profile.learning_goals && profile.learning_goals.length > 0 && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-green-600" />
                <h3 className="font-semibold text-gray-900">Goals</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.learning_goals.slice(0, 3).map((goal, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-green-50 text-green-700">
                    {goal}
                  </Badge>
                ))}
                {profile.learning_goals.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{profile.learning_goals.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Social Links & Learning Style */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          {/* Social Links */}
          <div className="flex items-center gap-3">
            {profile.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                title="GitHub"
              >
                <Github className="w-4 h-4 text-gray-700" />
              </a>
            )}
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-blue-700" />
              </a>
            )}
            {profile.twitter_url && (
              <a
                href={profile.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-sky-100 hover:bg-sky-200 transition"
                title="Twitter"
              >
                <Twitter className="w-4 h-4 text-sky-700" />
              </a>
            )}
          </div>

          {/* Learning Style */}
          {profile.preferred_learning_style && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Learning Style:</span>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                {profile.preferred_learning_style}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
