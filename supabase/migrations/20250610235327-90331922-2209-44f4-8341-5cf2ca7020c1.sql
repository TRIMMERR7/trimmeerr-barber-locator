
-- Add latitude and longitude columns to barber_profiles table
ALTER TABLE public.barber_profiles 
ADD COLUMN latitude DECIMAL(10, 8),
ADD COLUMN longitude DECIMAL(11, 8);

-- Add a comment to explain the coordinate precision
COMMENT ON COLUMN public.barber_profiles.latitude IS 'Latitude coordinate with 8 decimal places for ~1.1 meter accuracy';
COMMENT ON COLUMN public.barber_profiles.longitude IS 'Longitude coordinate with 8 decimal places for ~1.1 meter accuracy';
