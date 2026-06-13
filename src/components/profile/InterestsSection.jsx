import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, X } from "lucide-react";

const COMMON_INTERESTS = [
  'Travel', 'Music', 'Movies', 'Books', 'Cooking', 'Sports', 'Technology',
  'Art', 'Photography', 'Gaming', 'Business', 'Science', 'Culture', 'Fashion',
  'Food', 'History', 'Nature', 'Fitness'
];

export default function InterestsSection({ formData, onChange }) {
  const [newInterest, setNewInterest] = useState('');

  const addInterest = (interest) => {
    if (interest.trim() && !formData.interests.includes(interest.trim())) {
      onChange({
        ...formData,
        interests: [...formData.interests, interest.trim()]
      });
    }
  };

  const removeInterest = (interest) => {
    onChange({
      ...formData,
      interests: formData.interests.filter(int => int !== interest)
    });
  };

  const addCustomInterest = () => {
    if (newInterest.trim()) {
      addInterest(newInterest);
      setNewInterest('');
    }
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-orange-500" />
          Interests & Hobbies
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium">Your Interests</Label>
          <p className="text-sm text-gray-600 mb-4">
            Add topics you enjoy discussing to help find compatible conversation partners
          </p>
          
          {formData.interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.interests.map((interest) => (
                <Badge key={interest} className="bg-purple-100 text-purple-800 px-3 py-1">
                  {interest}
                  <button
                    onClick={() => removeInterest(interest)}
                    className="ml-2 hover:text-purple-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          
          <div className="mb-4">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Popular Topics</Label>
            <div className="flex flex-wrap gap-2">
              {COMMON_INTERESTS
                .filter(interest => !formData.interests.includes(interest))
                .map((interest) => (
                <Button
                  key={interest}
                  variant="outline"
                  size="sm"
                  onClick={() => addInterest(interest)}
                  className="hover:bg-orange-50 hover:border-orange-200"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {interest}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Add a custom interest..."
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
              className="flex-1"
            />
            <Button type="button" onClick={addCustomInterest} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}