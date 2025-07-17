
import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePets } from '@/hooks/usePets';

interface SearchScreenProps {
  onBack?: () => void;
  onPetSelect: (petId: string) => void;
}

export function SearchScreen({ onBack, onPetSelect }: SearchScreenProps) {
  const { pets, loading } = usePets();
  const [activeTypeFilter, setActiveTypeFilter] = useState('all');
  const [activeAgeFilter, setActiveAgeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const typeFilters = ['Dogs', 'Cats', 'All'];
  const ageFilters = ['Young', 'Adult', 'Senior', 'All'];

  const filteredPets = pets.filter(pet => {
    const matchesSearch = searchTerm === '' || 
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = activeTypeFilter === 'all' || 
      pet.type.toLowerCase() === activeTypeFilter.toLowerCase().replace('s', '');
    
    const matchesAge = activeAgeFilter === 'all' || 
      (activeAgeFilter === 'young' && (pet.age.includes('month') || pet.age.includes('1 year'))) ||
      (activeAgeFilter === 'adult' && (pet.age.includes('2') || pet.age.includes('3') || pet.age.includes('4'))) ||
      (activeAgeFilter === 'senior' && (pet.age.includes('5') || pet.age.includes('6') || pet.age.includes('7')));

    return matchesSearch && matchesType && matchesAge;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-background px-4 sm:px-6 pt-12 pb-4 border-b border-warm-gray">
        <div className="flex items-center gap-4 mb-4">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="w-8 h-8">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-lg sm:text-xl font-bold text-primary flex-1">Find your pet</h1>
          <SlidersHorizontal className="w-5 h-5 text-warm-gray-dark" />
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-warm-gray-dark" />
          <Input
            placeholder="Search by name, breed, or location"
            className="pl-10 sm:pl-12 py-3 bg-warm-gray/20 border-warm-gray rounded-2xl text-sm sm:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 sm:px-6 py-4 space-y-4">
        <div>
          <h3 className="font-semibold text-primary mb-3 text-sm sm:text-base">Filters</h3>
          
          {/* Type Filters */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
            {typeFilters.map((type) => (
              <Badge 
                key={type}
                variant={activeTypeFilter === type.toLowerCase() ? "default" : "secondary"}
                className="cursor-pointer whitespace-nowrap rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
                onClick={() => setActiveTypeFilter(type.toLowerCase())}
              >
                {type}
              </Badge>
            ))}
          </div>
          
          {/* Age Filters */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
            {ageFilters.map((age) => (
              <Badge 
                key={age}
                variant={activeAgeFilter === age.toLowerCase() ? "default" : "secondary"}
                className="cursor-pointer whitespace-nowrap rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
                onClick={() => setActiveAgeFilter(age.toLowerCase())}
              >
                {age}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Pet Grid */}
      <div className="px-4 sm:px-6">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-warm-gray/20" />
                <CardContent className="p-2 sm:p-3">
                  <div className="h-4 bg-warm-gray/20 rounded mb-1" />
                  <div className="h-3 bg-warm-gray/20 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredPets.map((pet) => (
              <Card 
                key={pet.id}
                className="cursor-pointer hover:shadow-lg transition-shadow rounded-2xl overflow-hidden"
                onClick={() => onPetSelect(pet.id)}
              >
                <div className="aspect-square">
                  <img 
                    src={pet.images?.[0] || '/placeholder.svg'} 
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-2 sm:p-3">
                  <h3 className="font-bold text-primary text-sm sm:text-base">{pet.name}</h3>
                  <p className="text-xs sm:text-sm text-warm-gray-dark">{pet.breed}</p>
                  <p className="text-xs sm:text-sm text-warm-gray-dark">{pet.age}</p>
                  <p className="text-xs sm:text-sm text-orange-primary font-semibold">${pet.adoption_fee}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {!loading && filteredPets.length === 0 && (
          <div className="text-center py-8">
            <p className="text-warm-gray-dark">No pets found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
