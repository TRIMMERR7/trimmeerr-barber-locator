
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, X, MessageCircle, ArrowRight } from "lucide-react";
import { useGeminiAI } from '@/hooks/useGeminiAI';
import { motion, AnimatePresence } from 'framer-motion';

interface Barber {
  id: string;
  name: string;
  rating: number;
  specialty: string;
  image: string;
  price: string;
  distance: string;
  experience: string;
  lat: number;
  lng: number;
}

interface AIBookingAssistantProps {
  currentStep?: 'find' | 'select' | 'book';
  selectedBarber?: Barber | null;
  onBarberSelect?: (barber: Barber) => void;
  onBookingStart?: () => void;
  nearbyBarbers?: Barber[];
}

const AIBookingAssistant = ({ 
  currentStep = 'find', 
  selectedBarber, 
  onBarberSelect, 
  onBookingStart,
  nearbyBarbers = []
}: AIBookingAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{id: string, content: string, isUser: boolean}>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const { sendMessage, isLoading } = useGeminiAI();

  const getContextualSuggestions = () => {
    switch (currentStep) {
      case 'find':
        return [
          "Help me find the best barber near me",
          "What should I look for in a barber?",
          "Show me highly rated barbers",
          "I need a fade specialist"
        ];
      case 'select':
        return selectedBarber ? [
          `Tell me more about ${selectedBarber.name}`,
          "What services does this barber offer?",
          "Is this barber good for my hair type?",
          "Help me book an appointment"
        ] : [
          "Compare these barbers for me",
          "Which barber should I choose?",
          "What's the difference between these barbers?"
        ];
      case 'book':
        return [
          "Help me choose the right service",
          "What time slots are usually best?",
          "What should I expect during booking?",
          "Any tips for my first visit?"
        ];
      default:
        return [
          "Help me find a barber",
          "Book an appointment",
          "Style recommendations"
        ];
    }
  };

  const getWelcomeMessage = () => {
    switch (currentStep) {
      case 'find':
        return "Hi! I'm here to help you find the perfect barber. I can recommend barbers based on your preferences, explain their specialties, and guide you through the booking process.";
      case 'select':
        return selectedBarber 
          ? `Great choice looking at ${selectedBarber.name}! I can tell you more about their services, help you understand what makes them special, or guide you through booking.`
          : "I can help you compare these barbers and choose the right one for your needs. What's most important to you - price, specialty, or location?";
      case 'book':
        return "Perfect! Let me guide you through the booking process. I can help you choose the right service, pick the best time, and make sure you're prepared for your appointment.";
      default:
        return "Hi! I'm your AI barber assistant. How can I help you today?";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      // Create context based on current state
      let context = `You are a helpful barber booking assistant. Current booking step: ${currentStep}.`;
      
      if (selectedBarber) {
        context += ` Selected barber: ${selectedBarber.name} (${selectedBarber.specialty}, ${selectedBarber.rating} stars, ${selectedBarber.price}, ${selectedBarber.distance} away).`;
      }
      
      if (nearbyBarbers.length > 0) {
        context += ` Available barbers: ${nearbyBarbers.slice(0, 3).map(b => `${b.name} (${b.specialty})`).join(', ')}.`;
      }

      context += ` Help guide the user through the booking process. Be concise and actionable. If they ask about booking or selecting a barber, encourage them to use the app's interface.`;

      const response = await sendMessage(inputMessage, context);
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble right now. Please try again in a moment.",
        isUser: false
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    if (messages.length === 0) {
      // If no messages yet, add welcome message first
      setMessages([{
        id: '1',
        content: getWelcomeMessage(),
        isUser: false
      }]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating AI Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
          size="icon"
        >
          <Bot className="h-6 w-6 text-white" />
        </Button>
      </motion.div>

      {/* AI Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            
            <motion.div
              className="relative w-full max-w-md h-[70vh] sm:h-[60vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                    <p className="text-xs text-gray-500">Here to help you book</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{getWelcomeMessage()}</p>
                  </div>
                )}

                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl ${
                      message.isUser 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Suggestions */}
              {messages.length === 0 && (
                <div className="p-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Try asking:</p>
                  <div className="space-y-2">
                    {getContextualSuggestions().slice(0, 2).map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left h-auto p-2 text-xs"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <ArrowRight className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{suggestion}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIBookingAssistant;
