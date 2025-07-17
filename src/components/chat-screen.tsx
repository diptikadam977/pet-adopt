
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Image, Mic, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ChatScreenProps {
  onBack: () => void;
  conversationId: string;
  otherUserId: string;
  petName: string;
  petId: string;
}

export function ChatScreen({ onBack, conversationId, otherUserId, petName, petId }: ChatScreenProps) {
  const [message, setMessage] = useState('');
  const [otherUserProfile, setOtherUserProfile] = useState<any>(null);
  const { messages, sendMessage } = useMessages(conversationId, otherUserId);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchOtherUserProfile = async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, profile_photo')
          .eq('id', otherUserId)
          .single();
        
        setOtherUserProfile(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchOtherUserProfile();
  }, [otherUserId]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage(message, petId);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-background px-6 pt-12 pb-4 border-b border-warm-gray flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <Avatar className="w-10 h-10">
          <AvatarImage src={otherUserProfile?.profile_photo} alt={otherUserProfile?.full_name} />
          <AvatarFallback className="bg-orange-light text-orange-primary">
            {otherUserProfile?.full_name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-primary">{otherUserProfile?.full_name || 'User'}</h1>
          <p className="text-sm text-warm-gray-dark">About {petName}</p>
        </div>
        <Heart className="w-6 h-6 text-warm-gray-dark" />
      </div>

      {/* Messages */}
      <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-warm-gray-dark">Start your conversation about {petName}!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id}>
              <div className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'} mb-2`}>
                {msg.sender_id !== user?.id && (
                  <Avatar className="w-8 h-8 mr-2 mt-2">
                    <AvatarImage src={otherUserProfile?.profile_photo} alt={otherUserProfile?.full_name} />
                    <AvatarFallback className="bg-orange-light text-orange-primary">
                      {otherUserProfile?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  msg.sender_id === user?.id
                    ? 'bg-orange-primary text-white' 
                    : 'bg-warm-gray/30 text-primary'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
                {msg.sender_id === user?.id && (
                  <Avatar className="w-8 h-8 ml-2 mt-2">
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt="You" />
                    <AvatarFallback className="bg-orange-light text-orange-primary">
                      {user?.email?.charAt(0) || 'Y'}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
              <div className={`text-xs text-warm-gray-dark ${msg.sender_id === user?.id ? 'text-right mr-10' : 'text-left ml-10'}`}>
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="px-6 py-4 border-t border-warm-gray bg-background">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} alt="You" />
            <AvatarFallback className="bg-orange-light text-orange-primary">
              {user?.email?.charAt(0) || 'Y'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 flex items-center gap-2 bg-warm-gray/20 rounded-full px-4 py-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message about ${petName}...`}
              className="border-0 bg-transparent focus:ring-0 focus:ring-offset-0"
              onKeyPress={handleKeyPress}
            />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Image className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Mic className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Space */}
      <div className="h-20 bg-background"></div>
    </div>
  );
}
