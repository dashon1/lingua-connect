import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { LearningGoal } from "@/api/entities";
import { Target, Calendar, TrendingUp, CheckCircle2, Plus } from "lucide-react";
import { format, differenceInDays } from "date-fns";

export default function GoalCard({ goal, onUpdate }) {
  const progress = Math.min(Math.round((goal.current_value / goal.target_value) * 100), 100);
  const daysLeft = goal.deadline ? differenceInDays(new Date(goal.deadline), new Date()) : null;
  const isCompleted = goal.status === 'completed';

  const goalTypeColors = {
    vocabulary: "bg-blue-100 text-blue-800",
    grammar: "bg-green-100 text-green-800",
    pronunciation: "bg-purple-100 text-purple-800",
    fluency: "bg-orange-100 text-orange-800",
    cultural_understanding: "bg-pink-100 text-pink-800",
    business: "bg-indigo-100 text-indigo-800",
    conversation: "bg-yellow-100 text-yellow-800",
    reading: "bg-cyan-100 text-cyan-800",
    writing: "bg-red-100 text-red-800"
  };

  const handleIncrementProgress = async () => {
    if (goal.current_value < goal.target_value) {
      const newValue = goal.current_value + 1;
      const updates = { current_value: newValue };
      
      if (newValue >= goal.target_value) {
        updates.status = 'completed';
        updates.completed_date = new Date().toISOString().split('T')[0];
      }

      await LearningGoal.update(goal.id, updates);
      onUpdate();
    }
  };

  return (
    <Card className={`bg-white/60 backdrop-blur-sm border-0 shadow-md transition-all ${isCompleted ? 'opacity-75' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
              {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-500" />}
            </div>
            <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={goalTypeColors[goal.goal_type] || "bg-gray-100 text-gray-800"}>
                {goal.goal_type.replace(/_/g, ' ')}
              </Badge>
              <Badge variant="outline">{goal.language}</Badge>
              {daysLeft !== null && daysLeft >= 0 && !isCompleted && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {daysLeft === 0 ? 'Due today' : `${daysLeft} days left`}
                </Badge>
              )}
            </div>
          </div>
          {!isCompleted && (
            <Button
              size="sm"
              onClick={handleIncrementProgress}
              disabled={goal.current_value >= goal.target_value}
              className="bg-orange-500 hover:bg-orange-600 shrink-0"
            >
              <Plus className="w-4 h-4 mr-1" />
              Progress
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-semibold text-gray-900">
              {goal.current_value} / {goal.target_value}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{progress}% complete</span>
            {goal.completed_date && (
              <span>Completed on {format(new Date(goal.completed_date), 'MMM d, yyyy')}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}