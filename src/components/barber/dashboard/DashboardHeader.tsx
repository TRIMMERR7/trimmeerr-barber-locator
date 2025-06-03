
import React from 'react';
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onBack: () => void;
}

const DashboardHeader = ({ onBack }: DashboardHeaderProps) => {
  return (
    <div className="bg-black border-b border-gray-800 p-2 sm:p-4 flex-shrink-0">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-gray-400 hover:text-white h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
          >
            ← Back
          </Button>
          <h1 className="text-sm sm:text-xl font-semibold text-white">Barber Dashboard</h1>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
