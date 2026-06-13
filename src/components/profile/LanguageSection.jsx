import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Plus, X } from "lucide-react";

const LANGUAGE_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'elementary', label: 'Elementary' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'upper_intermediate', label: 'Upper Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

export default function LanguageSection({ formData, onChange }) {
  const [newNativeLanguage, setNewNativeLanguage] = useState('');
  const [newLearningLanguage, setNewLearningLanguage] = useState({
    language: '',
    level: 'beginner',
    goals: []
  });
  const [newGoal, setNewGoal] = useState('');

  const addNativeLanguage = () => {
    if (newNativeLanguage.trim() && !formData.native_languages.includes(newNativeLanguage.trim())) {
      onChange({
        ...formData,
        native_languages: [...formData.native_languages, newNativeLanguage.trim()]
      });
      setNewNativeLanguage('');
    }
  };

  const removeNativeLanguage = (language) => {
    onChange({
      ...formData,
      native_languages: formData.native_languages.filter(lang => lang !== language)
    });
  };

  const addLearningLanguage = () => {
    if (newLearningLanguage.language.trim()) {
      onChange({
        ...formData,
        learning_languages: [...formData.learning_languages, newLearningLanguage]
      });
      setNewLearningLanguage({ language: '', level: 'beginner', goals: [] });
    }
  };

  const removeLearningLanguage = (index) => {
    onChange({
      ...formData,
      learning_languages: formData.learning_languages.filter((_, i) => i !== index)
    });
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setNewLearningLanguage({
        ...newLearningLanguage,
        goals: [...newLearningLanguage.goals, newGoal.trim()]
      });
      setNewGoal('');
    }
  };

  const removeGoal = (goal) => {
    setNewLearningLanguage({
      ...newLearningLanguage,
      goals: newLearningLanguage.goals.filter(g => g !== goal)
    });
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-orange-500" />
          Languages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Native Languages */}
        <div>
          <Label className="text-base font-medium">Native Languages *</Label>
          <p className="text-sm text-gray-600 mb-3">Languages you speak fluently</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.native_languages.map((language) => (
              <Badge key={language} className="bg-green-100 text-green-800 px-3 py-1">
                {language}
                <button
                  onClick={() => removeNativeLanguage(language)}
                  className="ml-2 hover:text-green-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="e.g., English, Spanish, Mandarin"
              value={newNativeLanguage}
              onChange={(e) => setNewNativeLanguage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addNativeLanguage()}
              className="flex-1"
            />
            <Button type="button" onClick={addNativeLanguage} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Learning Languages */}
        <div>
          <Label className="text-base font-medium">Languages I'm Learning</Label>
          <p className="text-sm text-gray-600 mb-3">Languages you want to practice</p>
          
          {formData.learning_languages.length > 0 && (
            <div className="space-y-3 mb-4">
              {formData.learning_languages.map((lang, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <span className="font-medium">{lang.language}</span>
                    <Badge variant="outline" className="ml-2 capitalize">
                      {lang.level.replace('_', ' ')}
                    </Badge>
                    {lang.goals && lang.goals.length > 0 && (
                      <div className="mt-1 text-sm text-gray-600">
                        Goals: {lang.goals.join(', ')}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLearningLanguage(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="learning-language">Language</Label>
                <Input
                  id="learning-language"
                  placeholder="e.g., French, Japanese"
                  value={newLearningLanguage.language}
                  onChange={(e) => setNewLearningLanguage({...newLearningLanguage, language: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="learning-level">Current Level</Label>
                <Select
                  value={newLearningLanguage.level}
                  onValueChange={(value) => setNewLearningLanguage({...newLearningLanguage, level: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGE_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mb-4">
              <Label>Learning Goals</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {newLearningLanguage.goals.map((goal) => (
                  <Badge key={goal} variant="outline" className="px-2 py-1">
                    {goal}
                    <button
                      onClick={() => removeGoal(goal)}
                      className="ml-1 hover:text-gray-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., improve pronunciation, learn business terms"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                  className="flex-1"
                />
                <Button type="button" onClick={addGoal} size="sm" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <Button
              type="button"
              onClick={addLearningLanguage}
              disabled={!newLearningLanguage.language.trim()}
              size="sm"
              className="w-full"
            >
              Add Learning Language
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}