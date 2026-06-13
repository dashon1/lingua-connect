import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ConversationSession, User } from "@/api/entities";
import { MapPin, Star, Clock, MessageCircle, Calendar, Send } from "lucide-react";

export default function PartnerModal({ partner, onClose }) {
  const [isBooking, setIsBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    duration: 30,
    language: '',
    message: ''
  });

  if (!partner) return null;

  const handleBookSession = async () => {
    setIsBooking(true);
    try {
      const currentUser = await User.me();
      const scheduledDateTime = new Date(`${bookingData.date}T${bookingData.time}`);
      
      await ConversationSession.create({
        learner_id: currentUser.id,
        partner_id: partner.user.id,
        language: bookingData.language,
        scheduled_date: scheduledDateTime.toISOString(),
        duration_minutes: bookingData.duration,
        status: 'scheduled'
      });

      onClose();
      // You could show a success message here
    } catch (error) {
      console.error("Error booking session:", error);
    }
    setIsBooking(false);
  };

  return (
    <Dialog open={!!partner} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={partner.user?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                {partner.user?.full_name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold">{partner.user?.full_name}</h3>
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <MapPin className="w-3 h-3" />
                {partner.country}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Rating and Stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="font-medium">
                {partner.average_rating ? partner.average_rating.toFixed(1) : 'New'}
              </span>
              <span className="text-sm text-gray-500">
                ({partner.total_sessions || 0} sessions)
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-4 h-4" />
              {partner.session_duration_preference || 30}min sessions
            </div>
          </div>

          {/* Languages */}
          <div>
            <h4 className="font-semibold mb-2">Native Languages</h4>
            <div className="flex flex-wrap gap-2">
              {partner.native_languages?.map((lang, index) => (
                <Badge key={index} className="bg-orange-100 text-orange-800">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>

          {/* Bio */}
          {partner.bio && (
            <div>
              <h4 className="font-semibold mb-2">About</h4>
              <p className="text-gray-600">{partner.bio}</p>
            </div>
          )}

          {/* Interests */}
          {partner.interests && partner.interests.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Interests</h4>
              <div className="flex flex-wrap gap-2">
                {partner.interests.map((interest, index) => (
                  <Badge key={index} variant="outline">{interest}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Booking Form */}
          <div className="border-t pt-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Book a Session
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={bookingData.time}
                  onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="language">Practice Language</Label>
                <Select
                  value={bookingData.language}
                  onValueChange={(value) => setBookingData({...bookingData, language: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {partner.native_languages?.map((lang) => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select
                  value={bookingData.duration.toString()}
                  onValueChange={(value) => setBookingData({...bookingData, duration: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="message">Message (optional)</Label>
              <Textarea
                id="message"
                placeholder="Introduce yourself or mention what you'd like to practice..."
                value={bookingData.message}
                onChange={(e) => setBookingData({...bookingData, message: e.target.value})}
                className="h-20"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleBookSession}
                disabled={!bookingData.date || !bookingData.time || !bookingData.language || isBooking}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {isBooking ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Book Session
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}