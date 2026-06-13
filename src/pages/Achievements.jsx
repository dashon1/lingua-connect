import React, { useState, useEffect } from "react";
import { Achievement, User, PracticeStreak, ConversationSession } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Star, Flame, Target, Users, TrendingUp } from "lucide-react";

import AchievementCard from "../components/achievements/AchievementCard";
import StreakDisplay from "../components/achievements/StreakDisplay";

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [streak, setStreak] = useState(null);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const userAchievements = await Achievement.filter(
        { created_by: currentUser.email },
        "-date_earned"
      );
      setAchievements(userAchievements);

      const streakData = await PracticeStreak.filter({ created_by: currentUser.email });
      if (streakData.length > 0) {
        setStreak(streakData[0]);
      }

      const sessions = await ConversationSession.filter({
        $or: [
          { learner_id: currentUser.id },
          { partner_id: currentUser.id }
        ]
      });

      setStats({
        totalPoints: userAchievements.reduce((sum, a) => sum + (a.points || 0), 0),
        totalAchievements: userAchievements.length,
        completedSessions: sessions.filter(s => s.status === 'completed').length
      });

    } catch (error) {
      console.error("Error loading achievements:", error);
    }
    setIsLoading(false);
  };

  const categories = {
    sessions: { icon: Target, label: "Sessions", color: "blue" },
    streak: { icon: Flame, label: "Streaks", color: "orange" },
    vocabulary: { icon: Star, label: "Vocabulary", color: "yellow" },
    rating: { icon: Award, label: "Ratings", color: "purple" },
    languages: { icon: Users, label: "Languages", color: "green" },
    social: { icon: TrendingUp, label: "Social", color: "pink" }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Achievements
          </h1>
          <p className="text-gray-600 text-lg">
            Track your milestones and earn rewards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Total Points</p>
                  <p className="text-4xl font-bold">{stats.totalPoints || 0}</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Trophy className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Achievements Earned</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.totalAchievements || 0}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Sessions Completed</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.completedSessions || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {streak && <StreakDisplay streak={streak} />}

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Achievements</h2>
          
          {achievements.length > 0 ? (
            <div>
              {Object.entries(categories).map(([key, { icon: Icon, label, color }]) => {
                const categoryAchievements = achievements.filter(a => a.category === key);
                if (categoryAchievements.length === 0) return null;

                return (
                  <div key={key} className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`w-8 h-8 bg-${color}-100 rounded-full flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 text-${color}-600`} />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">{label}</h3>
                      <Badge variant="outline">{categoryAchievements.length}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryAchievements.map((achievement) => (
                        <AchievementCard key={achievement.id} achievement={achievement} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Card className="text-center py-16 bg-white/60 backdrop-blur-sm border-0 shadow-md">
              <CardContent>
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No achievements yet
                </h3>
                <p className="text-gray-500">
                  Complete sessions and reach milestones to earn your first achievement
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}