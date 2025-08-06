
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

// Real pet images for different breeds
const getRealPetImage = (type: string, breed: string) => {
  const petImages = {
    'Golden Retriever': 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=faces',
    'Persian': 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&h=300&fit=crop&crop=faces',
    'Labrador Mix': 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=faces',
    'Domestic Shorthair': 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop&crop=faces',
    'German Shepherd': 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=300&fit=crop&crop=faces',
    'Siamese': 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=300&fit=crop&crop=faces',
    'Beagle': 'https://images.unsplash.com/photo-1505628346881-b72b27e84993?w=400&h=300&fit=crop&crop=faces',
    'Maine Coon': 'https://images.unsplash.com/photo-1573824774092-e5b0e9b3d995?w=400&h=300&fit=crop&crop=faces',
    'Bulldog': 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=faces',
    'Ragdoll': 'https://images.unsplash.com/photo-1606214174585-fe31582cd22c?w=400&h=300&fit=crop&crop=faces'
  };

  // Fallback images for dogs and cats
  const fallbackImages = {
    'Dog': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&crop=faces',
    'Cat': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop&crop=faces'
  };

  return petImages[breed as keyof typeof petImages] || fallbackImages[type as keyof typeof fallbackImages] || fallbackImages['Dog'];
};

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
                  src={getRealPetImage(pet.type, pet.breed)}
                  alt={pet.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = pet.type === 'Cat' 
                      ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop&crop=faces'
                      : 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&crop=faces';
                  }}
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
