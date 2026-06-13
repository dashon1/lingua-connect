import React, { useState, useEffect } from "react";
import { LearningGoal, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import { format, differenceInDays } from "date-fns";

import GoalCard from "../components/goals/GoalCard";
import CreateGoalModal from "../components/goals/CreateGoalModal";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const userGoals = await LearningGoal.filter(
        { created_by: currentUser.email },
        "-created_date"
      );
      setGoals(userGoals);
    } catch (error) {
      console.error("Error loading goals:", error);
    }
    setIsLoading(false);
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  const stats = {
    active: activeGoals.length,
    completed: completedGoals.length,
    totalProgress: activeGoals.length > 0 
      ? Math.round(activeGoals.reduce((sum, g) => sum + (g.current_value / g.target_value * 100), 0) / activeGoals.length)
      : 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Learning Goals
            </h1>
            <p className="text-gray-600 text-lg">
              Set targets and track your language learning progress
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            New Goal
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Goals</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.active}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg Progress</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalProgress}%</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {activeGoals.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Active Goals</h2>
            <div className="grid gap-4">
              {activeGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} onUpdate={loadGoals} />
              ))}
            </div>
          </div>
        ) : (
          <Card className="text-center py-16 bg-white/60 backdrop-blur-sm border-0 shadow-md">
            <CardContent>
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No active goals yet
              </h3>
              <p className="text-gray-500 mb-6">
                Set your first learning goal to track your progress
              </p>
              <Button onClick={() => setShowCreateModal(true)} className="bg-orange-500 hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        )}

        {completedGoals.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Completed Goals
            </h2>
            <div className="grid gap-4">
              {completedGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} onUpdate={loadGoals} />
              ))}
            </div>
          </div>
        )}

        <CreateGoalModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreated={loadGoals}
        />
      </div>
    </div>
  );
}