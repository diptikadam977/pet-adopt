import React, { useState } from 'react';
import { ArrowLeft, Send, Image, Mic, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  id: string;
  sender: 'user' | 'other';
  content: string;
  timestamp: string;
}

interface ChatScreenProps {
  onBack: () => void;
}

export function ChatScreen({ onBack }: ChatScreenProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'other',
      content: "Hi there! I'm really interested in adopting Max. Could you tell me a bit more about his personality and temperament?",
      timestamp: 'Today 10:23 AM'
    },
    {
      id: '2',
      sender: 'user',
      content: "Hi Sophie! Max is a very friendly and playful dog. He loves to run and play fetch, but he also enjoys cuddling on the couch. He's great with kids and other dogs, but he can be a bit shy around new people at first.",
      timestamp: 'Today 10:25 AM'
    },
    {
      id: '3',
      sender: 'other',
      content: "That sounds wonderful! Does he have any special needs or health concerns I should be aware of?",
      timestamp: 'Today 10:27 AM'
    },
    {
      id: '4',
      sender: 'user',
      content: "He's generally very healthy, but he does have a sensitive stomach, so he needs to be on a specific diet. I can provide you with the details if you'd like.",
      timestamp: 'Today 10:30 AM'
    }
  ]);

  const otherUser = {
    name: 'Sophie',
    avatar: '/lovable-uploads/8eb06a14-cd33-44d7-871d-b5780d546175.png'
  };

  const currentUser = {
    name: 'Liam',
    avatar: '/lovable-uploads/809569e1-bc95-4f34-a5d1-4ad64c00cdf3.png'
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        content: message,
        timestamp: 'Now'
      };
      setMessages([...messages, newMessage]);
      setMessage('');
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
          <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
          <AvatarFallback>S</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-primary">{otherUser.name}</h1>
        </div>
        <Heart className="w-6 h-6 text-warm-gray-dark" />
      </div>

      {/* Messages */}
      <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
        <div className="text-center">
          <p className="text-sm text-warm-gray-dark">Today 10:23 AM</p>
        </div>
        
        {messages.map((msg) => (
          <div key={msg.id}>
            <div className="text-sm text-warm-gray-dark mb-1">
              {msg.sender === 'other' ? otherUser.name : ''}
            </div>
            <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
              {msg.sender === 'other' && (
                <Avatar className="w-8 h-8 mr-2 mt-2">
                  <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                  <AvatarFallback>S</AvatarFallback>
                </Avatar>
              )}
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                msg.sender === 'user' 
                  ? 'bg-orange-primary text-white' 
                  : 'bg-warm-gray/30 text-primary'
              }`}>
                <p className="text-sm">{msg.content}</p>
              </div>
              {msg.sender === 'user' && (
                <Avatar className="w-8 h-8 ml-2 mt-2">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback>L</AvatarFallback>
                </Avatar>
              )}
            </div>
            <div className={`text-xs text-warm-gray-dark ${msg.sender === 'user' ? 'text-right mr-10' : 'text-left ml-10'}`}>
              {msg.sender === 'user' ? 'Liam' : ''}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="px-6 py-4 border-t border-warm-gray bg-background">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>L</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex items-center gap-2 bg-warm-gray/20 rounded-full px-4 py-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message"
              className="border-0 bg-transparent focus:ring-0 focus:ring-offset-0"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Image className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Mic className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Space */}
      <div className="h-20 bg-background"></div>
    </div>
  );
}