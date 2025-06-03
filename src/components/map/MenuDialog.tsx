
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bot, Info, X } from 'lucide-react';

interface MenuDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAIAssistantClick: () => void;
  onAboutUsClick: () => void;
}

const MenuDialog = ({ isOpen, onClose, onAIAssistantClick, onAboutUsClick }: MenuDialogProps) => {
  const handleAIClick = () => {
    onAIAssistantClick();
    onClose();
  };

  const handleAboutClick = () => {
    onAboutUsClick();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/95 backdrop-blur-xl border-2 border-red-500/50 text-white max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
            Menu
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-3 mt-6">
          <Button
            onClick={handleAIClick}
            className="w-full justify-start bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-xl p-4"
          >
            <Bot className="w-5 h-5 mr-3" />
            AI Styling Assistant
          </Button>
          
          <Button
            onClick={handleAboutClick}
            className="w-full justify-start bg-gray-800/50 hover:bg-gray-700/50 text-white border border-white/30 rounded-xl p-4"
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
