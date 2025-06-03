
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Check, Scissors, Zap, Flame, ChevronDown } from "lucide-react";

const ServicesList = () => {
  const [isOpen, setIsOpen] = useState(false);

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
    <Card className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
      <CardContent className="p-4 md:p-6">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
            <h3 className="text-lg font-semibold text-white">Services & Pricing</h3>
            <ChevronDown className={`w-5 h-5 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          
          <CollapsibleContent className="overflow-hidden">
            <div className="space-y-3 mt-4">
              {services.map((service) => {
                const IconComponent = service.icon;
                return (
                  <div key={service.name} className={`flex items-center justify-between p-3 rounded-xl transition-all backdrop-blur-sm ${
                    service.popular ? 'bg-red-600/20 border border-red-400/30' : 'bg-white/10 hover:bg-white/20 border border-white/20'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        service.popular ? 'bg-red-600/60' : 'bg-white/20 backdrop-blur-sm'
                      }`}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{service.name}</span>
                          {service.popular && (
                            <span className="text-xs bg-red-600/80 text-white px-2 py-1 rounded-full">Popular</span>
                          )}
                        </div>
                        <span className="text-sm text-white/70">{service.duration}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-white">{service.price}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default ServicesList;
