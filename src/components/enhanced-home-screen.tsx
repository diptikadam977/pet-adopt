
import React from 'react';
import { Search, Heart, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { PetAdsCarousel } from '@/components/pet-ads/pet-ads-carousel';
import { usePets } from '@/hooks/usePets';
import { useFavorites } from '@/hooks/useFavorites';

interface EnhancedHomeScreenProps {
  onPetSelect: (petId: string) => void;
  onSearch: () => void;
}

export function EnhancedHomeScreen({ onPetSelect, onSearch }: EnhancedHomeScreenProps) {
  const { pets, loading } = usePets();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const handleFavoriteToggle = async (petId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite(petId)) {
      await removeFavorite(petId);
    } else {
      await addFavorite(petId);
    }
  };

  // Get featured pets (first 4 for ads carousel)
  const featuredPets = pets.slice(0, 4);
  
  // Get recent pets (excluding featured ones)
  const recentPets = pets.slice(4, 10);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">Find Your</h1>
            <h2 className="text-2xl font-bold text-primary">Perfect Pet</h2>
          </div>
          <div className="w-12 h-12 bg-orange-primary rounded-full flex items-center justify-center">
            <span className="text-white text-lg">🐾</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6" onClick={onSearch}>
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-warm-gray-dark w-5 h-5" />
          <Input
            placeholder="Search for pets..."
            className="pl-12 pr-4 py-3 rounded-full bg-warm-gray/20 border-0 text-primary placeholder:text-warm-gray-dark"
            readOnly
          />
        </div>
      </div>

      {/* Featured Pets Carousel */}
      <div className="mb-8">
        <div className="px-6 mb-4">
          <h3 className="text-xl font-bold text-primary">Featured Pets</h3>
        </div>
        <PetAdsCarousel pets={featuredPets} onPetSelect={onPetSelect} />
      </div>

      {/* Recent Pets */}
      <div className="px-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-primary">Recent Pets</h3>
          <Button variant="ghost" className="text-orange-primary">
            See all
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {recentPets.map((pet) => (
              <Card 
                key={pet.id}
                className="rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onPetSelect(pet.id)}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={pet.images?.[0] || '/placeholder.svg'}
                      alt={pet.name}
                      className="w-full h-32 object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white"
                      onClick={(e) => handleFavoriteToggle(pet.id, e)}
                    >
                      <Heart 
                        className={`w-4 h-4 ${isFavorite(pet.id) ? 'fill-red-500 text-red-500' : 'text-warm-gray-dark'}`} 
                      />
                    </Button>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-primary mb-1">{pet.name}</h4>
                    <p className="text-sm text-warm-gray-dark mb-2">{pet.breed}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-warm-gray-dark" />
                        <span className="text-xs text-warm-gray-dark">{pet.location}</span>
                      </div>
                      <span className="text-sm font-bold text-primary">
                        {pet.adoption_fee === 0 ? 'Free' : `$${pet.adoption_fee}`}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
