
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Bot, X } from "lucide-react";
import AIChat from './AIChat';

const FloatingAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating AI Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl border-2 border-white/20 backdrop-blur-sm z-50"
        >
          <Bot className="w-6 h-6 text-white" />
        </Button>
      )}

      {/* Floating AI Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 z-50 animate-scale-in">
          <div className="relative h-full">
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-600/80 hover:bg-red-700/80 text-white backdrop-blur-sm border border-red-500/30 z-10"
            >
              <X className="w-4 h-4" />
            </Button>
            <AIChat className="h-full" />
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingAIAssistant;
