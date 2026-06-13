
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Users, Calendar, Settings, Zap } from "lucide-react";

export default function QuickActions({ profile }) {
  const actions = [
    {
      title: "Find Partners",
      description: "Browse native speakers",
      icon: Users,
      href: createPageUrl("FindPartners"),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Schedule Session",
      description: "Book your next practice",
      icon: Calendar,
      href: createPageUrl("FindPartners"), // Changed from "Sessions" to "FindPartners" as per outline
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: profile ? "Edit Profile" : "Setup Profile",
      description: profile ? "Update your info" : "Complete your profile",
      icon: Settings,
      href: createPageUrl("Profile"),
      color: "bg-purple-500 hover:bg-purple-600"
    }
  ];

  return (
    <Card className="shadow-md border-0 bg-white/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="w-5 h-5 text-yellow-500" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Link key={index} to={action.href} className="block">
              <Button 
                variant="outline" 
                className="w-full justify-start h-auto p-4 border-gray-200 hover:border-gray-300 transition-all duration-200"
              >
                <div className={`p-2 rounded-lg ${action.color} mr-3`}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium">{action.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
