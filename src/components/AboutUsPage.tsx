
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Users, Scissors, Star } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

interface AboutUsPageProps {
  onBack: () => void;
}

const AboutUsPage = ({ onBack }: AboutUsPageProps) => {
  const { signOut } = useAuth();

  const features = [
    {
      icon: MapPin,
      title: "Find Local Barbers",
      description: "Discover talented barbers in your area with our interactive map"
    },
    {
      icon: Users,
      title: "Connect & Book",
      description: "Connect with barbers and book appointments seamlessly"
    },
    {
      icon: Scissors,
      title: "Quality Service",
      description: "Access verified professionals for the best grooming experience"
    },
    {
      icon: Star,
      title: "AI Assistant",
      description: "Get personalized style recommendations from our AI assistant"
    }
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col">
      {/* Header */}
      <div className="bg-black/90 backdrop-blur-sm border-b border-gray-800 p-3 sm:p-4 flex-shrink-0">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 sm:h-10 sm:w-10 touch-manipulation">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </Button>
            <div className="flex items-center gap-1 sm:gap-2 min-w-0">
              <img 
                src="/lovable-uploads/2c7510e8-8ef4-48d7-b2e9-8ee1afed1e54.png" 
                alt="TRIMMERR Logo" 
                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
              />
              <h1 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent truncate">
                About TRIMMERR
              </h1>
            </div>
          </div>
          <Button variant="ghost" onClick={signOut} className="text-gray-400 hover:text-white text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9 touch-manipulation">
            <span className="hidden sm:inline">Sign Out</span>
            <span className="sm:hidden">Out</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <img 
                src="/lovable-uploads/2c7510e8-8ef4-48d7-b2e9-8ee1afed1e54.png" 
                alt="TRIMMERR Logo" 
                className="w-16 h-16 sm:w-20 sm:h-20"
              />
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              TRIMMERR
            </h1>
            <p className="text-xl text-white max-w-2xl mx-auto">
              Connecting you with the best barbers in your area for the perfect cut, every time.
            </p>
          </div>

          {/* Mission Statement */}
          <Card className="bg-gray-900/90 border-red-500/30 border-2">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-gray-300 leading-relaxed">
                At TRIMMERR, we believe everyone deserves access to quality grooming services. 
                Our platform bridges the gap between skilled barbers and clients, making it easier 
                than ever to find, connect with, and book appointments with talented professionals 
                in your area.
              </p>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-900/90 border-white/20 hover:border-red-500/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-600/20 p-3 rounded-lg border border-red-500/30">
                      <feature.icon className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Info */}
          <Card className="bg-gray-900/90 border-red-500/30 border-2">
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Get In Touch</h2>
              <p className="text-gray-300 mb-4">
                Have questions or feedback? We'd love to hear from you.
              </p>
              <div className="space-y-2 text-gray-400">
                <p>Email: support@trimmerr.com</p>
                <p>Follow us on social media for updates and tips</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
