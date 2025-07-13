import React, { useEffect } from 'react';
import heroImage from '@/assets/hero-pets.jpg';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-peach flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm mx-auto">
        <img 
          src={heroImage} 
          alt="Paws & Homes pets" 
          className="w-full h-64 object-cover rounded-3xl mb-8 shadow-lg"
        />
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Paws & Homes
          </h1>
          <p className="text-lg text-warm-gray-dark">
            Find your perfect companion
          </p>
        </div>
        
        <div className="flex justify-center mt-8">
          <div className="animate-pulse flex space-x-2">
            <div className="w-2 h-2 bg-orange-primary rounded-full"></div>
            <div className="w-2 h-2 bg-orange-secondary rounded-full"></div>
            <div className="w-2 h-2 bg-orange-primary rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}