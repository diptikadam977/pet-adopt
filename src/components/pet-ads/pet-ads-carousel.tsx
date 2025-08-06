
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PetAd {
  id: string;
  name: string;
  breed: string;
  age: string;
  location: string;
  image: string;
  adoption_fee: number;
  featured: boolean;
}

interface PetAdsCarouselProps {
  onPetSelect: (petId: string) => void;
}

export function PetAdsCarousel({ onPetSelect }: PetAdsCarouselProps) {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [featuredPets] = useState<PetAd[]>([
    {
      id: '1',
      name: 'Buddy',
      breed: 'Golden Retriever',
      age: '2 years',
      location: 'San Francisco',
      image: '/lovable-uploads/42a710fd-3b12-47a8-ae84-16cdc38bba0f.png',
      adoption_fee: 0,
      featured: true
    },
    {
      id: '2',
      name: 'Luna',
      breed: 'Persian Cat',
      age: '1 year',
      location: 'Oakland',
      image: '/lovable-uploads/8eb06a14-cd33-44d7-871d-b5780d546175.png',
      adoption_fee: 150,
      featured: true
    },
    {
      id: '3',
      name: 'Max',
      breed: 'German Shepherd',
      age: '3 years',
      location: 'Berkeley',
      image: '/lovable-uploads/e0629f7a-170b-453b-8dd8-d2f5cef5c027.png',
      adoption_fee: 200,
      featured: true
    },
    {
      id: '4',
      name: 'Mittens',
      breed: 'Maine Coon',
      age: '6 months',
      location: 'San Jose',
      image: '/lovable-uploads/809569e1-bc95-4f34-a5d1-4ad64c00cdf3.png',
      adoption_fee: 0,
      featured: true
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => 
        (prevIndex + 1) % featuredPets.length
      );
    }, 4000); // Change ad every 4 seconds

    return () => clearInterval(interval);
  }, [featuredPets.length]);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-primary">Featured Pets</h2>
        <div className="flex gap-1">
          {featuredPets.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentAdIndex ? 'bg-orange-primary' : 'bg-warm-gray/40'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentAdIndex * 100}%)` }}
        >
          {featuredPets.map((pet) => (
            <div key={pet.id} className="w-full flex-shrink-0 px-1">
              <Card 
                className="rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-light/20 to-warm-gray/10"
                onClick={() => onPetSelect(pet.id)}
              >
                <div className="relative">
                  <img 
                    src={pet.image} 
                    alt={pet.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-orange-primary text-white font-bold">
                      FEATURED
                    </Badge>
                  </div>
                  {pet.adoption_fee === 0 && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-500 text-white font-bold">
                        FREE
                      </Badge>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-3 right-3 bg-white/80 hover:bg-white"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-primary text-lg">{pet.name}</h3>
                      <p className="text-warm-gray-dark text-sm">{pet.breed} • {pet.age}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-orange-primary font-bold text-lg">
                        {pet.adoption_fee === 0 ? 'FREE' : `$${pet.adoption_fee}`}
                      </p>
                    </div>
                  </div>
                  <p className="text-warm-gray-dark text-xs">{pet.location}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
