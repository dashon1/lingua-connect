import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function CancelledSessions({ sessions, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(2).fill(0).map((_, i) => (
          <Card key={i} className="bg-white/60 backdrop-blur-sm border-0 opacity-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 animate-pulse">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card className="text-center py-16 bg-white/60 backdrop-blur-sm border-0 shadow-md">
        <CardContent>
          <XCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No cancelled sessions
          </h3>
          <p className="text-gray-500">
            All your sessions are on track.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <Card key={session.id} className="bg-white/60 backdrop-blur-sm border-0 shadow-md opacity-60">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-gray-300 text-gray-600 font-semibold">
                    {session.language?.[0]?.toUpperCase() || 'L'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg text-gray-700 line-through">
                    {session.language} Practice
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(session.scheduled_date), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {session.duration_minutes}min
                    </div>
                  </div>
                </div>
              </div>
              <Badge variant="destructive">Cancelled</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}