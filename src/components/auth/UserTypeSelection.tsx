
import React from 'react';
import { Button } from "@/components/ui/button";
import { Users, Scissors } from 'lucide-react';

interface UserTypeSelectionProps {
  selectedUserType: 'client' | 'barber';
  onUserTypeChange: (userType: 'client' | 'barber') => void;
}

const UserTypeSelection = ({ selectedUserType, onUserTypeChange }: UserTypeSelectionProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 space-y-3">
      <h3 className="text-white text-lg font-semibold text-center mb-4">I want to join as a:</h3>
      
      <div className="grid grid-cols-1 gap-3">
        <Button
          type="button"
          onClick={() => onUserTypeChange('client')}
          className={`w-full h-16 text-left rounded-xl font-semibold backdrop-blur-sm border transition-all ${
            selectedUserType === 'client'
              ? 'bg-red-600/40 border-red-500 text-white shadow-lg'
              : 'bg-white/20 hover:bg-white/30 border-white/20 text-white'
          }`}
        >
          <div className="flex items-center justify-start space-x-3 w-full px-2">
            <div className="flex-shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-base font-semibold">Customer</div>
              <div className="text-xs opacity-80 leading-tight">Book appointments & find barbers</div>
            </div>
          </div>
        </Button>

        <Button
          type="button"
          onClick={() => onUserTypeChange('barber')}
          className={`w-full h-16 text-left rounded-xl font-semibold backdrop-blur-sm border transition-all ${
            selectedUserType === 'barber'
              ? 'bg-red-600/40 border-red-500 text-white shadow-lg'
              : 'bg-white/20 hover:bg-white/30 border-white/20 text-white'
          }`}
        >
          <div className="flex items-center justify-start space-x-3 w-full px-2">
            <div className="flex-shrink-0">
              <Scissors className="w-6 h-6" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-base font-semibold">Barber</div>
              <div className="text-xs opacity-80 leading-tight">Manage your shop & clients</div>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default UserTypeSelection;
