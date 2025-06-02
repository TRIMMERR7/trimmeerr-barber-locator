
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MapPin, Clock } from "lucide-react";

const ContactInfo = () => {
  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">(555) 123-4567</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">Downtown Barbershop</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">9 AM - 7 PM</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfo;
