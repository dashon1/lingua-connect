import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { VocabularyItem } from "@/api/entities";
import { RotateCcw, ChevronRight, X, CheckCircle2, XCircle } from "lucide-react";

export default function FlashcardMode({ vocabulary, onClose, onUpdate }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  const currentCard = vocabulary[currentIndex];
  const progress = ((currentIndex + 1) / vocabulary.length) * 100;

  const handleNext = async (knew) => {
    if (knew && currentCard.mastery_level < 5) {
      await VocabularyItem.update(currentCard.id, {
        mastery_level: currentCard.mastery_level + 1,
        last_reviewed: new Date().toISOString().split('T')[0],
        times_reviewed: (currentCard.times_reviewed || 0) + 1
      });
      onUpdate();
    }

    setShowAnswer(false);
    setReviewedCount(reviewedCount + 1);
    
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  if (!currentCard) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Flashcard Practice</h3>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{currentIndex + 1} / {vocabulary.length}</span>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Progress value={progress} className="h-2" />

          <Card className="min-h-[300px] flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50 border-2 border-orange-200 cursor-pointer" onClick={() => setShowAnswer(!showAnswer)}>
            <CardContent className="p-12 text-center">
              <div className="text-4xl font-bold text-gray-900 mb-4">
                {currentCard.word}
              </div>
              <div className="text-sm text-gray-500 mb-6">
                {currentCard.language}
              </div>
              
              {showAnswer ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  {currentCard.translation && (
                    <p className="text-2xl text-gray-700">{currentCard.translation}</p>
                  )}
                  {currentCard.definition && (
                    <p className="text-gray-600">{currentCard.definition}</p>
                  )}
                  {currentCard.example_sentence && (
                    <p className="text-sm text-gray-500 italic bg-white/50 p-3 rounded">
                      "{currentCard.example_sentence}"
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-400">Click to reveal answer</p>
              )}
            </CardContent>
          </Card>

          {showAnswer && (
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleNext(false)}
                className="flex-1 border-red-200 hover:bg-red-50"
              >
                <XCircle className="w-5 h-5 mr-2 text-red-500" />
                Need to Review
              </Button>
              <Button
                size="lg"
                onClick={() => handleNext(true)}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                I Knew This
              </Button>
            </div>
          )}

          {!showAnswer && (
            <div className="text-center">
              <Button variant="outline" onClick={() => setShowAnswer(true)}>
                Show Answer
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}