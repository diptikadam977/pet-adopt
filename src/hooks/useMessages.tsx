
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { mockMessages, type MockMessage } from '@/data/mockPets';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  pet_id: string;
  content: string;
  created_at: string;
  sender_profile?: {
    full_name: string;
    profile_photo: string;
  };
}

export function useMessages(conversationId?: string, receiverId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchMessages = async () => {
    if (!user || !receiverId) {
      // Show mock messages for demo
      if (conversationId && mockMessages[conversationId]) {
        const mockMessageData = mockMessages[conversationId].map(msg => ({
          id: msg.id,
          sender_id: msg.sender_id,
          receiver_id: msg.receiver_id,
          pet_id: msg.pet_id,
          content: msg.content,
          created_at: msg.created_at,
          sender_profile: {
            full_name: msg.sender_name,
            profile_photo: msg.is_current_user 
              ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face'
              : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'
          }
        }));
        setMessages(mockMessageData);
      }
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Get sender profiles for messages
      const messagesWithProfiles = await Promise.all(
        (data || []).map(async (message) => {
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('full_name, profile_photo')
            .eq('id', message.sender_id)
            .single();

          return {
            ...message,
            sender_profile: senderProfile
          };
        })
      );

      // Add mock messages for demonstration if no real messages exist
      if (messagesWithProfiles.length === 0 && conversationId && mockMessages[conversationId]) {
        const mockMessageData = mockMessages[conversationId].map(msg => ({
          id: msg.id,
          sender_id: msg.sender_id,
          receiver_id: msg.receiver_id,
          pet_id: msg.pet_id,
          content: msg.content,
          created_at: msg.created_at,
          sender_profile: {
            full_name: msg.sender_name,
            profile_photo: msg.is_current_user 
              ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face'
              : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'
          }
        }));
        setMessages(mockMessageData);
      } else {
        setMessages(messagesWithProfiles);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Fallback to mock messages
      if (conversationId && mockMessages[conversationId]) {
        const mockMessageData = mockMessages[conversationId].map(msg => ({
          id: msg.id,
          sender_id: msg.sender_id,
          receiver_id: msg.receiver_id,
          pet_id: msg.pet_id,
          content: msg.content,
          created_at: msg.created_at,
          sender_profile: {
            full_name: msg.sender_name,
            profile_photo: msg.is_current_user 
              ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face'
              : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'
          }
        }));
        setMessages(mockMessageData);
      }
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, petId?: string) => {
    if (!user || !receiverId) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          pet_id: petId,
          content
        });

      if (error) throw error;

      // Update conversation last_message_at
      if (conversationId) {
        await supabase
          .from('conversations')
          .update({ last_message_at: new Date().toISOString() })
          .eq('id', conversationId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    fetchMessages();

    if (!user || !receiverId) return;

    // Subscribe to real-time messages
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id}))`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, receiverId]);

  return {
    messages,
    loading,
    sendMessage,
    refetch: fetchMessages
  };
}
