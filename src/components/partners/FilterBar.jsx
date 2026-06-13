import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function FilterBar({ searchTerm, onSearchChange, filters, onFiltersChange, languages, countries }) {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md border-0 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by language, interests, or location..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-gray-200 focus:border-orange-500"
          />
        </div>
        
        <Select
          value={filters.language}
          onValueChange={(value) => onFiltersChange({ ...filters, language: value })}
        >
          <SelectTrigger className="border-gray-200 focus:border-orange-500">
            <SelectValue placeholder="Any Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Language</SelectItem>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang}>{lang}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.country}
          onValueChange={(value) => onFiltersChange({ ...filters, country: value })}
        >
          <SelectTrigger className="border-gray-200 focus:border-orange-500">
            <SelectValue placeholder="Any Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Country</SelectItem>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>{country}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}