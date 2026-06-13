
import React, { useState, useEffect } from "react";
import { ConversationSession, LanguageProfile, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Calendar,
  Clock,
  Users,
  MessageCircle,
  Globe,
  TrendingUp,
  BookOpen,
  Star
} from "lucide-react";
import { format } from "date-fns";

import WelcomeHero from "../components/dashboard/WelcomeHero";
import StatsCards from "../components/dashboard/StatsCards";
import UpcomingSessions from "../components/dashboard/UpcomingSessions";
import ProgressChart from "../components/dashboard/ProgressChart";
import QuickActions from "../components/dashboard/QuickActions";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      // Load user's language profile
      const profiles = await LanguageProfile.filter({ created_by: currentUser.email });
      if (profiles.length > 0) {
        setProfile(profiles[0]);
      }

      // Load upcoming sessions
      const upcoming = await ConversationSession.filter(
        { 
          $or: [
            { learner_id: currentUser.id },
            { partner_id: currentUser.id }
          ],
          status: "scheduled"
        }, 
        "scheduled_date", 
        5
      );
      setUpcomingSessions(upcoming);

      // Load recent completed sessions
      const recent = await ConversationSession.filter(
        { 
          $or: [
            { learner_id: currentUser.id },
            { partner_id: currentUser.id }
          ],
          status: "completed"
        }, 
        "-scheduled_date", 
        10
      );
      setRecentSessions(recent);

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const getStats = () => {
    const totalSessions = profile?.total_sessions || 0;
    const thisMonthSessions = recentSessions.filter(session => {
      const sessionDate = new Date(session.scheduled_date);
      const now = new Date();
      return sessionDate.getMonth() === now.getMonth() && sessionDate.getFullYear() === now.getFullYear();
    }).length;

    const averageRating = profile?.average_rating || 0;
    const languagesLearning = profile?.learning_languages?.length || 0;

    return {
      totalSessions,
      thisMonthSessions,
      averageRating,
      languagesLearning
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <WelcomeHero user={user} profile={profile} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCards
            title="Total Sessions"
            value={stats.totalSessions}
            icon={MessageCircle}
            gradient="from-blue-500 to-blue-600"
            trend={`+${stats.thisMonthSessions} this month`}
          />
          <StatsCards
            title="Languages Learning"
            value={stats.languagesLearning}
            icon={Globe}
            gradient="from-green-500 to-green-600"
          />
          <StatsCards
            title="Average Rating"
            value={stats.averageRating.toFixed(1)}
            icon={Star}
            gradient="from-yellow-500 to-orange-500"
          />
          <StatsCards
            title="Upcoming Sessions"
            value={upcomingSessions.length}
            icon={Calendar}
            gradient="from-purple-500 to-pink-500"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <UpcomingSessions 
              sessions={upcomingSessions} 
              isLoading={isLoading}
              currentUserId={user?.id}
            />
            <ProgressChart sessions={recentSessions} />
          </div>
          
          <div className="space-y-6">
            <QuickActions profile={profile} />
            
            <Card className="shadow-md border-0 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="w-5 h-5 text-orange-500" />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile?.learning_languages?.length > 0 ? (
                  <div className="space-y-4">
                    {profile.learning_languages.map((lang, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{lang.language}</p>
                          <p className="text-sm text-gray-500 capitalize">{lang.level}</p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {lang.level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Globe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No languages added yet</p>
                    <Link to={createPageUrl("Profile")}>
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                        Set Learning Goals
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
