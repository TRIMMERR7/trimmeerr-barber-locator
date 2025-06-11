
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Barber } from '@/types/booking';

const services = [
  {
    id: '1',
    name: 'Classic Cut',
    description: 'Traditional haircut with scissors and clipper',
    price: 35,
    duration: '45 min',
    popular: true
  },
  {
    id: '2',
    name: 'Fade & Style',
    description: 'Modern fade with styling',
    price: 45,
    duration: '60 min'
  },
  {
    id: '3',
    name: 'Beard Trim',
    description: 'Professional beard shaping and trim',
    price: 25,
    duration: '30 min'
  },
  {
    id: '4',
    name: 'Full Service',
    description: 'Cut, wash, style, and beard trim',
    price: 65,
    duration: '90 min'
  }
];

const availableTimes = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM'];

export const useSimpleBooking = (barber: Barber) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}:00`;
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please sign in to book an appointment');
      return;
    }

    if (!selectedService || !selectedTime) {
      toast.error('Please select a service and time');
      return;
    }

    setIsProcessing(true);

    try {
      const appointmentDate = new Date().toISOString().split('T')[0];
      const appointmentTime = convertTo24Hour(selectedTime);

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          barberId: barber.id,
          clientName: user.user_metadata?.full_name || 'Client',
          clientPhone: userPhone,
          serviceName: selectedService.name,
          servicePrice: selectedService.price * 100,
          appointmentDate,
          appointmentTime
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        toast.success('Redirecting to secure checkout...');
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSelectedService(null);
      setSelectedTime('');
      setUserPhone('');
    }
  };

  return {
    isOpen,
    selectedService,
    selectedTime,
    userPhone,
    isProcessing,
    services,
    availableTimes,
    user,
    setSelectedService,
    setSelectedTime,
    setUserPhone,
    handleBooking,
    handleDialogChange
  };
};
