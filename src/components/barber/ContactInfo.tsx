
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MapPin, Clock, Globe } from "lucide-react";

const ContactInfo = () => {
  const contactItems = [
    {
      icon: Phone,
      label: "Phone",
      value: "(555) 123-4567",
      action: "tel:+15551234567"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Downtown Barbershop",
      subvalue: "123 Main St, Houston, TX"
    },
    {
      icon: Clock,
      label: "Hours",
      value: "9 AM - 7 PM",
      subvalue: "Mon - Sat"
    },
    {
      icon: Globe,
      label: "Website",
      value: "Visit our site",
      action: "https://example.com"
    }
  ];

  return (
    <Card className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
      <CardContent className="p-4 md:p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Contact & Hours</h3>
        <div className="space-y-4">
          {contactItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 mt-1 border border-white/20">
                  <IconComponent className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/60 uppercase tracking-wide mb-1">{item.label}</p>
                  {item.action ? (
                    <a 
                      href={item.action}
                      className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-white">{item.value}</p>
                  )}
                  {item.subvalue && (
                    <p className="text-xs text-white/50 mt-1">{item.subvalue}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/20">
          <button className="w-full bg-red-600/20 backdrop-blur-sm hover:bg-red-700/30 text-white py-2 rounded-lg font-medium text-sm transition-colors border border-red-500/30">
            Call Now
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfo;
