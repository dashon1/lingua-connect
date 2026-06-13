
import React, { useState, useEffect } from "react";
import { LanguageProfile, User } from "@/api/entities";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, MapPin, Star, Clock, MessageCircle, ArrowUpDown } from "lucide-react";

import PartnerCard from "../components/partners/PartnerCard";
import FilterBar from "../components/partners/FilterBar";
import PartnerModal from "../components/partners/PartnerModal";

export default function FindPartners() {
  const [partners, setPartners] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    language: "all",
    level: "all",
    country: "all"
  });
  const [sortBy, setSortBy] = useState("average_rating");

  useEffect(() => {
    loadPartners();
  }, []);

  useEffect(() => {
    // Apply filters directly in useEffect to avoid dependency issues
    let filtered = [...partners];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(partner =>
        partner.native_languages.some(lang => 
          lang.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        partner.interests?.some(interest => 
          interest.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        partner.country?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Language filter
    if (filters.language !== "all") {
      filtered = filtered.filter(partner =>
        partner.native_languages.includes(filters.language)
      );
    }

    // Country filter
    if (filters.country !== "all") {
      filtered = filtered.filter(partner => partner.country === filters.country);
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'average_rating') {
        return (b.average_rating || 0) - (a.average_rating || 0);
      }
      if (sortBy === 'total_sessions') {
        return (b.total_sessions || 0) - (a.total_sessions || 0);
      }
      if (sortBy === 'newest') {
        return new Date(b.created_date) - new Date(a.created_date);
      }
      return 0;
    });

    setFilteredPartners(filtered);
  }, [searchTerm, filters, partners, sortBy]);

  const loadPartners = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      const profiles = await LanguageProfile.filter(
        { 
          is_available_for_sessions: true,
          created_by: { $ne: currentUser.email } // Exclude current user
        },
        "-average_rating"
      );
      
      // Get user details for each profile
      const partnersWithUsers = await Promise.all(
        profiles.map(async (profile) => {
          try {
            const user = await User.filter({ email: profile.created_by });
            return {
              ...profile,
              user: user[0] || null
            };
          } catch (error) {
            return { ...profile, user: null };
          }
        })
      );

      setPartners(partnersWithUsers.filter(p => p.user));
    } catch (error) {
      console.error("Error loading partners:", error);
    }
    setIsLoading(false);
  };

  const getUniqueLanguages = () => {
    const languages = new Set();
    partners.forEach(partner => {
      partner.native_languages?.forEach(lang => languages.add(lang));
    });
    return Array.from(languages).sort();
  };

  const getUniqueCountries = () => {
    const countries = new Set();
    partners.forEach(partner => {
      if (partner.country) countries.add(partner.country);
    });
    return Array.from(countries).sort();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Find Conversation Partners
          </h1>
          <p className="text-gray-600 text-lg">
            Connect with native speakers around the world for language practice
          </p>
        </div>

        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFiltersChange={setFilters}
          languages={getUniqueLanguages()}
          countries={getUniqueCountries()}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Found {filteredPartners.length} conversation partners
              </p>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 border-gray-200 focus:border-orange-500 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="average_rating">Sort by Highest Rated</SelectItem>
                    <SelectItem value="total_sessions">Sort by Most Sessions</SelectItem>
                    <SelectItem value="newest">Sort by Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPartners.map((partner) => (
                <PartnerCard
                  key={partner.id}
                  partner={partner}
                  onClick={() => setSelectedPartner(partner)}
                />
              ))}
            </div>

            {filteredPartners.length === 0 && !isLoading && (
              <div className="text-center py-16">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No partners found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({ language: "all", level: "all", country: "all" });
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}

        <PartnerModal
          partner={selectedPartner}
          onClose={() => setSelectedPartner(null)}
        />
      </div>
    </div>
  );
}
