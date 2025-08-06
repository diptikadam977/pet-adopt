
import React, { useState } from 'react';
import { OnboardingScreen } from '@/components/onboarding-screen';
import { EnhancedHomeScreen } from '@/components/enhanced-home-screen';
import { SearchScreen } from '@/components/search-screen';
import { MyListingsScreen } from '@/components/my-listings-screen';
import { EnhancedAddPetScreen } from '@/components/enhanced-add-pet-screen';
import { EnhancedProfileScreen } from '@/components/enhanced-profile-screen';
import { PetProfile } from '@/components/pet-profile';
import { ChatScreen } from '@/components/chat-screen';
import { ConversationsScreen } from '@/components/conversations-screen';
import { AuthScreen } from '@/components/auth/auth-screen';
import { AdoptionRequestScreen } from '@/components/adoption-request-screen';
import { BottomNav } from '@/components/ui/bottom-nav';
import { AuthProvider, useAuth } from '@/hooks/useAuth';

type Screen = 'onboarding' | 'auth' | 'home' | 'search' | 'add' | 'requests' | 'profile' | 'my-listings' | 'add-pet' | 'pet-profile' | 'chat' | 'conversations' | 'adopt';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [chatData, setChatData] = useState<{
    conversationId: string;
    otherUserId: string;
    petName: string;
    petId: string;
  } | null>(null);
  const [adoptionPet, setAdoptionPet] = useState<any>(null);
  const { user, loading } = useAuth();

  // Show onboarding screen initially
  if (currentScreen === 'onboarding') {
    return (
      <OnboardingScreen 
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
        return <EnhancedHomeScreen onPetSelect={handlePetSelect} />;
      case 'search':
        return <SearchScreen onPetSelect={handlePetSelect} />;
      case 'add':
        return (
          <MyListingsScreen
            onBack={() => setCurrentScreen('home')}
            onAddPet={() => setCurrentScreen('add-pet')}
            onPetSelect={handlePetSelect}
          />
        );
      case 'requests':
        return (
          <ConversationsScreen
            onBack={() => setCurrentScreen('home')}
            onOpenChat={handleChatOpen}
          />
        );
      case 'profile':
        return (
          <EnhancedProfileScreen
            onBack={() => setCurrentScreen('home')}
          />
        );
      case 'add-pet':
        return (
          <EnhancedAddPetScreen
            onBack={() => setCurrentScreen('add')}
            onSubmit={() => setCurrentScreen('add')}
          />
        );
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
            onBack={() => setCurrentScreen('requests')}
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
        return <EnhancedHomeScreen onPetSelect={handlePetSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderScreen()}
      
      {/* Bottom Navigation */}
      {!['chat', 'pet-profile', 'adopt', 'add-pet', 'my-listings'].includes(currentScreen) && (
        <BottomNav
          currentScreen={currentScreen}
          onScreenChange={(screen) => setCurrentScreen(screen as Screen)}
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
