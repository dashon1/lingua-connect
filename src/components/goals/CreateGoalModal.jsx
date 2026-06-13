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
import { LearningGoal } from "@/api/entities";

export default function CreateGoalModal({ open, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    language: '',
    goal_type: '',
    title: '',
    description: '',
    target_value: '',
    deadline: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const goalTypes = [
    { value: 'vocabulary', label: 'Vocabulary' },
    { value: 'grammar', label: 'Grammar' },
    { value: 'pronunciation', label: 'Pronunciation' },
    { value: 'fluency', label: 'Fluency' },
    { value: 'conversation', label: 'Conversation' },
    { value: 'reading', label: 'Reading' },
    { value: 'writing', label: 'Writing' },
    { value: 'business', label: 'Business' },
    { value: 'cultural_understanding', label: 'Cultural Understanding' }
  ];

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await LearningGoal.create({
        ...formData,
        target_value: parseInt(formData.target_value),
        current_value: 0,
        status: 'active'
      });
      
      setFormData({
        language: '',
        goal_type: '',
        title: '',
        description: '',
        target_value: '',
        deadline: ''
      });
      
      onCreated();
      onClose();
    } catch (error) {
      console.error("Error creating goal:", error);
      alert("Failed to create goal. Please try again.");
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Learning Goal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="language">Language</Label>
              <Input
                id="language"
                placeholder="e.g., Spanish"
                value={formData.language}
                onChange={(e) => setFormData({...formData, language: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="goal_type">Goal Type</Label>
              <Select value={formData.goal_type} onValueChange={(value) => setFormData({...formData, goal_type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {goalTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Learn 100 new words"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What do you want to achieve?"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="target_value">Target Value</Label>
              <Input
                id="target_value"
                type="number"
                placeholder="100"
                value={formData.target_value}
                onChange={(e) => setFormData({...formData, target_value: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.language || !formData.goal_type || !formData.title || !formData.target_value || isSaving}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isSaving ? "Creating..." : "Create Goal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}