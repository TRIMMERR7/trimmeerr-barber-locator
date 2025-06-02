
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
    <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
      <CardContent className="p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Services & Pricing</h3>
        <div className="space-y-3">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div key={service.name} className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                service.popular ? 'bg-red-50 border border-red-200' : 'bg-gray-50 hover:bg-gray-100'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    service.popular ? 'bg-red-600' : 'bg-gray-400'
                  }`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{service.name}</span>
                      {service.popular && (
                        <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full">Popular</span>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">{service.duration}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-900">{service.price}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        <button className="w-full mt-4 py-2 text-red-600 font-medium text-sm hover:bg-red-50 rounded-lg transition-colors">
          View All Services
        </button>
      </CardContent>
    </Card>
  );
};

export default ServicesList;
