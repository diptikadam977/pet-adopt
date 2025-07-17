
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Conversation {
  id: string;
  pet_id: string;
  owner_id: string;
  interested_user_id: string;
  last_message_at: string;
  created_at: string;
  pets?: {
    name: string;
    images: string[];
  };
  owner_profile?: {
    full_name: string;
    profile_photo: string;
  };
  interested_profile?: {
    full_name: string;
    profile_photo: string;
  };
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          pets:pet_id (name, images),
          owner_profile:owner_id (full_name, profile_photo),
          interested_profile:interested_user_id (full_name, profile_photo)
        `)
        .or(`owner_id.eq.${user.id},interested_user_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (petId: string, ownerId: string) => {
    if (!user) return null;

    try {
      // Check if conversation already exists
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('pet_id', petId)
        .eq('owner_id', ownerId)
        .eq('interested_user_id', user.id)
        .single();

      if (existing) {
        return existing.id;
      }

      // Create new conversation
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          pet_id: petId,
          owner_id: ownerId,
          interested_user_id: user.id
        })
        .select('id')
        .single();

      if (error) throw error;
      await fetchConversations();
      return data.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  return {
    conversations,
    loading,
    refetch: fetchConversations,
    createConversation
  };
}
