
import React, { useState, useEffect } from 'react';
import { Search, Heart, MapPin, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PetAdsCarousel } from '@/components/pet-ads/pet-ads-carousel';
import { usePets } from '@/hooks/usePets';

interface EnhancedHomeScreenProps {
  onPetSelect: (petId: string) => void;
  onSearch: () => void;
}

export function EnhancedHomeScreen({ onPetSelect, onSearch }: EnhancedHomeScreenProps) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { pets, loading } = usePets();

  const toggleFavorite = (petId: string) => {
    setFavorites(prev => 
      prev.includes(petId) 
        ? prev.filter(id => id !== petId)
        : [...prev, petId]
    );
  };

  const getImageUrl = (pet: any) => {
    if (pet.images && pet.images.length > 0) {
      return pet.images[0];
    }
    
    const petType = pet.type?.toLowerCase() || 'dog';
    const breed = pet.breed?.toLowerCase().replace(/\s+/g, '-') || '';
    
    const imageQueries = {
      dog: [
        `${breed}-dog-portrait`,
        `${breed}-dog`,
        'happy-dog-portrait',
        'cute-dog-face',
        'dog-portrait'
      ],
      cat: [
        `${breed}-cat-portrait`,
        `${breed}-cat`,
        'cute-cat-portrait',
        'cat-face',
        'kitten'
      ],
      bird: [
        `${breed}-bird`,
        'colorful-bird',
        'pet-bird',
        'bird-portrait'
      ],
      rabbit: [
        'cute-rabbit',
        'pet-rabbit',
        'bunny-portrait'
      ]
    };

    const queries = imageQueries[petType as keyof typeof imageQueries] || ['pet-animal'];
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
    
    return `https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop&crop=face&q=80&auto=format&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&q=${randomQuery}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-primary">Find Your Perfect Pet</h1>
              <p className="text-warm-gray-dark">Discover loving companions waiting for homes</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative" onClick={onSearch}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-gray-dark w-5 h-5" />
            <Input
              placeholder="Search for dogs, cats, birds..."
              className="pl-10 h-12 rounded-xl bg-blue-50/50 border-blue-200 cursor-pointer"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Pet Ads Carousel */}
      <div className="p-4">
        <PetAdsCarousel />
      </div>

      {/* Quick Categories */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold text-primary mb-3">Browse by Type</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[
            { type: 'Dogs', icon: '🐕', count: pets.filter(p => p.type?.toLowerCase() === 'dog').length },
            { type: 'Cats', icon: '🐱', count: pets.filter(p => p.type?.toLowerCase() === 'cat').length },
            { type: 'Birds', icon: '🐦', count: pets.filter(p => p.type?.toLowerCase() === 'bird').length },
            { type: 'Rabbits', icon: '🐰', count: pets.filter(p => p.type?.toLowerCase() === 'rabbit').length }
          ].map((category) => (
            <Card key={category.type} className="min-w-[120px] cursor-pointer hover:shadow-md transition-shadow border-0 bg-white shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{category.icon}</div>
                <p className="font-medium text-primary">{category.type}</p>
                <p className="text-xs text-warm-gray-dark">{category.count} available</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Pets */}
      <div className="px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-primary">Recent Additions</h2>
          <Button 
            variant="ghost" 
            onClick={onSearch}
            className="text-blue-600 hover:text-blue-700"
          >
            See all
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pets.slice(0, 6).map((pet) => (
            <Card key={pet.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-md bg-white">
              <div onClick={() => onPetSelect(pet.id)}>
                <div className="relative aspect-[4/3]">
                  <img
                    src={getImageUrl(pet)}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop&q=80';
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(pet.id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 hover:bg-white"
                  >
                    <Heart 
                      className={`w-4 h-4 ${
                        favorites.includes(pet.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-gray-600'
                      }`} 
                    />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-4" onClick={() => onPetSelect(pet.id)}>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-primary">{pet.name}</h3>
                    <p className="text-warm-gray-dark">{pet.breed} • {pet.age}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                      {pet.type}
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                      {pet.size}
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                      {pet.gender}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-sm text-warm-gray-dark">
                    <MapPin className="w-4 h-4 mr-1" />
                    {pet.location}
                  </div>
                  
                  <p className="text-sm text-warm-gray-dark line-clamp-2">
                    {pet.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {pets.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">No pets yet</h3>
            <p className="text-warm-gray-dark">Be the first to add a pet for adoption</p>
          </div>
        )}
      </div>
    </div>
  );
}
