import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VocabularyItem } from "@/api/entities";
import { Star, BookOpen, TrendingUp } from "lucide-react";

export default function VocabCard({ item, onUpdate }) {
  const [showTranslation, setShowTranslation] = useState(false);

  const difficultyColors = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800"
  };

  const handleIncreaseMastery = async () => {
    if (item.mastery_level < 5) {
      await VocabularyItem.update(item.id, {
        mastery_level: item.mastery_level + 1,
        last_reviewed: new Date().toISOString().split('T')[0],
        times_reviewed: (item.times_reviewed || 0) + 1
      });
      onUpdate();
    }
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all cursor-pointer" onClick={() => setShowTranslation(!showTranslation)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{item.word}</h3>
            <Badge className="text-xs" variant="outline">{item.language}</Badge>
          </div>
          <Badge className={difficultyColors[item.difficulty] || difficultyColors.medium}>
            {item.difficulty}
          </Badge>
        </div>

        {showTranslation && (
          <div className="space-y-3 mb-4">
            {item.translation && (
              <p className="text-gray-700">
                <strong>Translation:</strong> {item.translation}
              </p>
            )}
            {item.definition && (
              <p className="text-gray-600 text-sm">{item.definition}</p>
            )}
            {item.example_sentence && (
              <p className="text-gray-600 text-sm italic bg-gray-50 p-2 rounded">
                "{item.example_sentence}"
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < item.mastery_level ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleIncreaseMastery();
            }}
            disabled={item.mastery_level >= 5}
            className="text-orange-600 hover:text-orange-700"
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Review
          </Button>
        </div>

        {item.times_reviewed > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            Reviewed {item.times_reviewed} {item.times_reviewed === 1 ? 'time' : 'times'}
          </p>
        )}
      </CardContent>
    </Card>
  );
}