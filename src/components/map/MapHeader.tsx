
import React from 'react';
import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MapHeaderProps {
  userType: 'barber' | 'client';
  onAIAssistantClick: () => void;
  onDashboardClick?: () => void;
  onMenuClick: () => void;
}

const MapHeader = ({ userType, onAIAssistantClick, onDashboardClick, onMenuClick }: MapHeaderProps) => {
  const { signOut } = useAuth();

  return (
    <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 p-2 sm:p-4 flex-shrink-0">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-1 sm:gap-3 flex-1 justify-center md:justify-start">
          <img 
            src="/lovable-uploads/2c7510e8-8ef4-48d7-b2e9-8ee1afed1e54.png" 
            alt="TRIMMERR Logo" 
            className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
          />
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
            TRIMMERR
          </h1>
        </div>
        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0 md:absolute md:right-4">
          <Button 
            variant="ghost" 
            onClick={onMenuClick}
            className="text-white hover:text-red-300 hover:bg-white/10 rounded-xl touch-manipulation h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm font-semibold backdrop-blur-sm"
          >
            <Menu className="w-4 h-4" />
          </Button>

          {userType === 'barber' && onDashboardClick && (
            <Button 
              onClick={onDashboardClick}
              className="bg-red-600/80 hover:bg-red-700/90 text-white rounded-xl touch-manipulation shadow-lg h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm backdrop-blur-sm border border-white/20"
            >
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Profile</span>
            </Button>
          )}
          <Button 
            variant="ghost" 
            onClick={signOut}
            className="text-white hover:text-red-300 hover:bg-white/10 rounded-xl touch-manipulation h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm backdrop-blur-sm"
          >
            <span className="hidden sm:inline">Sign Out</span>
            <span className="sm:hidden">Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapHeader;
