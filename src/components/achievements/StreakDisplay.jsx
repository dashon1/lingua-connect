import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, TrendingUp, Calendar } from "lucide-react";

export default function StreakDisplay({ streak }) {
  return (
    <Card className="bg-gradient-to-br from-orange-400 to-red-500 text-white border-0 shadow-lg mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Flame className="w-6 h-6" />
          Practice Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{streak.current_streak || 0}</div>
            <p className="text-white/80 text-sm">Current Streak (days)</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{streak.longest_streak || 0}</div>
            <p className="text-white/80 text-sm">Longest Streak</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{streak.total_practice_days || 0}</div>
            <p className="text-white/80 text-sm">Total Practice Days</p>
          </div>
        </div>
        {streak.streak_frozen && (
          <div className="mt-4 p-3 bg-white/20 rounded-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm">Your streak is protected today!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}