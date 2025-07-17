
import React, { useState } from 'react';
import { HomeScreen } from '@/components/home-screen';
import { SearchScreen } from '@/components/search-screen';
import { PetProfile } from '@/components/pet-profile';
import { ProfileScreen } from '@/components/profile-screen';
import { ChatScreen } from '@/components/chat-screen';
import { ConversationsScreen } from '@/components/conversations-screen';
import { AuthScreen } from '@/components/auth/auth-screen';
import { AdoptionRequestScreen } from '@/components/adoption-request-screen';
import { BottomNav } from '@/components/ui/bottom-nav';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { SplashScreen } from '@/components/splash-screen';

type Screen = 'splash' | 'auth' | 'home' | 'search' | 'profile' | 'pet-profile' | 'chat' | 'conversations' | 'adopt';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [chatData, setChatData] = useState<{
    conversationId: string;
    otherUserId: string;
    petName: string;
    petId: string;
  } | null>(null);
  const [adoptionPet, setAdoptionPet] = useState<any>(null);
  const { user, loading } = useAuth();

  // Show splash screen initially
  if (currentScreen === 'splash') {
    return (
      <SplashScreen 
        onComplete={() => setCurrentScreen(user ? 'home' : 'auth')} 
      />
    );
  }

  // Show auth screen if not authenticated
  if (!user && !loading) {
    return <AuthScreen />;
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-primary"></div>
      </div>
    );
  }

  const handlePetSelect = (petId: string) => {
    setSelectedPetId(petId);
    setCurrentScreen('pet-profile');
  };

  const handleChatOpen = (conversationId: string, otherUserId: string, petName: string, petId: string) => {
    setChatData({ conversationId, otherUserId, petName, petId });
    setCurrentScreen('chat');
  };

  const handleAdoptionRequest = (pet: any) => {
    setAdoptionPet(pet);
    setCurrentScreen('adopt');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen 
            onPetSelect={handlePetSelect}
            onNavigateToMessages={() => setCurrentScreen('conversations')}
          />
        );
      case 'search':
        return <SearchScreen onPetSelect={handlePetSelect} />;
      case 'profile':
        return <ProfileScreen onBack={() => setCurrentScreen('home')} />;
      case 'pet-profile':
        return (
          <PetProfile
            petId={selectedPetId}
            onBack={() => setCurrentScreen('home')}
            onAdopt={handleAdoptionRequest}
            onChat={handleChatOpen}
          />
        );
      case 'conversations':
        return (
          <ConversationsScreen
            onBack={() => setCurrentScreen('home')}
            onOpenChat={handleChatOpen}
          />
        );
      case 'chat':
        return chatData ? (
          <ChatScreen
            onBack={() => setCurrentScreen('conversations')}
            conversationId={chatData.conversationId}
            otherUserId={chatData.otherUserId}
            petName={chatData.petName}
            petId={chatData.petId}
          />
        ) : null;
      case 'adopt':
        return adoptionPet ? (
          <AdoptionRequestScreen
            pet={adoptionPet}
            onBack={() => setCurrentScreen('pet-profile')}
          />
        ) : null;
      default:
        return <HomeScreen onPetSelect={handlePetSelect} onNavigateToMessages={() => setCurrentScreen('conversations')} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderScreen()}
      
      {/* Bottom Navigation */}
      {!['chat', 'pet-profile', 'adopt'].includes(currentScreen) && (
        <BottomNav
          currentScreen={currentScreen === 'conversations' ? 'profile' : currentScreen}
          onScreenChange={(screen) => {
            if (screen === 'profile') {
              setCurrentScreen('profile');
            } else {
              setCurrentScreen(screen as Screen);
            }
          }}
        />
      )}
    </div>
  );
}

export default function Index() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
