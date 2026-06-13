import React, { useState, useEffect } from "react";
import { User, LanguageProfile } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon, Globe, Clock, MapPin, Plus, X, Save } from "lucide-react";

import BasicInfoSection from "../components/profile/BasicInfoSection";
import LanguageSection from "../components/profile/LanguageSection";
import AvailabilitySection from "../components/profile/AvailabilitySection";
import InterestsSection from "../components/profile/InterestsSection";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    // User data
    full_name: '',
    avatar_url: '',
    age: '',
    location: '',
    
    // Profile data
    native_languages: [],
    learning_languages: [],
    bio: '',
    country: '',
    timezone: '',
    interests: [],
    session_duration_preference: 30,
    is_available_for_sessions: true,
    availability: []
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const profiles = await LanguageProfile.filter({ created_by: currentUser.email });
      const currentProfile = profiles.length > 0 ? profiles[0] : null;
      setProfile(currentProfile);

      setFormData({
        full_name: currentUser.full_name || '',
        avatar_url: currentUser.avatar_url || '',
        age: currentUser.age || '',
        location: currentUser.location || '',
        native_languages: currentProfile?.native_languages || [],
        learning_languages: currentProfile?.learning_languages || [],
        bio: currentProfile?.bio || '',
        country: currentProfile?.country || '',
        timezone: currentProfile?.timezone || '',
        interests: currentProfile?.interests || [],
        session_duration_preference: currentProfile?.session_duration_preference || 30,
        is_available_for_sessions: currentProfile?.is_available_for_sessions ?? true,
        availability: currentProfile?.availability || []
      });
    } catch (error) {
      console.error("Error loading profile:", error);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update user data
      await User.updateMyUserData({
        full_name: formData.full_name,
        avatar_url: formData.avatar_url,
        age: formData.age ? parseInt(formData.age) : null,
        location: formData.location,
        profile_completed: true
      });

      // Update or create language profile
      const profileData = {
        native_languages: formData.native_languages,
        learning_languages: formData.learning_languages,
        bio: formData.bio,
        country: formData.country,
        timezone: formData.timezone,
        interests: formData.interests,
        session_duration_preference: formData.session_duration_preference,
        is_available_for_sessions: formData.is_available_for_sessions,
        availability: formData.availability
      };

      if (profile) {
        await LanguageProfile.update(profile.id, profileData);
      } else {
        await LanguageProfile.create(profileData);
      }

      await loadProfile(); // Reload to get updated data
    } catch (error) {
      console.error("Error saving profile:", error);
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid gap-6">
              {Array(4).fill(0).map((_, i) => (
                <Card key={i} className="h-48 bg-gray-200"></Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 text-lg">
            Complete your profile to connect with language partners
          </p>
        </div>

        <div className="space-y-6">
          <BasicInfoSection
            formData={formData}
            onChange={setFormData}
          />
          
          <LanguageSection
            formData={formData}
            onChange={setFormData}
          />
          
          <InterestsSection
            formData={formData}
            onChange={setFormData}
          />
          
          <AvailabilitySection
            formData={formData}
            onChange={setFormData}
          />
        </div>

        <div className="flex justify-center pt-6">
          <Button
            onClick={handleSave}
            disabled={isSaving || formData.native_languages.length === 0}
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 min-w-32"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}