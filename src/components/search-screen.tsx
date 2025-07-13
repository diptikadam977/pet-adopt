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
    image: '/lovable-uploads/42a710fd-3b12-47a8-ae84-16cdc38bba0f.png',
    type: 'dog'
  },
  {
    id: '2',
    name: 'Whiskers',
    breed: 'Siamese',
    age: 'Adult',
    image: '/lovable-uploads/e0629f7a-170b-453b-8dd8-d2f5cef5c027.png',
    type: 'cat'
  },
  {
    id: '3',
    name: 'Nibbles',
    breed: 'Dutch Rabbit',
    age: 'Young',
    image: '/lovable-uploads/e0629f7a-170b-453b-8dd8-d2f5cef5c027.png',
    type: 'rabbit'
  },
  {
    id: '4',
    name: 'Chirpy',
    breed: 'Canary',
    age: 'Adult',
    image: '/lovable-uploads/e0629f7a-170b-453b-8dd8-d2f5cef5c027.png',
    type: 'bird'
  },
  {
    id: '5',
    name: 'Scales',
    breed: 'Bearded Dragon',
    age: 'Young',
    image: '/lovable-uploads/e0629f7a-170b-453b-8dd8-d2f5cef5c027.png',
    type: 'reptile'
  },
  {
    id: '6',
    name: 'Fluffy',
    breed: 'Persian',
    age: 'Adult',
    image: '/lovable-uploads/e0629f7a-170b-453b-8dd8-d2f5cef5c027.png',
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
  const [activeGenderFilter, setActiveGenderFilter] = useState('all');
  const [activeSortFilter, setActiveSortFilter] = useState('nearest');

  const typeFilters = ['Dogs', 'Cats', 'Rabbits', 'Birds', 'Reptiles'];
  const ageFilters = ['Young', 'Adult', 'Senior', 'All'];
  const genderFilters = ['Male', 'Female', 'All'];
  const sortFilters = ['Nearest', 'Newest', 'Age'];

  const filteredPets = pets.filter(pet => {
    if (activeTypeFilter !== 'all' && pet.type !== activeTypeFilter) return false;
    if (activeAgeFilter !== 'all' && pet.age.toLowerCase() !== activeAgeFilter.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-background px-6 pt-12 pb-4 border-b border-warm-gray">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-primary">Find your pet</h1>
          <SlidersHorizontal className="w-6 h-6 text-warm-gray-dark ml-auto" />
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-warm-gray-dark" />
          <Input
            placeholder="Search by name or breed"
            className="pl-12 py-3 bg-warm-gray/20 border-warm-gray rounded-2xl"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 space-y-4">
        <div>
          <h3 className="font-semibold text-primary mb-2">Filters</h3>
          
          {/* Type Filters */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
            {typeFilters.map((type) => (
              <Badge 
                key={type}
                variant={activeTypeFilter === type.toLowerCase() ? "default" : "secondary"}
                className="cursor-pointer whitespace-nowrap rounded-full px-4 py-2"
                onClick={() => setActiveTypeFilter(type.toLowerCase())}
              >
                {type}
              </Badge>
            ))}
          </div>
          
          {/* Age Filters */}
          <div className="flex gap-2 mb-3">
            {ageFilters.map((age) => (
              <Badge 
                key={age}
                variant={activeAgeFilter === age.toLowerCase() ? "default" : "secondary"}
                className="cursor-pointer whitespace-nowrap rounded-full px-4 py-2"
                onClick={() => setActiveAgeFilter(age.toLowerCase())}
              >
                {age}
              </Badge>
            ))}
          </div>
          
          {/* Gender Filters */}
          <div className="flex gap-2 mb-3">
            {genderFilters.map((gender) => (
              <Badge 
                key={gender}
                variant={activeGenderFilter === gender.toLowerCase() ? "default" : "secondary"}
                className="cursor-pointer whitespace-nowrap rounded-full px-4 py-2"
                onClick={() => setActiveGenderFilter(gender.toLowerCase())}
              >
                {gender}
              </Badge>
            ))}
          </div>
          
          {/* Sort Filters */}
          <div className="flex gap-2">
            {sortFilters.map((sort) => (
              <Badge 
                key={sort}
                variant={activeSortFilter === sort.toLowerCase() ? "default" : "secondary"}
                className="cursor-pointer whitespace-nowrap rounded-full px-4 py-2"
                onClick={() => setActiveSortFilter(sort.toLowerCase())}
              >
                {sort}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Pet Grid */}
      <div className="px-6">
        <div className="grid grid-cols-2 gap-4">
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
              <CardContent className="p-3">
                <h3 className="font-bold text-primary">{pet.name}</h3>
                <p className="text-sm text-warm-gray-dark">{pet.breed}</p>
                <p className="text-sm text-warm-gray-dark">{pet.age}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}