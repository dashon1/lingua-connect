
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Clock, MessageCircle } from "lucide-react";

export default function PartnerCard({ partner, onClick }) {
  return (
    <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-0 bg-white/70 backdrop-blur-sm" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={partner.user?.avatar_url} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-lg">
              {partner.user?.full_name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 truncate">
              {partner.user?.full_name || 'Language Partner'}
            </h3>
            <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
              <MapPin className="w-3 h-3" />
              {partner.country || 'Location not specified'}
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">
                {partner.average_rating ? partner.average_rating.toFixed(1) : 'New'}
              </span>
              <span className="text-xs text-gray-500 ml-1">
                ({partner.total_sessions || 0} sessions)
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Native Languages
            </p>
            <div className="flex flex-wrap gap-1">
              {partner.native_languages?.map((lang, index) => (
                <Badge key={index} className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>

          {partner.bio && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {partner.bio}
            </p>
          )}

          {partner.interests && partner.interests.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Interests
              </p>
              <div className="flex flex-wrap gap-1">
                {partner.interests.slice(0, 3).map((interest, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {interest}
                  </Badge>
                ))}
                {partner.interests.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{partner.interests.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            {partner.session_duration_preference || 30}min sessions
          </div>
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600 group-hover:bg-orange-600" onClick={(e) => { e.stopPropagation(); onClick(); }}>
            <MessageCircle className="w-4 h-4 mr-1" />
            Connect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
