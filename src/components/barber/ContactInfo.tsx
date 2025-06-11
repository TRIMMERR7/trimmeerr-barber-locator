
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MapPin, Phone, Clock, ExternalLink, ChevronDown } from "lucide-react";
import { useBarberProfile } from '@/hooks/useBarberProfile';
import { supabase } from '@/integrations/supabase/client';

interface ContactInfoProps {
  barberId?: string;
}

const ContactInfo = ({ barberId }: ContactInfoProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { profile } = useBarberProfile();
  const [barberData, setBarberData] = useState<any>(null);

  // If barberId is provided (viewing another barber), fetch their data
  useEffect(() => {
    const fetchBarberData = async () => {
      if (barberId && barberId !== profile?.user_id) {
        console.log('ContactInfo: Fetching data for barber:', barberId);
        try {
          const { data, error } = await supabase
            .from('barber_profiles')
            .select('*')
            .eq('id', barberId)
            .single();

          if (error) throw error;
          console.log('ContactInfo: Fetched barber data:', data);
          setBarberData(data);
        } catch (err) {
          console.error('ContactInfo: Error fetching barber data:', err);
        }
      } else {
        // Use current user's profile
        setBarberData(profile);
      }
    };

    fetchBarberData();
  }, [barberId, profile]);

  // Set up real-time subscription for the specific barber
  useEffect(() => {
    if (!barberId) return;

    console.log('ContactInfo: Setting up real-time subscription for barber:', barberId);
    
    const channel = supabase
      .channel('contact-info-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'barber_profiles',
          filter: `id=eq.${barberId}`
        },
        (payload) => {
          console.log('ContactInfo: Real-time update received:', payload);
          setBarberData(payload.new);
        }
      )
      .subscribe((status) => {
        console.log('ContactInfo: Subscription status:', status);
      });

    return () => {
      console.log('ContactInfo: Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [barberId]);

  const currentData = barberData || profile;

  if (!currentData) {
    return (
      <Card className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
        <CardContent className="p-4 md:p-6">
          <h3 className="text-lg font-semibold text-white">Contact & Hours</h3>
          <p className="text-gray-400 mt-2">Profile information not available</p>
        </CardContent>
      </Card>
    );
  }

  const formatWorkingHours = (workingHours: any) => {
    if (!workingHours) return [];
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayLabels = {
      monday: 'Mon',
      tuesday: 'Tue', 
      wednesday: 'Wed',
      thursday: 'Thu',
      friday: 'Fri',
      saturday: 'Sat',
      sunday: 'Sun'
    };

    return days.map(day => {
      const dayData = workingHours[day];
      if (!dayData) return { day: dayLabels[day], hours: 'Closed' };
      
      if (dayData.closed) return { day: dayLabels[day], hours: 'Closed' };
      
      return {
        day: dayLabels[day],
        hours: `${dayData.open || '9:00'} - ${dayData.close || '18:00'}`
      };
    });
  };

  const hoursData = formatWorkingHours(currentData.working_hours);

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
              {currentData.location && (
                <div className="flex items-start gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <MapPin className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-white">Location</p>
                    <p className="text-sm text-white/80">{currentData.location}</p>
                  </div>
                </div>
              )}

              {currentData.phone && (
                <div className="flex items-start gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <Phone className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-white">Phone</p>
                    <p className="text-sm text-white/80">{currentData.phone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <Clock className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white mb-2">Hours</p>
                  <div className="space-y-1 text-sm text-white/80">
                    {hoursData.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.day}</span>
                        <span>{item.hours}</span>
                      </div>
                    ))}
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
