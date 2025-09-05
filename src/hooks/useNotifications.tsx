import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// Create notification sound
const playNotificationSound = () => {
  // Create a simple notification tone programmatically
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Create a simple beep sound like WhatsApp
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
};

export function useNotifications() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Listen for adoption requests
    const adoptionChannel = supabase
      .channel(`adoption-requests:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'adoption_requests',
          filter: `owner_id.eq.${user.id}`
        },
        async (payload) => {
          const request = payload.new;
          
          // Get pet and requester info
          const { data: pet } = await supabase
            .from('pets')
            .select('name')
            .eq('id', request.pet_id)
            .single();

          const { data: requester } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', request.requester_id)
            .single();

          toast.success(`New adoption inquiry for ${pet?.name}`, {
            description: `${requester?.full_name} is interested in adopting your pet`
          });

          // Play notification sound
          try {
            playNotificationSound();
          } catch (error) {
            console.log('Could not play sound:', error);
          }

          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`New adoption inquiry for ${pet?.name}`, {
              body: `${requester?.full_name} is interested in adopting your pet`,
              icon: '/icon-192.png'
            });
          }
        }
      )
      .subscribe();

    // Listen for adoption request updates (accepted/rejected)
    const statusChannel = supabase
      .channel(`adoption-status:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'adoption_requests',
          filter: `requester_id.eq.${user.id}`
        },
        async (payload) => {
          const request = payload.new;
          
          if (request.status === 'accepted') {
            const { data: pet } = await supabase
              .from('pets')
              .select('name')
              .eq('id', request.pet_id)
              .single();

            toast.success(`Adoption request accepted!`, {
              description: `Your request for ${pet?.name} has been accepted`
            });

            // Play notification sound
            try {
              playNotificationSound();
            } catch (error) {
              console.log('Could not play sound:', error);
            }

            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Adoption request accepted!', {
                body: `Your request for ${pet?.name} has been accepted`,
                icon: '/icon-192.png'
              });
            }
          } else if (request.status === 'rejected') {
            const { data: pet } = await supabase
              .from('pets')
              .select('name')
              .eq('id', request.pet_id)
              .single();

            toast.error(`Adoption request declined`, {
              description: `Your request for ${pet?.name} was declined`
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(adoptionChannel);
      supabase.removeChannel(statusChannel);
    };
  }, [user]);

  return null;
}