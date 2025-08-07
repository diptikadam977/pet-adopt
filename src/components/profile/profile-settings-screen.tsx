
import React, { useState } from 'react';
import { ArrowLeft, User, Bell, Shield, HelpCircle, Info, LogOut, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';

interface ProfileSettingsScreenProps {
  onBack: () => void;
  onNavigate?: (screen: string) => void;
}

export function ProfileSettingsScreen({ onBack, onNavigate }: ProfileSettingsScreenProps) {
  const { signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  const settingsItems = [
    {
      icon: User,
      title: 'Account Information',
      subtitle: 'Manage your personal details',
      action: () => onNavigate?.('account-info'),
      showArrow: true
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Control your notification preferences',
      hasSwitch: true,
      value: notifications,
      onToggle: setNotifications
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      subtitle: 'Manage privacy settings',
      action: () => onNavigate?.('privacy-security'),
      showArrow: true
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get help with the app',
      action: () => onNavigate?.('help'),
      showArrow: true
    },
    {
      icon: Info,
      title: 'About',
      subtitle: 'App version and information',
      action: () => onNavigate?.('about'),
      showArrow: true
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
          <h1 className="text-xl font-bold text-primary">Settings</h1>
        </div>
      </div>

      {/* Settings Items */}
      <div className="px-6 space-y-4">
        {settingsItems.map((item, index) => (
          <Card 
            key={index} 
            className="rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
            onClick={item.action}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-light/20 rounded-full flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-orange-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-primary">{item.title}</h4>
                  <p className="text-warm-gray-dark text-sm">{item.subtitle}</p>
                </div>
                {item.hasSwitch && (
                  <Switch
                    checked={item.value}
                    onCheckedChange={item.onToggle}
                  />
                )}
                {item.showArrow && (
                  <ChevronRight className="w-5 h-5 text-warm-gray-dark" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Sign Out */}
        <Card className="rounded-2xl mt-8">
          <CardContent className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-red-50"
              onClick={signOut}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
