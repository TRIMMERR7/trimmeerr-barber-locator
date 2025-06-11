
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TimeSlotAvailability {
  time: string;
  available: boolean;
}

export const useRealTimeAvailability = (barberId: string, selectedDate: string) => {
  const [availability, setAvailability] = useState<TimeSlotAvailability[]>([]);
  const [loading, setLoading] = useState(true);

  const timeSlots = [
    '9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM'
  ];

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

  const fetchAvailability = async () => {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('appointment_time')
        .eq('barber_id', barberId)
        .eq('appointment_date', selectedDate)
        .in('status', ['confirmed', 'pending']);

      if (error) throw error;

      const bookedTimes = new Set(
        bookings?.map(booking => {
          const timeStr = booking.appointment_time;
          // Convert database time format to display format
          const [hours, minutes] = timeStr.split(':');
          const hour24 = parseInt(hours);
          const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
          const ampm = hour24 >= 12 ? 'PM' : 'AM';
          return `${hour12}:${minutes} ${ampm}`;
        }) || []
      );

      const availabilityData = timeSlots.map(time => ({
        time,
        available: !bookedTimes.has(time)
      }));

      setAvailability(availabilityData);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (barberId && selectedDate) {
      fetchAvailability();

      // Set up real-time subscription for booking changes
      const channel = supabase
        .channel('booking-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookings',
            filter: `barber_id=eq.${barberId}`
          },
          () => {
            fetchAvailability();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [barberId, selectedDate]);

  return { availability, loading, refetch: fetchAvailability };
};
