import React, { useState, useEffect } from "react";
import { ConversationSession, User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Video, Star, MessageCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import SessionCard from "../components/sessions/SessionCard";
import SessionHistory from "../components/sessions/SessionHistory";
import CancelledSessions from "../components/sessions/CancelledSessions";

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const allSessions = await ConversationSession.filter({
        $or: [
          { learner_id: currentUser.id },
          { partner_id: currentUser.id }
        ]
      }, "-scheduled_date");

      setSessions(allSessions);
    } catch (error) {
      console.error("Error loading sessions:", error);
    }
    setIsLoading(false);
  };

  const getSessionsByStatus = (status) => {
    return sessions.filter(session => session.status === status);
  };

  const upcomingSessions = getSessionsByStatus('scheduled');
  const completedSessions = getSessionsByStatus('completed');
  const cancelledSessions = getSessionsByStatus('cancelled');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            My Sessions
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your language practice sessions
          </p>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Upcoming ({upcomingSessions.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              History ({completedSessions.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Cancelled ({cancelledSessions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="grid gap-6">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    currentUserId={user?.id}
                    onSessionUpdate={loadSessions}
                  />
                ))
              ) : (
                <Card className="text-center py-16 bg-white/60 backdrop-blur-sm border-0 shadow-md">
                  <CardContent>
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No upcoming sessions
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Start connecting with language partners to schedule practice sessions
                    </p>
                    <Link to={createPageUrl("FindPartners")}>
                      <Button className="bg-orange-500 hover:bg-orange-600">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Find Partners
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <SessionHistory
              sessions={completedSessions}
              currentUserId={user?.id}
              isLoading={isLoading}
              onSessionUpdate={loadSessions}
            />
          </TabsContent>

          <TabsContent value="cancelled">
            <CancelledSessions
              sessions={cancelledSessions}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}