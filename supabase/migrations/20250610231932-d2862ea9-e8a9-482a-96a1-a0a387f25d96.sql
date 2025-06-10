
-- Create an enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'barber', 'client');

-- Create user_roles table to manage roles
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles without recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = auth.uid()
  LIMIT 1
$$;

-- Create barber_profiles table for barber-specific data
CREATE TABLE public.barber_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    business_name TEXT,
    specialty TEXT,
    experience TEXT,
    bio TEXT,
    hourly_rate INTEGER,
    phone TEXT,
    location TEXT,
    services TEXT[],
    working_hours JSONB,
    profile_image_url TEXT,
    portfolio_images TEXT[],
    rating DECIMAL(3,2) DEFAULT 0,
    completed_cuts INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on barber_profiles
ALTER TABLE public.barber_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for barber_profiles
CREATE POLICY "Barbers can manage their own profile"
ON public.barber_profiles
FOR ALL
USING (user_id = auth.uid());

CREATE POLICY "Anyone can view active barber profiles"
ON public.barber_profiles
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage all barber profiles"
ON public.barber_profiles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Function to automatically assign barber role when barber profile is created
CREATE OR REPLACE FUNCTION public.handle_new_barber_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert barber role for the user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.user_id, 'barber')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Trigger to assign barber role when profile is created
CREATE TRIGGER on_barber_profile_created
  AFTER INSERT ON public.barber_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_barber_profile();

-- Update profiles table to work with new role system
UPDATE public.profiles SET user_type = 'client' WHERE user_type IS NULL;

-- Insert client role for existing users who don't have barber profiles
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'client'::app_role
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_roles);
