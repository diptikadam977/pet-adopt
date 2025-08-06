
import React from 'react';
import { ArrowLeft, MessageCircle, Mail, Phone, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface HelpSupportScreenProps {
  onBack: () => void;
}

export function HelpSupportScreen({ onBack }: HelpSupportScreenProps) {
  const supportOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      subtitle: 'Chat with our support team',
      action: () => console.log('Open live chat')
    },
    {
      icon: Mail,
      title: 'Email Support',
      subtitle: 'Send us an email',
      action: () => window.open('mailto:support@pawshomes.com')
    },
    {
      icon: Phone,
      title: 'Call Us',
      subtitle: '+1 (555) 123-4567',
      action: () => window.open('tel:+15551234567')
    },
    {
      icon: FileText,
      title: 'FAQ',
      subtitle: 'Find answers to common questions',
      action: () => console.log('Open FAQ')
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-primary">Help & Support</h1>
        </div>
      </div>

      {/* Support Options */}
      <div className="px-6 space-y-4">
        {supportOptions.map((option, index) => (
          <Card 
            key={index} 
            className="rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
            onClick={option.action}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-light/20 rounded-full flex items-center justify-center">
                  <option.icon className="w-6 h-6 text-orange-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-primary">{option.title}</h4>
                  <p className="text-warm-gray-dark text-sm">{option.subtitle}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Info */}
      <div className="px-6 mt-8">
        <Card className="rounded-2xl">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-bold text-primary mb-2">Need More Help?</h3>
            <p className="text-warm-gray-dark mb-4">
              Our support team is available Monday - Friday, 9 AM - 6 PM EST
            </p>
            <Button className="bg-orange-primary hover:bg-orange-secondary text-white">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
