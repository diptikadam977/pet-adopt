
import React, { useState } from 'react';
import { Search, MessageSquare, Plus, Heart, MapPin, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePets } from '@/hooks/usePets';

interface HomeScreenProps {
  onPetSelect: (petId: string) => void;
  onNavigateToMessages: () => void;
  onAddPet: () => void;
}

export function HomeScreen({ onPetSelect, onNavigateToMessages, onAddPet }: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const { pets, loading } = usePets();

  const petTypes = [
    { id: 'all', label: 'All' },
    { id: 'dog', label: 'Dogs' },
    { id: 'cat', label: 'Cats' },
    { id: 'rabbit', label: 'Rabbits' },
    { id: 'bird', label: 'Birds' },
    { id: 'other', label: 'Other' }
  ];

  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pet.breed?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pet.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || pet.type === selectedType;
    return matchesSearch && matchesType;
  });

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
      <div className="bg-gradient-warm px-4 sm:px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Find Your</h1>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Perfect Companion</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onNavigateToMessages}
              className="text-white hover:bg-white/20"
            >
              <MessageSquare className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onAddPet}
              className="text-white hover:bg-white/20"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-warm-gray-dark" />
          <Input
            placeholder="Search pets by name, breed, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-3 rounded-2xl bg-white/90 border-0 text-primary placeholder:text-warm-gray-dark"
          />
        </div>
      </div>

      {/* Pet Type Filter */}
      <div className="px-4 sm:px-6 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {petTypes.map((type) => (
            <Button
              key={type.id}
              variant={selectedType === type.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type.id)}
              className={`whitespace-nowrap rounded-full ${
                selectedType === type.id 
                  ? 'bg-orange-primary text-white hover:bg-orange-secondary' 
                  : 'border-warm-gray text-warm-gray-dark hover:bg-warm-gray/20'
              }`}
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="px-4 sm:px-6 mb-4">
        <p className="text-warm-gray-dark text-sm">
          {filteredPets.length} {filteredPets.length === 1 ? 'pet' : 'pets'} available
        </p>
      </div>

      {/* Pet Grid */}
      <div className="px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredPets.map((pet) => (
          <Card 
            key={pet.id} 
            className="rounded-2xl overflow-hidden border-warm-gray/30 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onPetSelect(pet.id)}
          >
            <CardContent className="p-0">
              <div className="relative">
                <img 
                  src={pet.images?.[0] || '/placeholder.svg'} 
                  alt={pet.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                <div className="absolute top-2 right-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-8 h-8 bg-white/80 hover:bg-white/90 text-orange-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle favorite toggle
                    }}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
                {pet.adoption_fee === 0 && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-green-500 text-white">Free</Badge>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-primary">{pet.name}</h3>
                  {pet.adoption_fee > 0 && (
                    <span className="text-orange-primary font-bold">${pet.adoption_fee}</span>
                  )}
                </div>
                
                <p className="text-warm-gray-dark text-sm mb-2">
                  {pet.breed} • {pet.age} • {pet.gender}
                </p>
                
                {pet.location && (
                  <div className="flex items-center gap-1 text-warm-gray-dark text-sm mb-3">
                    <MapPin className="w-3 h-3" />
                    <span>{pet.location}</span>
                  </div>
                )}
                
                <div className="flex gap-2">
                  {pet.good_with_kids && (
                    <Badge variant="secondary" className="text-xs">Good with kids</Badge>
                  )}
                  {pet.good_with_pets && (
                    <Badge variant="secondary" className="text-xs">Good with pets</Badge>
                  )}
                  {pet.vaccination_status === 'vaccinated' && (
                    <Badge variant="secondary" className="text-xs">Vaccinated</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPets.length === 0 && (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-orange-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold text-primary mb-2">No pets found</h3>
          <p className="text-warm-gray-dark">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}
