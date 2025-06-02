
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Send, Loader2 } from "lucide-react";
import { useGeminiAI } from '@/hooks/useGeminiAI';

interface AIChatProps {
  barberName?: string;
  className?: string;
}

const AIChat = ({ barberName, className = '' }: AIChatProps) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai', content: string }>>([]);
  const { generateResponse, isLoading } = useGeminiAI();

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);

    // Get AI response
    const context = barberName 
      ? `You are helping a user with questions about ${barberName}, a professional barber. Provide helpful information about barber services, styling, or appointments.`
      : 'You are a helpful assistant for a barber booking app. Help users with styling advice, barber services, and general questions.';
    
    const aiResponse = await generateResponse(userMessage, context);
    
    if (aiResponse) {
      setMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className={`glass-card border-white/20 shadow-2xl ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-400" />
          AI Style Assistant
          {barberName && <span className="text-sm text-gray-300">for {barberName}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Messages */}
        <div className="max-h-60 overflow-y-auto space-y-2">
          {messages.length === 0 && (
            <div className="text-gray-400 text-sm text-center py-4">
              Ask me about hairstyles, barber services, or styling tips!
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg text-sm ${
                message.type === 'user'
                  ? 'bg-blue-600/20 text-white ml-4'
                  : 'bg-white/10 text-gray-200 mr-4'
              }`}
            >
              {message.content}
            </div>
          ))}
          {isLoading && (
            <div className="bg-white/10 text-gray-200 mr-4 p-2 rounded-lg text-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Thinking...
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about styles, services, or tips..."
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-blue-600/80 hover:bg-blue-700/80 border-blue-500/30"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChat;
