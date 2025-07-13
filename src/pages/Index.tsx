import React, { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/splash-screen';
import { LoginScreen } from '@/components/auth/login-screen';
import { SignUpScreen } from '@/components/auth/signup-screen';
import { HomeScreen } from '@/components/home-screen';
import { SearchScreen } from '@/components/search-screen';
import { PetProfile } from '@/components/pet-profile';
import { AddPetScreen } from '@/components/add-pet-screen';
import { ProfileScreen } from '@/components/profile-screen';
import { ChatScreen } from '@/components/chat-screen';
import { BottomNav } from '@/components/ui/bottom-nav';
import { useToast } from '@/hooks/use-toast';

type Screen = 
  | 'splash'
  | 'login' 
  | 'signup'
  | 'home'
  | 'search'
  | 'pet-profile'
  | 'add-pet'
  | 'profile'
  | 'chat';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const handleSplashComplete = () => {
    setCurrentScreen('login');
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentScreen('home');
    toast({
      title: "Welcome back!",
      description: "You have successfully logged in.",
    });
  };

  const handleSignUp = () => {
    setIsAuthenticated(true);
    setCurrentScreen('home');
    toast({
      title: "Account created!",
      description: "Welcome to Paws & Homes!",
    });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case 'home':
        setCurrentScreen('home');
        break;
      case 'search':
        setCurrentScreen('search');
        break;
      case 'add':
        setCurrentScreen('add-pet');
        break;
      case 'profile':
        setCurrentScreen('profile');
        break;
    }
  };

  const handlePetClick = (petId: string) => {
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

  const handleAdopt = () => {
    toast({
      title: "Adoption request sent!",
      description: "The owner will be notified of your interest.",
    });
  };

  const handleChat = () => {
    setCurrentScreen('chat');
  };

  const handleBack = () => {
    if (currentScreen === 'search' || currentScreen === 'pet-profile' || currentScreen === 'add-pet' || currentScreen === 'profile' || currentScreen === 'chat') {
      setCurrentScreen('home');
      setActiveTab('home');
    }
  };

  if (!isAuthenticated) {
    if (currentScreen === 'splash') {
      return <SplashScreen onComplete={handleSplashComplete} />;
    }
    if (currentScreen === 'signup') {
      return <SignUpScreen onSignUp={handleSignUp} onLogin={() => setCurrentScreen('login')} />;
    }
    return <LoginScreen onLogin={handleLogin} onSignUp={() => setCurrentScreen('signup')} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen 
            onPetClick={handlePetClick}
            onAddPet={() => setCurrentScreen('add-pet')}
            onSearch={() => setCurrentScreen('search')}
          />
        );
      case 'search':
        return <SearchScreen onBack={handleBack} onPetClick={handlePetClick} />;
      case 'pet-profile':
        return <PetProfile onBack={handleBack} onAdopt={handleAdopt} onChat={handleChat} />;
      case 'add-pet':
        return <AddPetScreen onBack={handleBack} onSubmit={handleAddPetSubmit} />;
      case 'profile':
        return <ProfileScreen onBack={handleBack} />;
      case 'chat':
        return <ChatScreen onBack={handleBack} />;
      default:
        return (
          <HomeScreen 
            onPetClick={handlePetClick}
            onAddPet={() => setCurrentScreen('add-pet')}
            onSearch={() => setCurrentScreen('search')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderScreen()}
      {isAuthenticated && !['chat'].includes(currentScreen) && (
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      )}
    </div>
  );
};

export default Index;
