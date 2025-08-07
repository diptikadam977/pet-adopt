import React, { useState, useEffect } from 'react';
import { Search, Filter, Heart, MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePets } from '@/hooks/usePets';

interface EnhancedSearchScreenProps {
  onPetSelect: (petId: string) => void;
  onBack?: () => void;
}

export function EnhancedSearchScreen({ onPetSelect, onBack }: EnhancedSearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const { pets, loading } = usePets();

  const toggleFavorite = (petId: string) => {
    setFavorites(prev => 
      prev.includes(petId) 
        ? prev.filter(id => id !== petId)
        : [...prev, petId]
    );
  };

  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pet.breed?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || pet.type === selectedType;
    const matchesSize = selectedSize === 'All' || pet.size === selectedSize;

    return matchesSearch && matchesType && matchesSize;
  });

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center gap-4 p-4">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-xl font-bold text-primary">Find Your Pet</h1>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-gray-dark w-5 h-5" />
            <Input
              placeholder="Search pets by name or breed..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-xl bg-blue-50/50 border-blue-200"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 pb-4">
          <div className="flex gap-2 mb-3 overflow-x-auto">
            {['All', 'Dog', 'Cat', 'Bird', 'Rabbit'].map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                onClick={() => setSelectedType(type)}
                className={`whitespace-nowrap rounded-full ${
                  selectedType === type 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
                size="sm"
              >
                {type}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            {['All', 'Small', 'Medium', 'Large'].map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                onClick={() => setSelectedSize(size)}
                className={`whitespace-nowrap rounded-full ${
                  selectedSize === size 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
                size="sm"
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="p-4">
        <div className="mb-4">
          <p className="text-warm-gray-dark">
            {filteredPets.length} pets found
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPets.map((pet) => (
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

        {filteredPets.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">No pets found</h3>
            <p className="text-warm-gray-dark">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
