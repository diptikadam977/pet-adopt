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
    story: 'Buddy is a friendly and playful Golden Retriever who loves to fetch and cuddle. He\'s fully vaccinated and in excellent health, making him an ideal companion for any family.',
    tags: ['#Friendly', '#Vaccinated', '#Healthy'],
    images: ['/lovable-uploads/42a710fd-3b12-47a8-ae84-16cdc38bba0f.png'],
    owner: {
      name: 'Emily Carter',
      rating: 4.8,
      reviews: 12,
      avatar: '/lovable-uploads/8eb06a14-cd33-44d7-871d-b5780d546175.png'
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative">
        <img 
          src={pet.images[0]} 
          alt={pet.name}
          className="w-full h-80 object-cover"
        />
        <div className="absolute top-12 left-6 right-6 flex justify-between">
          <Button variant="ghost" size="icon" onClick={onBack} className="bg-background/80 rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon" className="bg-background/80 rounded-full">
            <Share2 className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Pet Basic Info */}
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">{pet.name}</h1>
          <p className="text-lg text-warm-gray-dark mb-4">
            {pet.age} · {pet.breed} · {pet.gender} · {pet.vaccination}
          </p>
        </div>

        {/* Owner Info */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-3">About the owner</h2>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={pet.owner.avatar} alt={pet.owner.name} />
              <AvatarFallback>EC</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-primary">{pet.owner.name}</h3>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-orange-primary text-orange-primary" />
                <span className="text-warm-gray-dark">{pet.owner.rating} ({pet.owner.reviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pet Story */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-3">{pet.name}'s story</h2>
          <p className="text-warm-gray-dark leading-relaxed mb-4">{pet.story}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {pet.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="rounded-full px-4 py-2">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 pb-20">
          <Button 
            onClick={onAdopt}
            className="flex-1 bg-orange-primary hover:bg-orange-secondary text-primary-foreground py-4 rounded-2xl font-semibold text-lg"
          >
            Adopt Me
          </Button>
          <Button 
            onClick={onChat}
            variant="outline" 
            className="flex-1 border-orange-primary text-orange-primary hover:bg-orange-light py-4 rounded-2xl font-semibold text-lg"
          >
            Chat with Owner
          </Button>
        </div>
      </div>
    </div>
  );
}