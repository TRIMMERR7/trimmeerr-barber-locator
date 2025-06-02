
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Check, Scissors, Zap, Flame } from "lucide-react";

const ServicesList = () => {
  const services = [
    {
      name: 'Classic Haircut',
      price: '$30',
      duration: '30 min',
      icon: Scissors,
      popular: false
    },
    {
      name: 'Fade Cut',
      price: '$35',
      duration: '35 min',
      icon: Zap,
      popular: true
    },
    {
      name: 'Beard Trim',
      price: '$20',
      duration: '20 min',
      icon: Scissors,
      popular: false
    },
    {
      name: 'Hot Towel Shave',
      price: '$40',
      duration: '45 min',
      icon: Flame,
      popular: false
    }
  ];
  
  return (
    <Card className="glass-card border-white/20 shadow-2xl">
      <CardContent className="p-4 md:p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Services & Pricing</h3>
        <div className="space-y-3">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div key={service.name} className={`flex items-center justify-between p-3 rounded-xl transition-all backdrop-blur-sm ${
                service.popular ? 'bg-red-600/20 border border-red-400/30' : 'bg-white/10 hover:bg-white/20 border border-white/20'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    service.popular ? 'bg-red-600' : 'bg-white/20 backdrop-blur-sm'
                  }`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{service.name}</span>
                      {service.popular && (
                        <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full">Popular</span>
                      )}
                    </div>
                    <span className="text-sm text-gray-300">{service.duration}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white">{service.price}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        <button className="w-full mt-4 py-2 text-red-400 font-medium text-sm hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/30 backdrop-blur-sm">
          View All Services
        </button>
      </CardContent>
    </Card>
  );
};

export default ServicesList;
