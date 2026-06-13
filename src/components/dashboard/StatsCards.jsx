import React from 'react';
import { Card, CardHeader } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function StatsCards({ title, value, icon: Icon, gradient, trend }) {
  return (
    <Card className="relative overflow-hidden border-0 bg-white/60 backdrop-blur-sm shadow-md">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-r ${gradient} opacity-10 rounded-full transform translate-x-8 -translate-y-8`} />
      <CardHeader className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl md:text-3xl font-bold mt-2 text-gray-900">
              {value}
            </h3>
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} bg-opacity-20`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        {trend && (
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
            <span className="text-green-600 font-medium">{trend}</span>
          </div>
        )}
      </CardHeader>
    </Card>
  );
}