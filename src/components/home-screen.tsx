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
    image: '/lovable-uploads/42a710fd-3b12-47a8-ae84-16cdc38bba0f.png',
  },
  {
    id: '2',
    name: 'Whiskers',
    breed: 'Siamese Cat',
    age: '1 year',
    image: '/lovable-uploads/e0629f7a-170b-453b-8dd8-d2f5cef5c027.png',
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
      <div className="bg-gradient-peach px-6 pt-12 pb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">Pawsitive Match</h1>
          <SlidersHorizontal className="w-6 h-6 text-warm-gray-dark" />
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-warm-gray-dark" />
          <Input
            placeholder="Search by breed, type, or location"
            className="pl-12 py-3 bg-background border-warm-gray rounded-2xl"
            onClick={onSearch}
            readOnly
          />
        </div>
        
        {/* Category Filters */}
        <div className="flex gap-4">
          <Button variant="secondary" className="flex items-center gap-2 bg-background rounded-2xl px-6">
            <Dog className="w-4 h-4" />
            Dogs
          </Button>
          <Button variant="secondary" className="flex items-center gap-2 bg-background rounded-2xl px-6">
            <Cat className="w-4 h-4" />
            Cats
          </Button>
          <Button variant="secondary" className="flex items-center gap-2 bg-background rounded-2xl px-6">
            <Fish className="w-4 h-4" />
            Other
          </Button>
        </div>
      </div>

      {/* Featured Pets */}
      <div className="px-6 py-6">
        <h2 className="text-xl font-bold text-primary mb-4">Featured Pets</h2>
        
        <div className="grid grid-cols-1 gap-4 mb-6">
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
                  className="w-full h-48 object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-background/80 hover:bg-background rounded-full"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg text-primary">{pet.name}</h3>
                <p className="text-warm-gray-dark">{pet.breed}, {pet.age}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* List Your Pet CTA */}
        <Button 
          onClick={onAddPet}
          className="w-full bg-orange-primary hover:bg-orange-secondary text-primary-foreground py-4 rounded-2xl font-semibold text-lg"
        >
          List Your Pet
        </Button>
      </div>
    </div>
  );
}