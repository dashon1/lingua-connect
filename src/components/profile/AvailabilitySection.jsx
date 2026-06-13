import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Clock } from "lucide-react";

export default function AvailabilitySection({ formData, onChange }) {
  return (
    <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" />
          Session Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="duration">Preferred Session Duration</Label>
            <Select
              value={formData.session_duration_preference.toString()}
              onValueChange={(value) => onChange({
                ...formData,
                session_duration_preference: parseInt(value)
              })}
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

          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={formData.timezone}
              onValueChange={(value) => onChange({...formData, timezone: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC-12">UTC-12 (Baker Island)</SelectItem>
                <SelectItem value="UTC-11">UTC-11 (Hawaii-Aleutian)</SelectItem>
                <SelectItem value="UTC-10">UTC-10 (Hawaii)</SelectItem>
                <SelectItem value="UTC-9">UTC-9 (Alaska)</SelectItem>
                <SelectItem value="UTC-8">UTC-8 (Pacific)</SelectItem>
                <SelectItem value="UTC-7">UTC-7 (Mountain)</SelectItem>
                <SelectItem value="UTC-6">UTC-6 (Central)</SelectItem>
                <SelectItem value="UTC-5">UTC-5 (Eastern)</SelectItem>
                <SelectItem value="UTC-4">UTC-4 (Atlantic)</SelectItem>
                <SelectItem value="UTC-3">UTC-3 (Argentina)</SelectItem>
                <SelectItem value="UTC-2">UTC-2 (South Georgia)</SelectItem>
                <SelectItem value="UTC-1">UTC-1 (Azores)</SelectItem>
                <SelectItem value="UTC+0">UTC+0 (London)</SelectItem>
                <SelectItem value="UTC+1">UTC+1 (Central Europe)</SelectItem>
                <SelectItem value="UTC+2">UTC+2 (Eastern Europe)</SelectItem>
                <SelectItem value="UTC+3">UTC+3 (Moscow)</SelectItem>
                <SelectItem value="UTC+4">UTC+4 (Gulf)</SelectItem>
                <SelectItem value="UTC+5">UTC+5 (Pakistan)</SelectItem>
                <SelectItem value="UTC+6">UTC+6 (Bangladesh)</SelectItem>
                <SelectItem value="UTC+7">UTC+7 (Thailand)</SelectItem>
                <SelectItem value="UTC+8">UTC+8 (China)</SelectItem>
                <SelectItem value="UTC+9">UTC+9 (Japan)</SelectItem>
                <SelectItem value="UTC+10">UTC+10 (Australia East)</SelectItem>
                <SelectItem value="UTC+11">UTC+11 (Solomon Islands)</SelectItem>
                <SelectItem value="UTC+12">UTC+12 (Fiji)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">Available for Sessions</Label>
            <p className="text-sm text-gray-600">
              Allow other users to book conversation sessions with you
            </p>
          </div>
          <Switch
            checked={formData.is_available_for_sessions}
            onCheckedChange={(checked) => onChange({
              ...formData,
              is_available_for_sessions: checked
            })}
          />
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            💡 <strong>Tip:</strong> Complete your profile with native languages and interests to get more session requests from language learners looking for practice partners.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}