
import React from 'react';
import { Home, Search, Plus, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  currentScreen: string;
  onScreenChange: (screen: string) => void;
}

export function BottomNav({ currentScreen, onScreenChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'add', label: 'Listings', icon: Plus },
    { id: 'requests', label: 'Chat', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-warm-gray/30 px-2 sm:px-4 py-3 safe-area-pb z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onScreenChange(id)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-colors min-w-0 flex-1",
              currentScreen === id 
                ? "text-primary" 
                : "text-warm-gray-dark"
            )}
          >
            <div className={cn(
              "p-2 rounded-full transition-colors",
              currentScreen === id 
                ? "bg-primary text-white" 
                : "bg-transparent"
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium truncate">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
