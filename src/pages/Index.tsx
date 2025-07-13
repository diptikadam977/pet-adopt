
import React, { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/splash-screen';
import { AuthScreen } from '@/components/auth/auth-screen';
import { HomeScreen } from '@/components/home-screen';
import { SearchScreen } from '@/components/search-screen';
import { PetProfile } from '@/components/pet-profile';
import { AddPetScreen } from '@/components/add-pet-screen';
import { ProfileScreen } from '@/components/profile-screen';
import { ChatScreen } from '@/components/chat-screen';
import { AdoptionRequestScreen } from '@/components/adoption-request-screen';
import { BottomNav } from '@/components/ui/bottom-nav';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

type Screen = 
  | 'splash'
  | 'auth'
  | 'home'
  | 'search'
  | 'pet-profile'
  | 'add-pet'
  | 'profile'
  | 'chat'
  | 'adoption-request';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const { user, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);

  const handleSplashComplete = () => {
    setCurrentScreen('home');
  };

  const handleAuth = () => {
    setCurrentScreen('auth');
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'profile' && !user) {
      setCurrentScreen('auth');
      return;
    }
    
    setActiveTab(tab);
    switch (tab) {
      case 'home':
        setCurrentScreen('home');
        break;
      case 'search':
        setCurrentScreen('search');
        break;
      case 'add':
        if (!user) {
          setCurrentScreen('auth');
        } else {
          setCurrentScreen('add-pet');
        }
        break;
      case 'profile':
        setCurrentScreen('profile');
        break;
    }
  };

  const handlePetClick = (petId: string) => {
    setSelectedPetId(petId);
    setCurrentScreen('pet-profile');
  };

  const handleAddPetSubmit = () => {
    setCurrentScreen('home');
    setActiveTab('home');
    toast({
      title: "Pet listed successfully!",
      description: "Your pet has been added to the platform.",
    });
  };

  const handleAdopt = (pet: any) => {
    if (!user) {
      setCurrentScreen('auth');
      return;
    }
    setSelectedPet(pet);
    setCurrentScreen('adoption-request');
  };

  const handleChat = () => {
    setCurrentScreen('chat');
  };

  const handleBack = () => {
    if (currentScreen === 'search' || currentScreen === 'pet-profile' || 
        currentScreen === 'add-pet' || currentScreen === 'profile' || 
        currentScreen === 'chat' || currentScreen === 'adoption-request') {
      setCurrentScreen('home');
      setActiveTab('home');
    } else if (currentScreen === 'auth') {
      setCurrentScreen('home');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-primary"></div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onComplete={handleSplashComplete} />;
      case 'auth':
        return <AuthScreen onBack={handleBack} />;
      case 'home':
        return (
          <HomeScreen 
            onPetClick={handlePetClick}
            onAddPet={() => user ? setCurrentScreen('add-pet') : handleAuth()}
            onSearch={() => setCurrentScreen('search')}
            onAuth={handleAuth}
          />
        );
      case 'search':
        return <SearchScreen onBack={handleBack} onPetClick={handlePetClick} />;
      case 'pet-profile':
        return (
          <PetProfile 
            onBack={handleBack} 
            onAdopt={handleAdopt} 
            onChat={handleChat}
            petId={selectedPetId}
          />
        );
      case 'add-pet':
        return <AddPetScreen onBack={handleBack} onSubmit={handleAddPetSubmit} />;
      case 'profile':
        return <ProfileScreen onBack={handleBack} />;
      case 'chat':
        return <ChatScreen onBack={handleBack} />;
      case 'adoption-request':
        return (
          <AdoptionRequestScreen 
            onBack={handleBack} 
            pet={selectedPet}
          />
        );
      default:
        return (
          <HomeScreen 
            onPetClick={handlePetClick}
            onAddPet={() => user ? setCurrentScreen('add-pet') : handleAuth()}
            onSearch={() => setCurrentScreen('search')}
            onAuth={handleAuth}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderScreen()}
      {!['splash', 'auth', 'chat', 'adoption-request'].includes(currentScreen) && (
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      )}
    </div>
  );
}

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
