
import React, { useState } from 'react';
import { ArrowLeft, User, Bell, Shield, HelpCircle, Info, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';

interface ProfileSettingsScreenProps {
  onBack: () => void;
}

export function ProfileSettingsScreen({ onBack }: ProfileSettingsScreenProps) {
  const { signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  const settingsItems = [
    {
      icon: User,
      title: 'Account Information',
      subtitle: 'Manage your personal details',
      action: () => console.log('Navigate to account info')
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
      action: () => console.log('Navigate to privacy')
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get help with the app',
      action: () => console.log('Navigate to help')
    },
    {
      icon: Info,
      title: 'About',
      subtitle: 'App version and information',
      action: () => console.log('Navigate to about')
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
          <Card key={index} className="rounded-2xl cursor-pointer hover:shadow-md transition-shadow">
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
