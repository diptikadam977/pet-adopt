
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
    { id: 'add', label: 'Add', icon: Plus },
    { id: 'requests', label: 'Requests', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-2 sm:px-4 py-2 safe-area-pb z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onScreenChange(id)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-0 flex-1",
              currentScreen === id 
                ? "text-orange-primary" 
                : "text-warm-gray-dark hover:text-orange-secondary"
            )}
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs font-medium truncate">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
