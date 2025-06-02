
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
    <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
      <CardContent className="p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact & Hours</h3>
        <div className="space-y-4">
          {contactItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <IconComponent className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{item.label}</p>
                  {item.action ? (
                    <a 
                      href={item.action}
                      className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-gray-900">{item.value}</p>
                  )}
                  {item.subvalue && (
                    <p className="text-xs text-gray-600 mt-1">{item.subvalue}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium text-sm transition-colors">
            Call Now
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfo;
