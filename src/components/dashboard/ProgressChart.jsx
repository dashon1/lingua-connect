import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp } from "lucide-react";

export default function ProgressChart({ sessions }) {
  // Process sessions data for chart
  const getChartData = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const chartData = [];

    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthSessions = sessions.filter(session => {
        const sessionDate = new Date(session.scheduled_date);
        return sessionDate.getMonth() === month.getMonth() && 
               sessionDate.getFullYear() === month.getFullYear();
      });

      chartData.push({
        month: monthNames[month.getMonth()],
        sessions: monthSessions.length
      });
    }

    return chartData;
  };

  const data = getChartData();
  const totalSessions = sessions.length;

  return (
    <Card className="shadow-md border-0 bg-white/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Session Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {totalSessions > 0 ? (
          <div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="sessions" 
                  fill="url(#gradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#EA580C" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Total sessions completed: {totalSessions}
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              Complete your first session to see progress
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}