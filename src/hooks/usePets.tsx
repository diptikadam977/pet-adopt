
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  gender: string;
  size: string;
  color: string;
  description: string;
  health_status: string;
  vaccination_status: string;
  spayed_neutered: boolean;
  good_with_kids: boolean;
  good_with_pets: boolean;
  energy_level: string;
  location: string;
  adoption_fee: number;
  images: string[];
  status: string;
  user_id: string;
  created_at: string;
}

export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPets();
    
    // Setup real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pets'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchPets(); // Refetch data when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    }
  }, []);

  const fetchPets = async () => {
    try {
      // Get real data from Supabase only
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPets(data || []);
    } catch (error) {
      console.error('Error fetching pets:', error);
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  const deletePet = async (petId: string) => {
    try {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', petId);

      if (error) throw error;

      // Update local state by removing the deleted pet
      setPets(prevPets => prevPets.filter(pet => pet.id !== petId));
      toast.success('Pet listing deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting pet:', error);
      toast.error('Failed to delete pet listing');
      return false;
    }
  };

  const updatePet = async (petId: string, petData: Partial<Pet>) => {
    try {
      const { error } = await supabase
        .from('pets')
        .update(petData)
        .eq('id', petId);

      if (error) throw error;

      // Update local state
      setPets(prevPets => 
        prevPets.map(pet => 
          pet.id === petId ? { ...pet, ...petData } : pet
        )
      );
      toast.success('Pet listing updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating pet:', error);
      toast.error('Failed to update pet listing');
      return false;
    }
  };

  return { pets, loading, refetch: fetchPets, deletePet, updatePet };
}
