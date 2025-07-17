
import React from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useConversations } from '@/hooks/useConversations';
import { useAuth } from '@/hooks/useAuth';

interface ConversationsScreenProps {
  onBack: () => void;
  onOpenChat: (conversationId: string, otherUserId: string, petName: string, petId: string) => void;
}

export function ConversationsScreen({ onBack, onOpenChat }: ConversationsScreenProps) {
  const { conversations, loading } = useConversations();
  const { user } = useAuth();

  const getOtherUser = (conversation: any) => {
    if (conversation.owner_id === user?.id) {
      return {
        id: conversation.interested_user_id,
        name: conversation.interested_profile?.full_name || 'User',
        photo: conversation.interested_profile?.profile_photo
      };
    } else {
      return {
        id: conversation.owner_id,
        name: conversation.owner_profile?.full_name || 'Owner',
        photo: conversation.owner_profile?.profile_photo
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-background px-6 pt-12 pb-4 border-b border-warm-gray">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-primary">Messages</h1>
        </div>
      </div>

      {/* Conversations List */}
      <div className="px-6 py-4">
        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 mx-auto text-warm-gray-dark mb-4" />
            <h3 className="text-lg font-semibold text-primary mb-2">No conversations yet</h3>
            <p className="text-warm-gray-dark">Start chatting with pet owners by messaging them from pet profiles!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conversation) => {
              const otherUser = getOtherUser(conversation);
              return (
                <Card 
                  key={conversation.id} 
                  className="rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onOpenChat(conversation.id, otherUser.id, conversation.pets?.name || 'Pet', conversation.pet_id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={otherUser.photo} alt={otherUser.name} />
                        <AvatarFallback className="bg-orange-light text-orange-primary">
                          {otherUser.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-primary truncate">{otherUser.name}</h3>
                          <span className="text-xs text-warm-gray-dark">
                            {new Date(conversation.last_message_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-warm-gray-dark">About {conversation.pets?.name}</p>
                      </div>
                      {conversation.pets?.images?.[0] && (
                        <img 
                          src={conversation.pets.images[0]} 
                          alt={conversation.pets.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
