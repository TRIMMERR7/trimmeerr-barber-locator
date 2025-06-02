
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Scissors, Zap, Flame, Star } from "lucide-react";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  icon: React.ComponentType<{ className?: string }>;
  popular: boolean;
  description: string;
}

interface ServiceSelectionProps {
  onServiceSelect: (service: Service) => void;
  selectedService: Service | null;
}

const ServiceSelection = ({ onServiceSelect, selectedService }: ServiceSelectionProps) => {
  const services: Service[] = [
    {
      id: 'classic-cut',
      name: 'Classic Haircut',
      price: 30,
      duration: '30 min',
      icon: Scissors,
      popular: false,
      description: 'Traditional haircut with scissor and clipper work'
    },
    {
      id: 'fade-cut',
      name: 'Fade Cut',
      price: 35,
      duration: '35 min',
      icon: Zap,
      popular: true,
      description: 'Modern fade with precise blending and styling'
    },
    {
      id: 'beard-trim',
      name: 'Beard Trim',
      price: 20,
      duration: '20 min',
      icon: Scissors,
      popular: false,
      description: 'Professional beard shaping and trimming'
    },
    {
      id: 'hot-towel-shave',
      name: 'Hot Towel Shave',
      price: 40,
      duration: '45 min',
      icon: Flame,
      popular: false,
      description: 'Traditional hot towel shave with premium products'
    },
    {
      id: 'premium-package',
      name: 'Premium Package',
      price: 60,
      duration: '60 min',
      icon: Star,
      popular: true,
      description: 'Haircut + beard trim + hot towel treatment'
    }
  ];
  
  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
      <CardContent className="p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Service</h3>
        <div className="space-y-3">
          {services.map((service) => {
            const IconComponent = service.icon;
            const isSelected = selectedService?.id === service.id;
            return (
              <div 
                key={service.id} 
                className={`cursor-pointer transition-all rounded-xl border-2 ${
                  isSelected 
                    ? 'border-red-600 bg-red-50' 
                    : service.popular 
                    ? 'border-red-200 bg-red-50 hover:border-red-400' 
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
                onClick={() => onServiceSelect(service)}
              >
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-red-600' : service.popular ? 'bg-red-600' : 'bg-gray-400'
                    }`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{service.name}</span>
                        {service.popular && (
                          <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full">Popular</span>
                        )}
                        {isSelected && (
                          <Check className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <span className="text-sm text-gray-600">{service.duration}</span>
                      <p className="text-xs text-gray-500 mt-1">{service.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">${service.price}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceSelection;
