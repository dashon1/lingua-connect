
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Video, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function UpcomingSessions({ sessions, isLoading, currentUserId }) {
  if (isLoading) {
    return (
      <Card className="shadow-md border-0 bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            Upcoming Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-lg border animate-pulse">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md border-0 bg-white/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="w-5 h-5 text-orange-500" />
          Upcoming Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center gap-4 p-4 rounded-lg border border-orange-100 bg-white/40">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                    {session.language?.[0]?.toUpperCase() || 'L'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium truncate">
                      {session.language} Practice
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {session.duration_minutes}min
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(session.scheduled_date), 'MMM d, h:mm a')}
                    </div>
                  </div>
                </div>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 shrink-0" onClick={() => alert("Joining session... (feature in development)")}>
                  <Video className="w-4 h-4 mr-1" />
                  Join
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No upcoming sessions</p>
            <Link to={createPageUrl("FindPartners")}>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                Schedule a Session
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
