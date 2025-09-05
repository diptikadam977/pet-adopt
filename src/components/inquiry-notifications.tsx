import React from 'react';
import { Bell, Heart, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Inquiry {
  id: string;
  pet_id: string;
  requester_id: string;
  message: string;
  status: string;
  created_at: string;
  pet: {
    name: string;
    images: string[];
  };
  requester: {
    full_name: string;
    profile_photo: string;
  };
}

interface InquiryNotificationsProps {
  onBack: () => void;
  onChat: (conversationId: string, otherUserId: string, petName: string, petId: string) => void;
}

export function InquiryNotifications({ onBack, onChat }: InquiryNotificationsProps) {
  const [inquiries, setInquiries] = React.useState<Inquiry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { user } = useAuth();

  React.useEffect(() => {
    fetchInquiries();
  }, [user]);

  const fetchInquiries = async () => {
    if (!user) return;

    try {
    const { data, error } = await supabase
      .from('adoption_requests')
      .select(`
        *,
        pet:pets(name, images)
      `)
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get requester profiles separately
    const inquiriesWithProfiles = await Promise.all(
      (data || []).map(async (inquiry) => {
        const { data: requesterProfile } = await supabase
          .from('profiles')
          .select('full_name, profile_photo')
          .eq('id', inquiry.requester_id)
          .single();

        return {
          ...inquiry,
          requester: requesterProfile || { full_name: 'Unknown User', profile_photo: '' }
        };
      })
    );

    setInquiries(inquiriesWithProfiles);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleInquiryResponse = async (inquiryId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('adoption_requests')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', inquiryId);

      if (error) throw error;

      toast.success(`Inquiry ${status} successfully`);
      fetchInquiries();
    } catch (error) {
      console.error('Error updating inquiry:', error);
      toast.error(`Failed to ${status.replace('ed', '')} inquiry`);
    }
  };

  const handleStartChat = async (inquiry: Inquiry) => {
    try {
      // Create or find conversation
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('pet_id', inquiry.pet_id)
        .eq('owner_id', user?.id)
        .eq('interested_user_id', inquiry.requester_id)
        .single();

      let conversationId = existingConversation?.id;

      if (!conversationId) {
        const { data: newConversation, error } = await supabase
          .from('conversations')
          .insert({
            pet_id: inquiry.pet_id,
            owner_id: user?.id,
            interested_user_id: inquiry.requester_id
          })
          .select('id')
          .single();

        if (error) throw error;
        conversationId = newConversation.id;
      }

      onChat(conversationId, inquiry.requester_id, inquiry.pet.name, inquiry.pet_id);
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Failed to start chat');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-background px-6 pt-12 pb-4 border-b border-warm-gray">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <Bell className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold text-primary">Pet Inquiries</h1>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 py-4">
        {inquiries.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-warm-gray-dark mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-primary mb-2">No inquiries yet</h3>
            <p className="text-warm-gray-dark">You'll see adoption inquiries for your pets here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <Card key={inquiry.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-warm-gray/20">
                    <img 
                      src={inquiry.pet.images?.[0] || '/placeholder.svg'} 
                      alt={inquiry.pet.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-primary">{inquiry.pet.name}</h3>
                      <Badge variant={
                        inquiry.status === 'accepted' ? 'default' :
                        inquiry.status === 'rejected' ? 'destructive' : 'secondary'
                      }>
                        {inquiry.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-warm-gray-dark mb-2">
                      <strong>{inquiry.requester.full_name}</strong> is interested in adopting
                    </p>
                    
                    {inquiry.message && (
                      <p className="text-sm text-primary mb-3 italic">"{inquiry.message}"</p>
                    )}
                    
                    <p className="text-xs text-warm-gray-dark mb-3">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </p>
                    
                    <div className="flex gap-2">
                      {inquiry.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => handleInquiryResponse(inquiry.id, 'accepted')}
                            className="flex items-center gap-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleInquiryResponse(inquiry.id, 'rejected')}
                            className="flex items-center gap-1"
                          >
                            <XCircle className="w-4 h-4" />
                            Decline
                          </Button>
                        </>
                      )}
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStartChat(inquiry)}
                        className="flex items-center gap-1"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Chat
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}