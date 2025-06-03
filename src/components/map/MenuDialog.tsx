
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bot, Info, Trophy } from 'lucide-react';

interface MenuDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAIAssistantClick: () => void;
  onAboutUsClick: () => void;
  onBarbersOfTheYearClick: () => void;
}

const MenuDialog = ({ isOpen, onClose, onAIAssistantClick, onAboutUsClick, onBarbersOfTheYearClick }: MenuDialogProps) => {
  const handleAIClick = () => {
    onAIAssistantClick();
    onClose();
  };

  const handleAboutClick = () => {
    onAboutUsClick();
    onClose();
  };

  const handleBarbersOfTheYearClick = () => {
    onBarbersOfTheYearClick();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/40 backdrop-blur-2xl border border-white/20 text-white max-w-md shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
            Menu
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 mt-6">
          <Button
            onClick={handleAIClick}
            className="w-full justify-start bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm"
          >
            <Bot className="w-5 h-5 mr-3" />
            AI Styling Assistant
          </Button>
          
          <Button
            onClick={handleBarbersOfTheYearClick}
            className="w-full justify-start bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300 border border-yellow-500/30 rounded-xl p-4 backdrop-blur-sm"
          >
            <Trophy className="w-5 h-5 mr-3" />
            Barbers of the Year
          </Button>
          
          <Button
            onClick={handleAboutClick}
            className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-xl p-4 backdrop-blur-sm"
          >
            <Info className="w-5 h-5 mr-3" />
            About Us
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuDialog;
