import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Star, Flame, Target, Users, BookOpen, TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default function AchievementCard({ achievement }) {
  const iconMap = {
    trophy: Trophy,
    award: Award,
    star: Star,
    flame: Flame,
    target: Target,
    users: Users,
    book: BookOpen,
    trending: TrendingUp
  };

  const Icon = iconMap[achievement.icon] || Trophy;

  const categoryColors = {
    sessions: "from-blue-400 to-blue-600",
    streak: "from-orange-400 to-red-500",
    vocabulary: "from-yellow-400 to-orange-500",
    rating: "from-purple-400 to-pink-500",
    languages: "from-green-400 to-emerald-600",
    social: "from-pink-400 to-rose-500"
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${categoryColors[achievement.category] || categoryColors.sessions} flex items-center justify-center shrink-0 shadow-lg`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1">{achievement.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                +{achievement.points} points
              </Badge>
              {achievement.date_earned && (
                <span className="text-xs text-gray-500">
                  {format(new Date(achievement.date_earned), 'MMM d, yyyy')}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}