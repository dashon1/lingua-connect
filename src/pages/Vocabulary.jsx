import React, { useState, useEffect } from "react";
import { VocabularyItem, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Plus, Search, TrendingUp, Star, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import VocabCard from "../components/vocabulary/VocabCard";
import AddVocabModal from "../components/vocabulary/AddVocabModal";
import FlashcardMode from "../components/vocabulary/FlashcardMode";

export default function Vocabulary() {
  const [vocabulary, setVocabulary] = useState([]);
  const [filteredVocab, setFilteredVocab] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");

  useEffect(() => {
    loadVocabulary();
  }, []);

  useEffect(() => {
    let filtered = [...vocabulary];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.translation?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterLanguage !== "all") {
      filtered = filtered.filter(item => item.language === filterLanguage);
    }

    if (filterDifficulty !== "all") {
      filtered = filtered.filter(item => item.difficulty === filterDifficulty);
    }

    setFilteredVocab(filtered);
  }, [vocabulary, searchTerm, filterLanguage, filterDifficulty]);

  const loadVocabulary = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const items = await VocabularyItem.filter(
        { created_by: currentUser.email },
        "-created_date"
      );
      setVocabulary(items);
    } catch (error) {
      console.error("Error loading vocabulary:", error);
    }
    setIsLoading(false);
  };

  const languages = [...new Set(vocabulary.map(v => v.language))];
  const stats = {
    total: vocabulary.length,
    toReview: vocabulary.filter(v => v.mastery_level < 3).length,
    mastered: vocabulary.filter(v => v.mastery_level >= 4).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Vocabulary Builder
            </h1>
            <p className="text-gray-600 text-lg">
              Track and practice words you're learning
            </p>
          </div>
          <div className="flex gap-2">
            {vocabulary.length > 0 && (
              <Button variant="outline" onClick={() => setShowFlashcards(true)} className="border-orange-200">
                <Star className="w-4 h-4 mr-2" />
                Practice
              </Button>
            )}
            <Button onClick={() => setShowAddModal(true)} className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Word
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Words</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">To Review</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.toReview}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Mastered</p>
                  <p className="text-3xl font-bold text-green-600">{stats.mastered}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6 bg-white/60 backdrop-blur-sm border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search vocabulary..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {languages.map(lang => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {filteredVocab.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVocab.map((item) => (
              <VocabCard key={item.id} item={item} onUpdate={loadVocabulary} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-16 bg-white/60 backdrop-blur-sm border-0 shadow-md">
            <CardContent>
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {vocabulary.length === 0 ? "No vocabulary yet" : "No results found"}
              </h3>
              <p className="text-gray-500 mb-6">
                {vocabulary.length === 0 
                  ? "Start building your vocabulary by adding words you learn" 
                  : "Try adjusting your search or filters"
                }
              </p>
              {vocabulary.length === 0 && (
                <Button onClick={() => setShowAddModal(true)} className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Word
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <AddVocabModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onCreated={loadVocabulary}
        />

        {showFlashcards && (
          <FlashcardMode
            vocabulary={vocabulary}
            onClose={() => setShowFlashcards(false)}
            onUpdate={loadVocabulary}
          />
        )}
      </div>
    </div>
  );
}