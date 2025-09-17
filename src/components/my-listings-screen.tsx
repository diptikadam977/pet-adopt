
import React, { useState } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { usePets, type Pet } from '@/hooks/usePets';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { EditPetDialog } from '@/components/edit-pet-dialog';

interface MyListingsScreenProps {
  onBack: () => void;
  onAddPet: () => void;
  onPetSelect: (petId: string) => void;
}

export function MyListingsScreen({ onBack, onAddPet, onPetSelect }: MyListingsScreenProps) {
  const { user } = useAuth();
  const { pets, deletePet, updatePet } = usePets();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  
  const userPets = pets.filter(pet => pet.user_id === user?.id);

  const handleDeletePet = async () => {
    if (selectedPetId) {
      await deletePet(selectedPetId);
      setDeleteDialogOpen(false);
      setSelectedPetId('');
    }
  };

  const handleEditPet = (pet: Pet) => {
    setSelectedPet(pet);
    setEditDialogOpen(true);
  };

  const handleUpdatePet = async (petData: Partial<Pet>) => {
    if (selectedPet) {
      const success = await updatePet(selectedPet.id, petData);
      if (success) {
        setEditDialogOpen(false);
        setSelectedPet(null);
      }
    }
  };

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
            className="rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
          >
            <CardContent className="p-0">
              <div className="flex items-center">
                <div 
                  className="flex items-center flex-1 cursor-pointer"
                  onClick={() => onPetSelect(pet.id)}
                >
                  <img 
                    src={pet.images?.[0] || '/placeholder.svg'} 
                    alt={pet.name}
                    className="w-20 h-20 rounded-2xl object-cover m-4"
                  />
                  <div className="flex-1 pr-4">
                    <h3 className="text-xl font-bold text-primary mb-1">{pet.name}</h3>
                    <p className="text-warm-gray-dark">{pet.breed}</p>
                    <p className="text-sm text-warm-gray-dark">₹{pet.adoption_fee}</p>
                  </div>
                </div>
                
                <div className="pr-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditPet(pet)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedPetId(pet.id);
                          setDeleteDialogOpen(true);
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Pet Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this pet listing? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePet}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Pet Dialog */}
      {selectedPet && (
        <EditPetDialog
          pet={selectedPet}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleUpdatePet}
        />
      )}
    </div>
  );
}
