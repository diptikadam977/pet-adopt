
import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Heart, PawPrint, Settings, User, HelpCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { useFavorites } from '@/hooks/useFavorites';
import { supabase } from '@/integrations/supabase/client';
import { ProfileSettingsScreen } from '@/components/profile/profile-settings-screen';
import { AccountInfoScreen } from '@/components/profile/account-info-screen';
import { PrivacySecurityScreen } from '@/components/profile/privacy-security-screen';
import { AboutScreen } from '@/components/profile/about-screen';
import { HelpSupportScreen } from '@/components/profile/help-support-screen';
import { AdminDashboard } from '@/components/admin/admin-dashboard';

interface EnhancedProfileScreenProps {
  onBack: () => void;
  onNavigate?: (screen: string) => void;
}

export function EnhancedProfileScreen({ onBack, onNavigate }: EnhancedProfileScreenProps) {
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const { favorites } = useFavorites();
  const [profile, setProfile] = useState<any>(null);
  const [adoptedCount, setAdoptedCount] = useState(0);
  const [currentScreen, setCurrentScreen] = useState('main');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const fetchAdoptedCount = async () => {
      if (!user) return;

      try {
        const { count } = await supabase
          .from('adoption_requests')
          .select('*', { count: 'exact', head: true })
          .eq('requester_id', user.id)
          .eq('status', 'approved');

        setAdoptedCount(count || 0);
      } catch (error) {
        console.error('Error fetching adopted count:', error);
      }
    };

    fetchProfile();
    fetchAdoptedCount();
  }, [user]);

  const handleSettingsNavigation = (screen: string) => {
    setCurrentScreen(screen);
  };

  const handleBackToMain = () => {
    setCurrentScreen('main');
  };

  const handleBackToSettings = () => {
    setCurrentScreen('settings');
  };

  // Render different screens based on currentScreen
  if (currentScreen === 'admin') {
    return <AdminDashboard onBack={handleBackToMain} />;
  }

  if (currentScreen === 'settings') {
    return (
      <ProfileSettingsScreen 
        onBack={handleBackToMain} 
        onNavigate={handleSettingsNavigation}
      />
    );
  }

  if (currentScreen === 'account-info') {
    return <AccountInfoScreen onBack={handleBackToSettings} />;
  }

  if (currentScreen === 'privacy-security') {
    return <PrivacySecurityScreen onBack={handleBackToSettings} />;
  }

  if (currentScreen === 'about') {
    return <AboutScreen onBack={handleBackToSettings} />;
  }

  if (currentScreen === 'help') {
    return <HelpSupportScreen onBack={handleBackToSettings} />;
  }

  const activityItems = [
    { 
      icon: FileText, 
      title: 'Applications', 
      subtitle: 'View your adoption applications',
      action: () => onNavigate?.('applications')
    },
    { 
      icon: Heart, 
      title: 'Favorites', 
      subtitle: 'Manage your saved pets',
      action: () => onNavigate?.('favorites')
    },
    { 
      icon: PawPrint, 
      title: 'Adoption History', 
      subtitle: 'View your adoption history',
      action: () => onNavigate?.('history')
    }
  ];

  const settingsItems = [
    ...(isAdmin ? [{ 
      icon: Shield, 
      title: 'Admin Dashboard', 
      subtitle: 'Manage platform and users',
      action: () => setCurrentScreen('admin')
    }] : []),
    { 
      icon: Settings, 
      title: 'Settings', 
      subtitle: 'Manage app preferences and account',
      action: () => setCurrentScreen('settings')
    },
    { 
      icon: HelpCircle, 
      title: 'Help', 
      subtitle: 'Get help with the app',
      action: () => setCurrentScreen('help')
    }
  ];

  const getUserDisplayName = () => {
    if (profile?.full_name) return profile.full_name;
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.user_metadata?.name) return user.user_metadata.name;
    return user?.email?.split('@')[0] || 'User';
  };

  const getUserProfileImage = () => {
    if (profile?.profile_photo) return profile.profile_photo;
    if (user?.user_metadata?.avatar_url) return user.user_metadata.avatar_url;
    return null;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-primary">Profile</h1>
          {isAdmin && (
            <div className="ml-auto">
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                Admin
              </span>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-light to-orange-primary rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
            {getUserProfileImage() ? (
              <img 
                src={getUserProfileImage()}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-white" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-primary">{getUserDisplayName()}</h2>
          <p className="text-warm-gray-dark">{profile?.location || user?.email}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="rounded-2xl">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-1">{adoptedCount}</div>
              <div className="text-warm-gray-dark text-sm">Pets Adopted</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-1">{favorites.length}</div>
              <div className="text-warm-gray-dark text-sm">Favorites</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* My Activity Section */}
      <div className="px-6 mb-8">
        <h3 className="text-xl font-bold text-primary mb-4">My Activity</h3>
        <div className="space-y-4">
          {activityItems.map((item, index) => (
            <Card 
              key={index} 
              className="rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
              onClick={item.action}
            >
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
            <Card 
              key={index} 
              className={`rounded-2xl cursor-pointer hover:shadow-md transition-shadow ${
                item.title === 'Admin Dashboard' ? 'bg-red-50 border-red-200' : ''
              }`}
              onClick={item.action}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    item.title === 'Admin Dashboard' ? 'bg-red-100' : 'bg-warm-gray/20'
                  }`}>
                    <item.icon className={`w-6 h-6 ${
                      item.title === 'Admin Dashboard' ? 'text-red-600' : 'text-warm-gray-dark'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold ${
                      item.title === 'Admin Dashboard' ? 'text-red-600' : 'text-primary'
                    }`}>
                      {item.title}
                    </h4>
                    <p className={`text-sm ${
                      item.title === 'Admin Dashboard' ? 'text-red-400' : 'text-warm-gray-dark'
                    }`}>
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Logout Button */}
          <Card className="rounded-2xl cursor-pointer hover:shadow-md transition-shadow bg-red-50">
            <CardContent className="p-4" onClick={signOut}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <ArrowLeft className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-red-600">Sign Out</h4>
                  <p className="text-red-400 text-sm">Log out of your account</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
