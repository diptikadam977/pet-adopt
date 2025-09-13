
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { mockConversations, type MockConversation } from '@/data/mockPets';

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
    if (!user) {
      // Show mock conversations for demo purposes
      const mockConversationsFormatted = mockConversations.map(conv => ({
        id: conv.id,
        pet_id: conv.pet_id,
        owner_id: conv.owner_id,
        interested_user_id: conv.interested_user_id,
        last_message_at: conv.last_message_at,
        created_at: conv.created_at,
        pets: {
          name: conv.pet_name,
          images: [conv.pet_image]
        },
        owner_profile: {
          full_name: conv.owner_name,
          profile_photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'
        },
        interested_profile: {
          full_name: 'You',
          profile_photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face'
        }
      }));
      setConversations(mockConversationsFormatted);
      setLoading(false);
      return;
    }

    try {
      // First get conversations
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .or(`owner_id.eq.${user.id},interested_user_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (conversationsError) throw conversationsError;

      // Get additional data for each conversation
      const conversationsWithData = await Promise.all(
        (conversationsData || []).map(async (conversation) => {
          // Get pet data
          const { data: petData } = await supabase
            .from('pets')
            .select('name, images')
            .eq('id', conversation.pet_id)
            .single();

          // Get owner profile
          const { data: ownerProfile } = await supabase
            .from('profiles')
            .select('full_name, profile_photo')
            .eq('id', conversation.owner_id)
            .single();

          // Get interested user profile
          const { data: interestedProfile } = await supabase
            .from('profiles')
            .select('full_name, profile_photo')
            .eq('id', conversation.interested_user_id)
            .single();

          return {
            ...conversation,
            pets: petData,
            owner_profile: ownerProfile,
            interested_profile: interestedProfile
          };
        })
      );

      // Combine with mock data for richer experience
      const mockConversationsFormatted = mockConversations.map(conv => ({
        id: conv.id,
        pet_id: conv.pet_id,
        owner_id: conv.owner_id,
        interested_user_id: conv.interested_user_id,
        last_message_at: conv.last_message_at,
        created_at: conv.created_at,
        pets: {
          name: conv.pet_name,
          images: [conv.pet_image]
        },
        owner_profile: {
          full_name: conv.owner_name,
          profile_photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'
        },
        interested_profile: {
          full_name: 'You',
          profile_photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face'
        }
      }));

      setConversations([...conversationsWithData, ...mockConversationsFormatted]);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      // Fallback to mock data
      const mockConversationsFormatted = mockConversations.map(conv => ({
        id: conv.id,
        pet_id: conv.pet_id,
        owner_id: conv.owner_id,
        interested_user_id: conv.interested_user_id,
        last_message_at: conv.last_message_at,
        created_at: conv.created_at,
        pets: {
          name: conv.pet_name,
          images: [conv.pet_image]
        },
        owner_profile: {
          full_name: conv.owner_name,
          profile_photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'
        },
        interested_profile: {
          full_name: 'You',
          profile_photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face'
        }
      }));
      setConversations(mockConversationsFormatted);
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (petId: string, ownerId: string) => {
    if (!user) return null;

    try {
      // Check if conversation already exists - look for any combination
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('pet_id', petId)
        .or(`and(owner_id.eq.${ownerId},interested_user_id.eq.${user.id}),and(owner_id.eq.${user.id},interested_user_id.eq.${ownerId})`)
        .maybeSingle();

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
