
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useRealTimeAvailability } from './useRealTimeAvailability';

interface Barber {
  id: string;
  name: string;
  rating: number;
  specialty: string;
  image: string;
  price: string;
  distance: string;
  experience: string;
  lat: number;
  lng: number;
}

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

export const useSimpleBooking = (barber: Barber) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [userPhone, setUserPhone] = useState<string>('');

  // Get availability for the selected date
  const { availability } = useRealTimeAvailability(barber.id, selectedDate);

  // Mock services for now - this should come from the barber's profile
  const services: Service[] = [
    { id: '1', name: 'Haircut', duration: 30, price: 35, description: 'Professional haircut' },
    { id: '2', name: 'Beard Trim', duration: 15, price: 20, description: 'Beard styling and trim' },
    { id: '3', name: 'Full Service', duration: 45, price: 50, description: 'Haircut + Beard Trim' }
  ];

  const availableTimes = availability.filter(slot => slot.available).map(slot => slot.time);

  const createBooking = async (
    service: Service,
    selectedDate: string,
    selectedTime: string,
    userPhone: string
  ) => {
    if (!user) {
      toast.error('Please log in to book an appointment');
      return;
    }

    setIsLoading(true);
    
    try {
      // Convert 12-hour time to 24-hour format for database
      const convertTo24Hour = (time12h: string) => {
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') {
          hours = '00';
        }
        if (modifier === 'PM') {
          hours = String(parseInt(hours, 10) + 12);
        }
        return `${hours}:${minutes}:00`;
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          barber_id: barber.id,
          client_id: user.id,
          client_name: user.user_metadata?.full_name || 'Client',
          client_phone: userPhone,
          service_name: service.name,
          service_price: service.price,
          appointment_date: selectedDate,
          appointment_time: convertTo24Hour(selectedTime),
          status: 'confirmed'
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Booking confirmed! The barber has been notified.');
      setIsOpen(false);
      return data;
    } catch (error: any) {
      console.error('Booking error:', error);
      
      if (error.message?.includes('Time slot already booked')) {
        toast.error('This time slot is no longer available. Please choose another time.');
      } else {
        toast.error('Failed to create booking. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedService || !selectedTime || !userPhone.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    await createBooking(selectedService, selectedDate, selectedTime, userPhone);
  };

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form when closing
      setSelectedService(null);
      setSelectedTime('');
      setUserPhone('');
    }
  };

  return {
    createBooking,
    isLoading,
    isProcessing: isLoading,
    isOpen,
    setIsOpen,
    selectedService,
    setSelectedService,
    selectedTime,
    setSelectedTime,
    selectedDate,
    setSelectedDate,
    userPhone,
    setUserPhone,
    user,
    services,
    availableTimes,
    handleBooking,
    handleDialogChange
  };
};
