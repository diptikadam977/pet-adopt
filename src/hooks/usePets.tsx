
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { mockPets, type MockPet } from '@/data/mockPets';

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
  }, []);

  const fetchPets = async () => {
    try {
      // First try to get real data from Supabase
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Combine real data with mock data for a richer experience
      const combinedPets = [...(data || []), ...mockPets];
      
      // Sort by created_at to show newest first
      const sortedPets = combinedPets.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setPets(sortedPets);
    } catch (error) {
      console.error('Error fetching pets:', error);
      // If there's an error, fall back to mock data
      setPets(mockPets);
    } finally {
      setLoading(false);
    }
  };

  return { pets, loading, refetch: fetchPets };
}
