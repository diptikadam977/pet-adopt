
import React from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { usePets } from '@/hooks/usePets';

interface MyListingsScreenProps {
  onBack: () => void;
  onAddPet: () => void;
  onPetSelect: (petId: string) => void;
}

export function MyListingsScreen({ onBack, onAddPet, onPetSelect }: MyListingsScreenProps) {
  const { user } = useAuth();
  const { pets } = usePets();
  
  const userPets = pets.filter(pet => pet.user_id === user?.id);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold text-primary">My Listings</h1>
        </div>
      </div>

      {/* Pet List */}
      <div className="px-6 space-y-4 mb-6">
        {userPets.map((pet) => (
          <Card 
            key={pet.id}
            className="rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onPetSelect(pet.id)}
          >
            <CardContent className="p-0">
              <div className="flex items-center">
                <img 
                  src={pet.images?.[0] || '/placeholder.svg'} 
                  alt={pet.name}
                  className="w-20 h-20 rounded-2xl object-cover m-4"
                />
                <div className="flex-1 pr-4">
                  <h3 className="text-xl font-bold text-primary mb-1">{pet.name}</h3>
                  <p className="text-warm-gray-dark">{pet.breed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {userPets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-warm-gray-dark text-lg mb-4">No pets listed yet</p>
            <p className="text-warm-gray-dark">Add your first pet to get started</p>
          </div>
        )}
      </div>

      {/* Add Listing Button */}
      <div className="fixed bottom-24 left-6 right-6">
        <Button 
          onClick={onAddPet}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-2xl text-lg font-semibold flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Listing
        </Button>
      </div>
    </div>
  );
}
