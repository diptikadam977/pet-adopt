
import React from 'react';
import { ArrowLeft, Share2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PetProfileProps {
  onBack: () => void;
  onAdopt: () => void;
  onChat: () => void;
}

export function PetProfile({ onBack, onAdopt, onChat }: PetProfileProps) {
  const pet = {
    name: 'Buddy',
    age: '2 years old',
    breed: 'Golden Retriever',
    gender: 'Male',
    vaccination: 'Vaccinated',
    story: 'Buddy is a friendly and playful Golden Retriever who loves to fetch and cuddle. He\'s fully vaccinated and in excellent health, making him an ideal companion for any family. He gets along well with children and other pets.',
    tags: ['#Friendly', '#Vaccinated', '#Healthy', '#Good with Kids'],
    images: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&fit=crop&crop=faces'],
    owner: {
      name: 'Emily Carter',
      rating: 4.8,
      reviews: 12,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b182?w=150&h=150&fit=crop&crop=face'
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative">
        <img 
          src={pet.images[0]} 
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
            {pet.age} · {pet.breed} · {pet.gender} · {pet.vaccination}
          </p>
        </div>

        {/* Owner Info */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-primary mb-3">About the owner</h2>
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 sm:w-16 sm:h-16">
              <AvatarImage src={pet.owner.avatar} alt={pet.owner.name} />
              <AvatarFallback>EC</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-primary text-sm sm:text-base">{pet.owner.name}</h3>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-orange-primary text-orange-primary" />
                <span className="text-warm-gray-dark text-xs sm:text-sm">{pet.owner.rating} ({pet.owner.reviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pet Story */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-primary mb-3">{pet.name}'s story</h2>
          <p className="text-warm-gray-dark leading-relaxed mb-4 text-sm sm:text-base">{pet.story}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {pet.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="rounded-full px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 pb-20">
          <Button 
            onClick={onAdopt}
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
      </div>
    </div>
  );
}
