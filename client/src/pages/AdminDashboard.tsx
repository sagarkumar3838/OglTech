import { useState, useEffect } from 'react';
import { getAllScorecards } from '../services/api';
import { Users, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Scorecard {
  id?: string;
  candidate_name: string;
  skill: string;
  level_attempted: string;
  overall_score: number;
  hiring_recommendation: 'STRONG_HIRE' | 'CONSIDER' | 'NO_HIRE';
}

const AdminDashboard = () => {
  const [scorecards, setScorecards] = useState<Scorecard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScorecards();
  }, []);

  const loadScorecards = async () => {
    try {
      const response = await getAllScorecards();
      setScorecards(response.data.scorecards);
    } catch (error) {
      console.error('Error loading scorecards:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationBadge = (rec: string) => {
    const colors: Record<string, string> = {
      STRONG_HIRE: 'bg-green-100 text-green-800',
      CONSIDER: 'bg-yellow-100 text-yellow-800',
      NO_HIRE: 'bg-red-100 text-red-800'
    };
    return colors[rec] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Evaluations</p>
              <p className="text-2xl font-bold">{scorecards.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold">
                {scorecards.length > 0
                  ? Math.round(
                      scorecards.reduce((sum, s) => sum + s.overall_score, 0) / scorecards.length
                    )
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Strong Hires</p>
              <p className="text-2xl font-bold">
                {scorecards.filter((s) => s.hiring_recommendation === 'STRONG_HIRE').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scorecards Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Recent Evaluations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Skill
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Recommendation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {scorecards.map((scorecard) => (
                <tr key={scorecard.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{scorecard.candidate_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {scorecard.skill}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {scorecard.level_attempted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg font-semibold text-primary">
                      {scorecard.overall_score}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getRecommendationBadge(
                        scorecard.hiring_recommendation
                      )}`}
                    >
                      {scorecard.hiring_recommendation?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      to={`/scorecard/${scorecard.id}`}
                      className="text-primary hover:underline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
