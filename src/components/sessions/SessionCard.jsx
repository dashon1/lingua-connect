
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Video, XCircle, Settings, Trash2 } from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";
import { ConversationSession } from "@/api/entities";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export default function SessionCard({ session, currentUserId, onSessionUpdate }) {
  const [isCancelling, setIsCancelling] = useState(false);
  const isLearner = session.learner_id === currentUserId;
  const partnerName = isLearner ? "Language Partner" : "Language Learner";
  
  const getDateLabel = (date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, 'MMM d');
  };

  const sessionDate = new Date(session.scheduled_date);

  const handleCancelSession = async () => {
    if (window.confirm("Are you sure you want to cancel this session?")) {
      setIsCancelling(true);
      try {
        await ConversationSession.update(session.id, { status: "cancelled" });
        onSessionUpdate(); // Refresh the list
      } catch (error) {
        console.error("Failed to cancel session:", error);
        alert("Could not cancel the session. Please try again.");
      }
      setIsCancelling(false);
    }
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                {session.language?.[0]?.toUpperCase() || 'L'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{session.language} Practice</h3>
              <p className="text-gray-600">with {partnerName}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {getDateLabel(sessionDate)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {format(sessionDate, 'h:mm a')}
                </div>
                <Badge variant="outline">
                  {session.duration_minutes}min
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="border-orange-200 hover:bg-orange-50">
                  <Settings className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleCancelSession} disabled={isCancelling} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isCancelling ? "Cancelling..." : "Cancel Session"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={() => alert("Joining session... (feature in development)")}>
              <Video className="w-4 h-4 mr-2" />
              Join Session
            </Button>
          </div>
        </div>

        {session.session_notes && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Notes:</strong> {session.session_notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
