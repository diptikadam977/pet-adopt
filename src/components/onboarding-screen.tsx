
import React from 'react';
import onboardingHero from '@/assets/onboarding-hero.jpg';
import { Button } from '@/components/ui/button';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      {/* Hero Image */}
      <div className="w-80 h-80 mb-8 rounded-full bg-gradient-to-br from-orange-light to-orange-primary/20 flex items-center justify-center">
        <img 
          src={onboardingHero} 
          alt="Find your perfect companion"
          className="w-72 h-72 rounded-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-primary mb-4">
          Find your perfect companion
        </h1>
        <p className="text-warm-gray-dark text-lg leading-relaxed max-w-sm mx-auto">
          Browse through our extensive list of adoptable pets and find the perfect match for your lifestyle.
        </p>
      </div>

      {/* CTA Button */}
      <Button 
        onClick={onComplete}
        className="w-full max-w-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg"
      >
        Start Browsing
      </Button>
    </div>
  );
}
