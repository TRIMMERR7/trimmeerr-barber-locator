
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Phone, Video, MoreVertical, ArrowLeft, Clock, Check, CheckCheck } from "lucide-react";
import { sanitizeInput } from '@/utils/securityHelpers';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'appointment' | 'system';
}

interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  messages: Message[];
}

interface MessagingInterfaceProps {
  onBack: () => void;
  selectedCustomerId?: string;
}

const MessagingInterface = ({ onBack, selectedCustomerId }: MessagingInterfaceProps) => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(selectedCustomerId || null);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock conversations data
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      customerId: '1',
      customerName: 'Alex Johnson',
      customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      lastMessage: 'Are you available this Saturday?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      unreadCount: 2,
      isOnline: true,
      messages: [
        {
          id: '1',
          senderId: '1',
          content: 'Hi! I saw your profile and I\'m interested in booking a haircut.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          status: 'read',
          type: 'text'
        },
        {
          id: '2',
          senderId: 'barber',
          content: 'Hello Alex! Thanks for reaching out. I\'d be happy to help you with a haircut. What style are you looking for?',
          timestamp: new Date(Date.now() - 1000 * 60 * 50),
          status: 'read',
          type: 'text'
        },
        {
          id: '3',
          senderId: '1',
          content: 'I\'m thinking of a modern fade. Something professional for work.',
          timestamp: new Date(Date.now() - 1000 * 60 * 40),
          status: 'read',
          type: 'text'
        },
        {
          id: '4',
          senderId: 'barber',
          content: 'Perfect! I specialize in modern fades. When would you like to schedule your appointment?',
          timestamp: new Date(Date.now() - 1000 * 60 * 35),
          status: 'read',
          type: 'text'
        },
        {
          id: '5',
          senderId: '1',
          content: 'Are you available this Saturday?',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          status: 'delivered',
          type: 'text'
        }
      ]
    },
    {
      id: '2',
      customerId: '2',
      customerName: 'Marcus Davis',
      customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      lastMessage: 'Thanks for the great cut!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      unreadCount: 0,
      isOnline: false,
      messages: [
        {
          id: '1',
          senderId: '2',
          content: 'Just finished my appointment. Thanks for the great cut!',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          status: 'read',
          type: 'text'
        }
      ]
    }
  ]);

  const currentConversation = conversations.find(c => c.id === selectedConversation);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const sanitizedMessage = sanitizeInput(messageInput.trim());
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'barber',
      content: sanitizedMessage,
      timestamp: new Date(),
      status: 'sent',
      type: 'text'
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConversation) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: sanitizedMessage,
          lastMessageTime: new Date()
        };
      }
      return conv;
    }));

    setMessageInput('');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getMessageStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-400" />;
    }
  };

  if (!selectedConversation) {
    return (
      <div className="h-screen bg-black flex flex-col">
        <div className="bg-black border-b border-gray-800 p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold text-white">Messages</h1>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Conversations List */}
          <div className="w-full lg:w-80 border-r border-gray-800 bg-gray-900">
            <div className="p-4 border-b border-gray-800">
              <h2 className="font-semibold text-white">Conversations</h2>
            </div>
            <div className="overflow-y-auto">
              {conversations.map(conversation => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className="p-4 border-b border-gray-800 hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={conversation.customerAvatar} />
                        <AvatarFallback className="bg-red-600 text-white">
                          {conversation.customerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-white truncate">{conversation.customerName}</h3>
                        <span className="text-xs text-gray-400">{formatTime(conversation.lastMessageTime)}</span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <Badge className="bg-red-600 text-white text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Empty State */}
          <div className="flex-1 flex items-center justify-center bg-black">
            <div className="text-center">
              <div className="text-gray-400 text-lg mb-2">Select a conversation</div>
              <div className="text-gray-500">Choose a customer to start messaging</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-black border-b border-gray-800 p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedConversation(null)}
              className="text-gray-400 hover:text-white lg:hidden"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" onClick={onBack} className="text-gray-400 hover:text-white hidden lg:flex">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={currentConversation?.customerAvatar} />
                <AvatarFallback className="bg-red-600 text-white">
                  {currentConversation?.customerName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-white">{currentConversation?.customerName}</h2>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <div className={`w-2 h-2 rounded-full ${currentConversation?.isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  <span>{currentConversation?.isOnline ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentConversation?.messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.senderId === 'barber' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.senderId === 'barber'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-white'
            }`}>
              <p className="text-sm">{message.content}</p>
              <div className={`flex items-center gap-1 mt-1 ${
                message.senderId === 'barber' ? 'justify-end' : 'justify-start'
              }`}>
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {message.senderId === 'barber' && getMessageStatusIcon(message.status)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-gray-900 border-t border-gray-800 p-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            className="bg-gray-800 border-gray-600 text-white"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button 
            onClick={sendMessage}
            disabled={!messageInput.trim()}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessagingInterface;
