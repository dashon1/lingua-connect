import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { ConversationSession } from "@/api/entities";

export default function ReviewModal({ session, isLearner, onClose, onSave }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (!session) return null;

  const handleSaveReview = async () => {
    setIsSaving(true);
    try {
      const updateData = isLearner
        ? { learner_rating: rating, learner_feedback: feedback }
        : { partner_rating: rating, partner_feedback: feedback };
      
      await ConversationSession.update(session.id, updateData);
      
      // Note: Updating aggregate partner rating should ideally be a backend operation
      // to avoid race conditions. Here, we're just storing the review on the session.

      onSave();
    } catch (error) {
      console.error("Error saving review:", error);
      alert("Failed to save review. Please try again.");
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={!!session} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div>
            <Label>Rating</Label>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-8 h-8 cursor-pointer transition-colors ${
                    star <= rating 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="How was your session? What did you practice?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="mt-2 h-28"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSaveReview} disabled={rating === 0 || isSaving}>
            {isSaving ? "Saving..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}