
import React from 'react';
import { ArrowLeft, FileText, Heart, PawPrint, Settings, User, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

interface EnhancedProfileScreenProps {
  onBack: () => void;
}

export function EnhancedProfileScreen({ onBack }: EnhancedProfileScreenProps) {
  const { user, signOut } = useAuth();

  const statsData = [
    { label: 'Pets Adopted', value: '12' },
    { label: 'Pets Fostered', value: '3' }
  ];

  const activityItems = [
    { icon: FileText, title: 'Applications', subtitle: 'View your adoption applications' },
    { icon: Heart, title: 'Favorites', subtitle: 'Manage your saved pets' },
    { icon: PawPrint, title: 'Adoption History', subtitle: 'View your adoption history' }
  ];

  const settingsItems = [
    { icon: User, title: 'Account', subtitle: 'Manage your account settings' },
    { icon: HelpCircle, title: 'Help', subtitle: 'Get help with the app' }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-primary">Profile</h1>
        </div>

        {/* Profile Info */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-light to-orange-primary rounded-full mx-auto mb-4 flex items-center justify-center">
            <img 
              src="/lovable-uploads/0c0dbf2c-9788-4d51-a399-ce189a687b72.png"
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-primary">Olivia</h2>
          <p className="text-warm-gray-dark">San Francisco, CA</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {statsData.map((stat, index) => (
            <Card key={index} className="rounded-2xl">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-warm-gray-dark text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="rounded-2xl mb-6">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-1">2</div>
            <div className="text-warm-gray-dark text-sm">Favorites</div>
          </CardContent>
        </Card>
      </div>

      {/* My Activity Section */}
      <div className="px-6 mb-8">
        <h3 className="text-xl font-bold text-primary mb-4">My Activity</h3>
        <div className="space-y-4">
          {activityItems.map((item, index) => (
            <Card key={index} className="rounded-2xl cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-warm-gray/20 rounded-full flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-warm-gray-dark" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-primary">{item.title}</h4>
                    <p className="text-warm-gray-dark text-sm">{item.subtitle}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Settings Section */}
      <div className="px-6">
        <h3 className="text-xl font-bold text-primary mb-4">Settings</h3>
        <div className="space-y-4">
          {settingsItems.map((item, index) => (
            <Card key={index} className="rounded-2xl cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-warm-gray/20 rounded-full flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-warm-gray-dark" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-primary">{item.title}</h4>
                    <p className="text-warm-gray-dark text-sm">{item.subtitle}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
