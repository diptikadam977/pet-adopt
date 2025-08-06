
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { usePets } from '@/hooks/usePets';

interface EnhancedHomeScreenProps {
  onPetSelect: (petId: string) => void;
}

export function EnhancedHomeScreen({ onPetSelect }: EnhancedHomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    age: '',
    size: '',
    breed: ''
  });
  const { pets, loading } = usePets();

  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pet.breed?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const featuredPet = filteredPets[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-primary">Pawsitive Match</h1>
          <Button variant="ghost" size="icon" className="text-primary">
            <Search className="w-6 h-6" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-warm-gray-dark" />
          <Input
            placeholder="Search for pets"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-4 rounded-2xl bg-warm-gray/20 border-0 text-primary placeholder:text-warm-gray-dark"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-6">
          {['Age', 'Size', 'Breeds'].map((filter) => (
            <Button
              key={filter}
              variant="outline"
              className="rounded-full px-6 py-2 bg-warm-gray/20 border-warm-gray/30 text-warm-gray-dark"
            >
              {filter}
              <Filter className="w-4 h-4 ml-2" />
            </Button>
          ))}
        </div>
      </div>

      {/* Featured Pet */}
      {featuredPet && (
        <div className="px-6 mb-6">
          <Card 
            className="rounded-3xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 text-white cursor-pointer"
            onClick={() => onPetSelect(featuredPet.id)}
          >
            <CardContent className="p-0">
              <div className="relative">
                <img 
                  src={featuredPet.images?.[0] || '/placeholder.svg'} 
                  alt={featuredPet.name}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h2 className="text-3xl font-bold mb-2">Meet {featuredPet.name}</h2>
                  <p className="text-white/80 text-lg mb-4 max-w-xs">
                    {featuredPet.description?.slice(0, 100)}...
                  </p>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-8 py-3">
                    Learn More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pet Grid */}
      <div className="px-6">
        <div className="grid grid-cols-2 gap-4">
          {filteredPets.slice(1, 7).map((pet) => (
            <Card 
              key={pet.id}
              className="rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onPetSelect(pet.id)}
            >
              <CardContent className="p-0">
                <img 
                  src={pet.images?.[0] || '/placeholder.svg'} 
                  alt={pet.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-bold text-primary text-sm">{pet.name}</h3>
                  <p className="text-warm-gray-dark text-xs">{pet.breed}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
