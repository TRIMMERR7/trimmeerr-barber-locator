
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Navigation } from "lucide-react";

interface ProfileHeaderProps {
  onBack: () => void;
  onNavigate?: () => void;
}

const ProfileHeader = ({ onBack, onNavigate }: ProfileHeaderProps) => {
  return (
    <div className="bg-black/60 backdrop-blur-md border-b border-white/20 p-4 flex-shrink-0">
      <div className="flex items-center gap-4 max-w-6xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-gray-300 hover:text-white hover:bg-white/10 rounded-xl touch-manipulation border border-white/20 backdrop-blur-sm"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <h1 className="text-xl font-semibold text-white flex-1">Book Appointment</h1>
        {onNavigate && (
          <Button 
            onClick={onNavigate}
            className="bg-blue-600/80 backdrop-blur-sm hover:bg-blue-700/80 text-white rounded-xl touch-manipulation shadow-lg border border-blue-500/30"
          >
            <Navigation className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Navigate</span>
            <span className="sm:hidden">Nav</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
