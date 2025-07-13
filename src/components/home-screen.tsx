
import React from 'react';
import { Search, SlidersHorizontal, Heart, Dog, Cat, Fish } from 'lucide-react';
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
  liked?: boolean;
}

const featuredPets: Pet[] = [
  {
    id: '1',
    name: 'Buddy',
    breed: 'Golden Retriever',
    age: '2 years',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&fit=crop&crop=faces',
  },
  {
    id: '2',
    name: 'Whiskers',
    breed: 'Siamese Cat',
    age: '1 year',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=600&fit=crop&crop=faces',
  },
  {
    id: '3',
    name: 'Luna',
    breed: 'Husky',
    age: '3 years',
    image: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=800&h=600&fit=crop&crop=faces',
  },
  {
    id: '4',
    name: 'Milo',
    breed: 'Persian Cat',
    age: '2 years',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop&crop=faces',
  },
];

interface HomeScreenProps {
  onPetClick: (petId: string) => void;
  onAddPet: () => void;
  onSearch: () => void;
}

export function HomeScreen({ onPetClick, onAddPet, onSearch }: HomeScreenProps) {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-peach px-4 sm:px-6 pt-12 pb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-primary">Pawsitive Match</h1>
          <SlidersHorizontal className="w-5 h-5 sm:w-6 sm:h-6 text-warm-gray-dark" />
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-warm-gray-dark" />
          <Input
            placeholder="Search by breed, type, or location"
            className="pl-10 sm:pl-12 py-3 bg-background border-warm-gray rounded-2xl text-sm sm:text-base"
            onClick={onSearch}
            readOnly
          />
        </div>
        
        {/* Category Filters */}
        <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2">
          <Button variant="secondary" className="flex items-center gap-2 bg-background rounded-2xl px-4 sm:px-6 whitespace-nowrap">
            <Dog className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Dogs</span>
          </Button>
          <Button variant="secondary" className="flex items-center gap-2 bg-background rounded-2xl px-4 sm:px-6 whitespace-nowrap">
            <Cat className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Cats</span>
          </Button>
          <Button variant="secondary" className="flex items-center gap-2 bg-background rounded-2xl px-4 sm:px-6 whitespace-nowrap">
            <Fish className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Other</span>
          </Button>
        </div>
      </div>

      {/* Featured Pets */}
      <div className="px-4 sm:px-6 py-6">
        <h2 className="text-lg sm:text-xl font-bold text-primary mb-4">Featured Pets</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {featuredPets.map((pet) => (
            <Card 
              key={pet.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow rounded-2xl overflow-hidden"
              onClick={() => onPetClick(pet.id)}
            >
              <div className="relative">
                <img 
                  src={pet.image} 
                  alt={pet.name}
                  className="w-full h-40 sm:h-48 object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 bg-background/80 hover:bg-background rounded-full w-8 h-8 sm:w-10 sm:h-10"
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
              <CardContent className="p-3 sm:p-4">
                <h3 className="font-bold text-base sm:text-lg text-primary">{pet.name}</h3>
                <p className="text-sm text-warm-gray-dark">{pet.breed}, {pet.age}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* List Your Pet CTA */}
        <Button 
          onClick={onAddPet}
          className="w-full bg-orange-primary hover:bg-orange-secondary text-primary-foreground py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg"
        >
          List Your Pet
        </Button>
      </div>
    </div>
  );
}
