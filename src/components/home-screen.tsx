
import React, { useState } from 'react';
import { Search, MessageCircle, Bell, MapPin, Heart, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePets } from '@/hooks/usePets';

interface HomeScreenProps {
  onPetSelect: (petId: string) => void;
  onNavigateToMessages: () => void;
}

export function HomeScreen({ onPetSelect, onNavigateToMessages }: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { pets, loading } = usePets();

  const filteredPets = pets.filter(pet =>
    pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="bg-background px-6 pt-12 pb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">Find Your Perfect</h1>
            <h2 className="text-2xl font-bold text-orange-primary">Companion</h2>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onNavigateToMessages}
              className="rounded-full"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-warm-gray-dark w-5 h-5" />
          <Input
            placeholder="Search for pets, breeds, or locations..."
            className="pl-12 pr-12 py-3 rounded-2xl border-warm-gray bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button size="icon" variant="ghost" className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl">
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        {/* Categories */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {['All', 'Dogs', 'Cats', 'Birds', 'Rabbits'].map((category) => (
            <Button
              key={category}
              variant={category === 'All' ? 'default' : 'outline'}
              className={`rounded-full whitespace-nowrap ${
                category === 'All' 
                  ? 'bg-orange-primary text-white hover:bg-orange-secondary' 
                  : 'border-warm-gray text-warm-gray-dark hover:bg-orange-light'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Featured Pets */}
      <div className="px-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-primary">Available Pets</h3>
          <Button variant="ghost" className="text-orange-primary">
            See all
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredPets.map((pet) => (
            <Card 
              key={pet.id} 
              className="rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
              onClick={() => onPetSelect(pet.id)}
            >
              <div className="relative">
                <img 
                  src={pet.images[0]} 
                  alt={pet.name}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                >
                  <Heart className="w-4 h-4" />
                </Button>
                <Badge className="absolute bottom-2 left-2 bg-white/90 text-primary">
                  {pet.age}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold text-primary mb-1">{pet.name}</h4>
                <p className="text-sm text-warm-gray-dark mb-2">{pet.breed}</p>
                <div className="flex items-center gap-1 text-warm-gray-dark mb-2">
                  <MapPin className="w-3 h-3" />
                  <span className="text-xs">{pet.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-orange-primary">${pet.adoption_fee}</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                    Available
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-warm-gray-dark">No pets found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
