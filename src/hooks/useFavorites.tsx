
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Pet } from '@/hooks/usePets';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Pet[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          pet_id,
          pets!inner(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const favoritePets = data?.map(item => item.pets) || [];
      const ids = new Set(data?.map(item => item.pet_id) || []);
      
      setFavorites(favoritePets);
      setFavoriteIds(ids);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (petId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, pet_id: petId });

      if (error) throw error;
      
      setFavoriteIds(prev => new Set([...prev, petId]));
      await fetchFavorites();
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  };

  const removeFavorite = async (petId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('pet_id', petId);

      if (error) throw error;
      
      setFavoriteIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(petId);
        return newSet;
      });
      await fetchFavorites();
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const isFavorite = (petId: string) => favoriteIds.has(petId);

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    refetch: fetchFavorites
  };
}
