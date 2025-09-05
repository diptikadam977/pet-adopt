
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
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          pet_id: petId,
          content
        })
        .select()
        .single();

      if (error) throw error;

      // Update conversation last_message_at
      if (conversationId) {
        await supabase
          .from('conversations')
          .update({ last_message_at: new Date().toISOString() })
          .eq('id', conversationId);
      }

      // Refresh messages to ensure consistency
      await fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchMessages();

    if (!user || !receiverId) return;

    // Subscribe to real-time messages
    const channel = supabase
      .channel(`messages:${user.id}:${receiverId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id}))`
        },
        async (payload) => {
          console.log('New message received:', payload);
          const newMessage = payload.new as Message;
          
          // Get sender profile for the new message
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('full_name, profile_photo')
            .eq('id', newMessage.sender_id)
            .single();

          const messageWithProfile = {
            ...newMessage,
            sender_profile: senderProfile
          };

          setMessages(prev => {
            // Check if message already exists
            if (prev.find(msg => msg.id === newMessage.id)) {
              return prev;
            }
            return [...prev, messageWithProfile];
          });

          // Show notification if message is from other user
          if (newMessage.sender_id !== user.id) {
            // Request notification permission if not granted
            if ('Notification' in window && Notification.permission === 'default') {
              await Notification.requestPermission();
            }

            // Play notification sound
            try {
              const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
              const oscillator = audioContext.createOscillator();
              const gainNode = audioContext.createGain();
              
              oscillator.connect(gainNode);
              gainNode.connect(audioContext.destination);
              
              oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
              oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
              
              gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
              gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
              
              oscillator.start(audioContext.currentTime);
              oscillator.stop(audioContext.currentTime + 0.3);
            } catch (error) {
              console.log('Could not play sound:', error);
            }

            // Show system notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`New message from ${senderProfile?.full_name || 'User'}`, {
                body: newMessage.content,
                icon: '/icon-192.png'
              });
            }
          }
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
