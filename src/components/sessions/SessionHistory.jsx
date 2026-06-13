
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, Star, MessageCircle, Repeat, Edit2 } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ReviewModal from './ReviewModal';

export default function SessionHistory({ sessions, currentUserId, isLoading, onSessionUpdate }) {
  const navigate = useNavigate();
  const [reviewingSession, setReviewingSession] = useState(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i} className="bg-white/60 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 animate-pulse">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <Skeleton className="h-8 w-24" />
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
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No session history yet
          </h3>
          <p className="text-gray-500 mb-6">
            Complete your first session to see your practice history
          </p>
          <Link to={createPageUrl("FindPartners")}>
            <Button className="bg-orange-500 hover:bg-orange-600">
              Schedule First Session
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const handleReviewSaved = () => {
    setReviewingSession(null);
    onSessionUpdate();
  }

  return (
    <>
      <div className="space-y-4">
        {sessions.map((session) => {
          const isLearner = session.learner_id === currentUserId;
          const sessionDate = new Date(session.scheduled_date);
          const hasRated = isLearner ? !!session.learner_rating : !!session.partner_rating;

          return (
            <Card key={session.id} className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold">
                        {session.language?.[0]?.toUpperCase() || 'L'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{session.language} Practice</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(sessionDate, 'MMM d, yyyy')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {session.duration_minutes}min
                        </div>
                      </div>
                      
                      {(session.learner_rating || session.partner_rating) && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">
                              {isLearner ? session.partner_rating : session.learner_rating || 'Not rated'}
                            </span>
                          </div>
                          {session.topics_covered && session.topics_covered.length > 0 && (
                            <div className="flex gap-1">
                              {session.topics_covered.slice(0, 2).map((topic, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4 sm:mt-0 shrink-0">
                    {!hasRated && (
                      <Button size="sm" onClick={() => setReviewingSession(session)}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Leave Review
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="border-orange-200 hover:bg-orange-50" onClick={() => navigate(createPageUrl("FindPartners"))}>
                      <Repeat className="w-4 h-4 mr-2" />
                      Book Again
                    </Button>
                  </div>
                </div>
                
                {(session.learner_feedback || session.partner_feedback) && (
                  <div className="mt-4 p-3 bg-gray-50/50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Your Feedback:</strong> {isLearner ? session.learner_feedback : session.partner_feedback}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Partner's Feedback:</strong> {isLearner ? session.partner_feedback : session.learner_feedback}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <ReviewModal
        session={reviewingSession}
        isLearner={reviewingSession?.learner_id === currentUserId}
        onClose={() => setReviewingSession(null)}
        onSave={handleReviewSaved}
      />
    </>
  );
}
