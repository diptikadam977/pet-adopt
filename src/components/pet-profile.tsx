
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share2, MapPin, Calendar, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PetProfileProps {
  onBack: () => void;
  onAdopt: (pet: any) => void;
  onChat: () => void;
  petId: string;
}

export function PetProfile({ onBack, onAdopt, onChat, petId }: PetProfileProps) {
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPet();
  }, [petId]);

  const fetchPet = async () => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('id', petId)
        .single();

      if (error) throw error;
      setPet(data);
    } catch (error) {
      console.error('Error fetching pet:', error);
      toast({
        title: "Error",
        description: "Failed to load pet details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdopt = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to send adoption requests",
        variant: "destructive",
      });
      return;
    }
    
    if (pet.user_id === user.id) {
      toast({
        title: "Can't Adopt Your Own Pet",
        description: "You cannot send an adoption request for your own pet",
        variant: "destructive",
      });
      return;
    }

    onAdopt(pet);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Adopt ${pet.name}`,
          text: `Check out ${pet.name}, a ${pet.breed} looking for a loving home!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied!",
          description: "Pet profile link copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-primary"></div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-primary mb-2">Pet Not Found</h2>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="relative">
        <img 
          src={pet.images?.[0] || '/placeholder.svg'} 
          alt={pet.name}
          className="w-full h-80 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        
        {/* Header Actions */}
        <div className="absolute top-12 left-4 right-4 flex justify-between items-center">
          <Button variant="ghost" size="icon" onClick={onBack} className="bg-white/80 backdrop-blur-sm">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsLiked(!isLiked)}
              className="bg-white/80 backdrop-blur-sm"
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleShare}
              className="bg-white/80 backdrop-blur-sm"
            >
              <Share2 className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute bottom-4 right-4">
          <Badge className={`${
            pet.status === 'available' 
              ? 'bg-green-500 text-white' 
              : 'bg-orange-500 text-white'
          }`}>
            {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Pet Info */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-bold text-primary">{pet.name}</h1>
            <span className="text-2xl font-bold text-orange-primary">${pet.adoption_fee}</span>
          </div>
          <p className="text-warm-gray-dark text-lg">{pet.breed} • {pet.age} • {pet.gender}</p>
          <div className="flex items-center gap-1 text-warm-gray-dark mt-1">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{pet.location}</span>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="rounded-xl">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-warm-gray-dark">Size</p>
              <p className="font-semibold text-primary">{pet.size}</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-warm-gray-dark">Energy</p>
              <p className="font-semibold text-primary">{pet.energy_level}</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-warm-gray-dark">Color</p>
              <p className="font-semibold text-primary">{pet.color}</p>
            </CardContent>
          </Card>
        </div>

        {/* About */}
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <h3 className="font-bold text-primary mb-2">About {pet.name}</h3>
            <p className="text-warm-gray-dark leading-relaxed">{pet.description}</p>
          </CardContent>
        </Card>

        {/* Health & Behavior */}
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <h3 className="font-bold text-primary mb-3">Health & Behavior</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-sm text-warm-gray-dark">Health: {pet.health_status}</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-warm-gray-dark">Vaccinations: {pet.vaccination_status}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-warm-gray-dark">
                  Spayed/Neutered: {pet.spayed_neutered ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compatibility */}
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <h3 className="font-bold text-primary mb-3">Good With</h3>
            <div className="flex gap-2 flex-wrap">
              {pet.good_with_kids && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Kids
                </Badge>
              )}
              {pet.good_with_pets && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Other Pets
                </Badge>
              )}
              {!pet.good_with_kids && !pet.good_with_pets && (
                <span className="text-sm text-warm-gray-dark">No specific compatibility info</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {pet.status === 'available' && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-orange-primary text-orange-primary hover:bg-orange-light"
              onClick={onChat}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Message Owner
            </Button>
            <Button
              onClick={handleAdopt}
              className="flex-1 bg-orange-primary hover:bg-orange-secondary text-white"
            >
              <Heart className="w-4 h-4 mr-2" />
              Request Adoption
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
