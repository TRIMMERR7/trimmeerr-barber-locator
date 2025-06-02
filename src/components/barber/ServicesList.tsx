
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const ServicesList = () => {
  const services = ['Haircut', 'Beard Trim', 'Hot Towel', 'Styling'];
  
  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Services</h3>
        <div className="space-y-2">
          {services.map((service) => (
            <div key={service} className="flex items-center justify-between py-2">
              <span className="text-gray-700">{service}</span>
              <span className="text-red-600 font-semibold">✓</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServicesList;
