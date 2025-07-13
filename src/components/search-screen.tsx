
import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  image: string;
  type: string;
}

const pets: Pet[] = [
  {
    id: '1',
    name: 'Buddy',
    breed: 'Golden Retriever',
    age: 'Young',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop&crop=faces',
    type: 'dog'
  },
  {
    id: '2',
    name: 'Whiskers',
    breed: 'Siamese',
    age: 'Adult',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop&crop=faces',
    type: 'cat'
  },
  {
    id: '3',
    name: 'Luna',
    breed: 'Husky',
    age: 'Young',
    image: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&h=400&fit=crop&crop=faces',
    type: 'dog'
  },
  {
    id: '4',
    name: 'Milo',
    breed: 'Persian',
    age: 'Adult',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop&crop=faces',
    type: 'cat'
  },
  {
    id: '5',
    name: 'Charlie',
    breed: 'Labrador',
    age: 'Young',
    image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=400&fit=crop&crop=faces',
    type: 'dog'
  },
  {
    id: '6',
    name: 'Bella',
    breed: 'Maine Coon',
    age: 'Adult',
    image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&h=400&fit=crop&crop=faces',
    type: 'cat'
  }
];

interface SearchScreenProps {
  onBack: () => void;
  onPetClick: (petId: string) => void;
}

export function SearchScreen({ onBack, onPetClick }: SearchScreenProps) {
  const [activeTypeFilter, setActiveTypeFilter] = useState('all');
  const [activeAgeFilter, setActiveAgeFilter] = useState('all');

  const typeFilters = ['Dogs', 'Cats', 'All'];
  const ageFilters = ['Young', 'Adult', 'Senior', 'All'];

  const filteredPets = pets.filter(pet => {
    if (activeTypeFilter !== 'all' && pet.type !== activeTypeFilter.toLowerCase()) return false;
    if (activeAgeFilter !== 'all' && pet.age.toLowerCase() !== activeAgeFilter.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-background px-4 sm:px-6 pt-12 pb-4 border-b border-warm-gray">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="w-8 h-8">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg sm:text-xl font-bold text-primary flex-1">Find your pet</h1>
          <SlidersHorizontal className="w-5 h-5 text-warm-gray-dark" />
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-warm-gray-dark" />
          <Input
            placeholder="Search by name or breed"
            className="pl-10 sm:pl-12 py-3 bg-warm-gray/20 border-warm-gray rounded-2xl text-sm sm:text-base"
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredPets.map((pet) => (
            <Card 
              key={pet.id}
              className="cursor-pointer hover:shadow-lg transition-shadow rounded-2xl overflow-hidden"
              onClick={() => onPetClick(pet.id)}
            >
              <div className="aspect-square">
                <img 
                  src={pet.image} 
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-2 sm:p-3">
                <h3 className="font-bold text-primary text-sm sm:text-base">{pet.name}</h3>
                <p className="text-xs sm:text-sm text-warm-gray-dark">{pet.breed}</p>
                <p className="text-xs sm:text-sm text-warm-gray-dark">{pet.age}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
