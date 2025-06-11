
-- Enable real-time updates for the bookings table
ALTER TABLE public.bookings REPLICA IDENTITY FULL;

-- Add the bookings table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;

-- Create a function to check time slot availability
CREATE OR REPLACE FUNCTION check_time_slot_availability(
  barber_id_param UUID,
  appointment_date_param DATE,
  appointment_time_param TIME
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.bookings
    WHERE barber_id = barber_id_param
    AND appointment_date = appointment_date_param
    AND appointment_time = appointment_time_param
    AND status IN ('confirmed', 'pending')
  );
END;
$$ LANGUAGE plpgsql;

-- Create a trigger function to prevent double bookings
CREATE OR REPLACE FUNCTION prevent_double_booking()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the time slot is already booked
  IF NOT check_time_slot_availability(NEW.barber_id, NEW.appointment_date, NEW.appointment_time) THEN
    RAISE EXCEPTION 'Time slot already booked for this barber';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER prevent_double_booking_trigger
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION prevent_double_booking();

-- Add a notifications table for real-time barber notifications
CREATE TABLE IF NOT EXISTS public.barber_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id UUID NOT NULL REFERENCES public.barber_profiles(id),
  booking_id UUID NOT NULL REFERENCES public.bookings(id),
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'booking_request',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on notifications
ALTER TABLE public.barber_notifications ENABLE ROW LEVEL SECURITY;

-- Policy for barbers to see their own notifications
CREATE POLICY "Barbers can view their own notifications"
  ON public.barber_notifications
  FOR SELECT
  USING (barber_id IN (
    SELECT id FROM public.barber_profiles WHERE user_id = auth.uid()
  ));

-- Enable real-time for notifications
ALTER TABLE public.barber_notifications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.barber_notifications;

-- Function to create notification when booking is made
CREATE OR REPLACE FUNCTION create_booking_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.barber_notifications (barber_id, booking_id, message, type)
  VALUES (
    NEW.barber_id,
    NEW.id,
    'New booking request for ' || NEW.service_name || ' on ' || NEW.appointment_date || ' at ' || NEW.appointment_time,
    'booking_request'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for booking notifications
CREATE TRIGGER create_booking_notification_trigger
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION create_booking_notification();
