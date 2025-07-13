
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface PetProfileProps {
  onBack: () => void;
  onAdopt: (pet: any) => void;
  onChat: () => void;
  petId: string;
}

export function PetProfile({ onBack, onAdopt, onChat, petId }: PetProfileProps) {
  const [pet, setPet] = useState<any>(null);
  const [owner, setOwner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPetDetails();
  }, [petId]);

  const fetchPetDetails = async () => {
    try {
      const { data: petData, error: petError } = await supabase
        .from('pets')
        .select('*')
        .eq('id', petId)
        .single();

      if (petError) throw petError;
      setPet(petData);

      if (petData.user_id) {
        const { data: ownerData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', petData.user_id)
          .single();
        
        setOwner(ownerData);
      }
    } catch (error) {
      console.error('Error fetching pet details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-primary"></div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Pet not found</p>
      </div>
    );
  }

  const tags = [
    pet.good_with_kids && '#Good with Kids',
    pet.good_with_pets && '#Good with Pets',
    pet.spayed_neutered && '#Spayed/Neutered',
    `#${pet.energy_level} Energy`,
    `#${pet.vaccination_status}`,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative">
        <img 
          src={pet.images?.[0] || '/placeholder.svg'} 
          alt={pet.name}
          className="w-full h-64 sm:h-80 object-cover"
        />
        <div className="absolute top-12 left-4 right-4 sm:left-6 sm:right-6 flex justify-between">
          <Button variant="ghost" size="icon" onClick={onBack} className="bg-background/80 rounded-full w-8 h-8 sm:w-10 sm:h-10">
            <ArrowLeft className="w-4 h-4 sm:w-6 sm:h-6" />
          </Button>
          <Button variant="ghost" size="icon" className="bg-background/80 rounded-full w-8 h-8 sm:w-10 sm:h-10">
            <Share2 className="w-4 h-4 sm:w-6 sm:h-6" />
          </Button>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 space-y-6">
        {/* Pet Basic Info */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">{pet.name}</h1>
          <p className="text-base sm:text-lg text-warm-gray-dark mb-4">
            {pet.age} · {pet.breed} · {pet.gender} · {pet.size}
          </p>
          <p className="text-xl font-bold text-orange-primary">${pet.adoption_fee}</p>
        </div>

        {/* Owner Info */}
        {owner && (
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-primary mb-3">About the owner</h2>
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12 sm:w-16 sm:h-16">
                <AvatarFallback>{owner.full_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-primary text-sm sm:text-base">{owner.full_name || 'Pet Owner'}</h3>
                <p className="text-warm-gray-dark text-xs sm:text-sm">{owner.location || pet.location}</p>
              </div>
            </div>
          </div>
        )}

        {/* Pet Story */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-primary mb-3">{pet.name}'s story</h2>
          <p className="text-warm-gray-dark leading-relaxed mb-4 text-sm sm:text-base">
            {pet.description || `${pet.name} is a wonderful ${pet.type} looking for a loving home. This ${pet.age} old ${pet.breed} has a ${pet.energy_level.toLowerCase()} energy level and would make a great addition to the right family.`}
          </p>
          
          {/* Health Info */}
          <div className="bg-warm-gray/10 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-primary mb-2">Health Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><span className="font-medium">Health:</span> {pet.health_status}</p>
              <p><span className="font-medium">Vaccinated:</span> {pet.vaccination_status}</p>
              <p><span className="font-medium">Spayed/Neutered:</span> {pet.spayed_neutered ? 'Yes' : 'No'}</p>
              <p><span className="font-medium">Energy Level:</span> {pet.energy_level}</p>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="rounded-full px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        {user && (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 pb-20">
            <Button 
              onClick={() => onAdopt(pet)}
              className="flex-1 bg-orange-primary hover:bg-orange-secondary text-primary-foreground py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg"
            >
              Adopt Me
            </Button>
            <Button 
              onClick={onChat}
              variant="outline" 
              className="flex-1 border-orange-primary text-orange-primary hover:bg-orange-light py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg"
            >
              Chat with Owner
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
