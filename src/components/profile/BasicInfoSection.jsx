import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, MapPin } from "lucide-react";

export default function BasicInfoSection({ formData, onChange }) {
  return (
    <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-orange-500" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={formData.avatar_url} />
            <AvatarFallback className="bg-gradient-to-r from-orange-400 to-pink-400 text-white text-xl">
              {formData.full_name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Label htmlFor="avatar_url">Profile Picture URL</Label>
            <Input
              id="avatar_url"
              placeholder="https://example.com/your-photo.jpg"
              value={formData.avatar_url}
              onChange={(e) => onChange({...formData, avatar_url: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              placeholder="Your full name"
              value={formData.full_name}
              onChange={(e) => onChange({...formData, full_name: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              min="13"
              max="100"
              placeholder="25"
              value={formData.age}
              onChange={(e) => onChange({...formData, age: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="country">Country *</Label>
            <Input
              id="country"
              placeholder="e.g., United States"
              value={formData.country}
              onChange={(e) => onChange({...formData, country: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="location">City</Label>
            <Input
              id="location"
              placeholder="e.g., New York City"
              value={formData.location}
              onChange={(e) => onChange({...formData, location: e.target.value})}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="bio">About Me</Label>
          <Textarea
            id="bio"
            placeholder="Tell other users about yourself, your hobbies, and what you'd like to practice..."
            value={formData.bio}
            onChange={(e) => onChange({...formData, bio: e.target.value})}
            className="h-24"
          />
        </div>
      </CardContent>
    </Card>
  );
}