
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MapPin, Phone, Clock, ExternalLink, ChevronDown } from "lucide-react";

const ContactInfo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
      <CardContent className="p-4 md:p-6">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
            <h3 className="text-lg font-semibold text-white">Contact & Hours</h3>
            <ChevronDown className={`w-5 h-5 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          
          <CollapsibleContent className="overflow-hidden">
            <div className="space-y-4 mt-4">
              <div className="flex items-start gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <MapPin className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Location</p>
                  <p className="text-sm text-white/80">123 Main Street, Downtown</p>
                  <p className="text-sm text-white/80">New York, NY 10001</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <Phone className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Phone</p>
                  <p className="text-sm text-white/80">(555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <Clock className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white mb-2">Hours</p>
                  <div className="space-y-1 text-sm text-white/80">
                    <div className="flex justify-between">
                      <span>Mon - Fri</span>
                      <span>9:00 AM - 8:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>10:00 AM - 5:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-3 text-red-400 font-medium text-sm hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/30 backdrop-blur-sm">
                <ExternalLink className="w-4 h-4" />
                Get Directions
              </button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default ContactInfo;
