
import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, Phone, DollarSign, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Booking {
  id: string;
  client_name: string;
  client_phone: string;
  service_name: string;
  service_price: number;
  appointment_date: string;
  appointment_time: string;
  status: string;
}

const BarberCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [dayBookings, setDayBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  useEffect(() => {
    if (selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const filteredBookings = bookings.filter(
        booking => booking.appointment_date === dateStr
      );
      setDayBookings(filteredBookings);
    }
  }, [selectedDate, bookings]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('barber_id', user?.id)
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        )
      );

      toast({
        title: "Success",
        description: `Booking ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        title: "Error",
        description: "Failed to update booking",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const hasBookingsOnDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return bookings.some(booking => booking.appointment_date === dateStr);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border-gray-700"
            modifiers={{
              hasBooking: (date) => hasBookingsOnDate(date)
            }}
            modifiersStyles={{
              hasBooking: { backgroundColor: 'rgba(239, 68, 68, 0.3)' }
            }}
          />
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dayBookings.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No bookings for this day
            </div>
          ) : (
            <div className="space-y-4">
              {dayBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-white font-medium">
                        {booking.appointment_time}
                      </span>
                    </div>
                    <Badge className={`${getStatusColor(booking.status)} text-white`}>
                      {booking.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <User className="w-4 h-4" />
                      <span>{booking.client_name}</span>
                    </div>
                    
                    {booking.client_phone && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Phone className="w-4 h-4" />
                        <span>{booking.client_phone}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-4 h-4" />
                      <span>{booking.service_name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-300">
                      <DollarSign className="w-4 h-4" />
                      <span>${(booking.service_price / 100).toFixed(2)}</span>
                    </div>
                  </div>

                  {booking.status === 'confirmed' && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={() => updateBookingStatus(booking.id, 'completed')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Mark Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BarberCalendar;
