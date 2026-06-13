import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VocabularyItem } from "@/api/entities";

export default function AddVocabModal({ open, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    language: '',
    word: '',
    translation: '',
    definition: '',
    example_sentence: '',
    difficulty: 'medium'
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await VocabularyItem.create({
        ...formData,
        mastery_level: 0,
        times_reviewed: 0
      });
      
      setFormData({
        language: '',
        word: '',
        translation: '',
        definition: '',
        example_sentence: '',
        difficulty: 'medium'
      });
      
      onCreated();
      onClose();
    } catch (error) {
      console.error("Error adding vocabulary:", error);
      alert("Failed to add word. Please try again.");
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Vocabulary</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="word">Word/Phrase *</Label>
              <Input
                id="word"
                placeholder="e.g., buenos días"
                value={formData.word}
                onChange={(e) => setFormData({...formData, word: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="language">Language *</Label>
              <Input
                id="language"
                placeholder="e.g., Spanish"
                value={formData.language}
                onChange={(e) => setFormData({...formData, language: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="translation">Translation</Label>
            <Input
              id="translation"
              placeholder="e.g., good morning"
              value={formData.translation}
              onChange={(e) => setFormData({...formData, translation: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="definition">Definition/Explanation</Label>
            <Textarea
              id="definition"
              placeholder="What does it mean? When to use it?"
              value={formData.definition}
              onChange={(e) => setFormData({...formData, definition: e.target.value})}
              className="h-20"
            />
          </div>

          <div>
            <Label htmlFor="example">Example Sentence</Label>
            <Textarea
              id="example"
              placeholder="Use the word in a sentence"
              value={formData.example_sentence}
              onChange={(e) => setFormData({...formData, example_sentence: e.target.value})}
              className="h-20"
            />
          </div>

          <div>
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select value={formData.difficulty} onValueChange={(value) => setFormData({...formData, difficulty: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.word || !formData.language || isSaving}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isSaving ? "Adding..." : "Add Word"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}