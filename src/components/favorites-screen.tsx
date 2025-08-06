
import React from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFavorites } from '@/hooks/useFavorites';

interface FavoritesScreenProps {
  onBack: () => void;
  onPetSelect: (petId: string) => void;
}

export function FavoritesScreen({ onBack, onPetSelect }: FavoritesScreenProps) {
  const { favorites, loading, removeFavorite } = useFavorites();

  const handleRemoveFavorite = async (petId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await removeFavorite(petId);
  };

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
      <div className="bg-background px-6 pt-12 pb-4 border-b border-warm-gray">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-primary">My Favorites</h1>
        </div>
      </div>

      {/* Favorites List */}
      <div className="px-6 py-4">
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto text-warm-gray-dark mb-4" />
            <h3 className="text-lg font-semibold text-primary mb-2">No favorites yet</h3>
            <p className="text-warm-gray-dark">Save pets you love to see them here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((pet) => (
              <Card 
                key={pet.id}
                className="rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onPetSelect(pet.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={pet.images?.[0] || '/placeholder.svg'}
                      alt={pet.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-primary">{pet.name}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleRemoveFavorite(pet.id, e)}
                          className="h-8 w-8"
                        >
                          <Heart className="w-5 h-5 text-red-500 fill-current" />
                        </Button>
                      </div>
                      <p className="text-sm text-warm-gray-dark mb-1">
                        {pet.breed} • {pet.age} • {pet.gender}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-warm-gray-dark">{pet.location}</span>
                        <span className="text-lg font-bold text-primary">
                          {pet.adoption_fee === 0 ? 'Free' : `$${pet.adoption_fee}`}
                        </span>
                      </div>
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
