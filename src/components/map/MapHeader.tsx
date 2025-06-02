
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';

interface MapHeaderProps {
  userType: 'barber' | 'client';
  onAIAssistantClick: () => void;
  onDashboardClick?: () => void;
}

const MapHeader = ({ userType, onAIAssistantClick, onDashboardClick }: MapHeaderProps) => {
  const { signOut } = useAuth();

  return (
    <div className="bg-black/90 backdrop-blur-sm border-b border-gray-800 p-2 sm:p-4 flex-shrink-0">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
          <img 
            src="/lovable-uploads/2c7510e8-8ef4-48d7-b2e9-8ee1afed1e54.png" 
            alt="TRIMMERR Logo" 
            className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
          />
          <h1 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent truncate">
            TRIMMERR
          </h1>
        </div>
        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
          <Button 
            variant="ghost" 
            onClick={onAIAssistantClick}
            className="text-purple-400 hover:text-purple-300 hover:bg-gray-800 rounded-xl touch-manipulation h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm font-semibold"
          >
            AI Assistant
          </Button>

          {userType === 'barber' && onDashboardClick && (
            <Button 
              onClick={onDashboardClick}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl touch-manipulation shadow-lg h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Profile</span>
            </Button>
          )}
          <Button 
            variant="ghost" 
            onClick={signOut}
            className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl touch-manipulation h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
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
