
import React from 'react';
import { Heart, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pet } from '@/hooks/usePets';
import { useFavorites } from '@/hooks/useFavorites';

interface PetAdsCarouselProps {
  pets: Pet[];
  onPetSelect: (petId: string) => void;
}

export function PetAdsCarousel({ pets, onPetSelect }: PetAdsCarouselProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const handleFavoriteToggle = async (petId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite(petId)) {
      await removeFavorite(petId);
    } else {
      await addFavorite(petId);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="px-6">
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {pets.map((pet) => (
          <Card 
            key={pet.id}
            className="min-w-[280px] rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onPetSelect(pet.id)}
          >
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={pet.images?.[0] || '/placeholder.svg'}
                  alt={pet.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Favorite Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 h-8 w-8 bg-white/90 hover:bg-white"
                  onClick={(e) => handleFavoriteToggle(pet.id, e)}
                >
                  <Heart 
                    className={`w-4 h-4 ${isFavorite(pet.id) ? 'fill-red-500 text-red-500' : 'text-warm-gray-dark'}`} 
                  />
                </Button>

                {/* Free Badge */}
                {pet.adoption_fee === 0 && (
                  <Badge className="absolute top-3 left-3 bg-green-500 text-white">
                    FREE
                  </Badge>
                )}

                {/* Pet Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{pet.name}</h3>
                  <p className="text-sm opacity-90 mb-2">{pet.breed} • {pet.age} • {pet.gender}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{pet.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">{getTimeAgo(pet.created_at)}</span>
                      </div>
                      {pet.adoption_fee > 0 && (
                        <span className="text-lg font-bold">${pet.adoption_fee}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional Info */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {pet.energy_level} Energy
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {pet.size}
                  </Badge>
                </div>
                <p className="text-sm text-warm-gray-dark line-clamp-2">
                  {pet.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
