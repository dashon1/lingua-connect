import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Users, Calendar, Settings } from "lucide-react";

export default function WelcomeHero({ user, profile }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white shadow-xl">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full transform translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full transform -translate-x-24 translate-y-24"></div>
      
      <div className="relative p-6 md:p-8">
        <div className="max-w-4xl">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            Welcome back{user?.full_name ? `, ${user.full_name}` : ''}! 👋
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-6">
            {profile?.learning_languages?.length > 0 
              ? `Continue practicing ${profile.learning_languages.map(l => l.language).join(', ')} with native speakers`
              : "Ready to start your language learning journey?"
            }
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to={createPageUrl("FindPartners")}>
              <Button size="lg" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 text-white">
                <Users className="w-5 h-5 mr-2" />
                Find Partners
              </Button>
            </Link>
            <Link to={createPageUrl("Sessions")}>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Calendar className="w-5 h-5 mr-2" />
                View Sessions
              </Button>
            </Link>
            {!profile && (
              <Link to={createPageUrl("Profile")}>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Settings className="w-5 h-5 mr-2" />
                  Complete Profile
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}