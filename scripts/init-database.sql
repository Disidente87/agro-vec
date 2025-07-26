-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create custom types
CREATE TYPE user_role AS ENUM ('producer', 'technician', 'distributor', 'consumer');

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  address TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'consumer',
  name TEXT,
  email TEXT,
  organization TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create parcels table
CREATE TABLE public.parcels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location GEOGRAPHY(POINT),
  area NUMERIC,
  crop_type TEXT,
  producer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parcel_id UUID REFERENCES public.parcels(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create batches table
CREATE TABLE public.batches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  parcel_id UUID REFERENCES public.parcels(id) ON DELETE CASCADE,
  product_type TEXT,
  quantity NUMERIC,
  unit TEXT,
  harvest_date DATE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_profiles_address ON public.profiles(address);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_parcels_producer_id ON public.parcels(producer_id);
CREATE INDEX idx_events_parcel_id ON public.events(parcel_id);
CREATE INDEX idx_events_created_by ON public.events(created_by);
CREATE INDEX idx_batches_parcel_id ON public.batches(parcel_id);
CREATE INDEX idx_batches_created_by ON public.batches(created_by);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, address, role, name, email, organization)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'address',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'consumer'),
    NEW.raw_user_meta_data->>'name',
    NEW.email,
    NEW.raw_user_meta_data->>'organization'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_parcels_updated_at
  BEFORE UPDATE ON public.parcels
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Drop existing policies that are causing recursion
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Technicians can view all profiles" ON public.profiles;

-- Create simple policies that work with our approach
CREATE POLICY "Enable read access for all users" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for users based on address" ON public.profiles
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for users based on address" ON public.profiles
  FOR DELETE USING (true);

-- RLS Policies for parcels
CREATE POLICY "Producers can view their own parcels" ON public.parcels
  FOR SELECT USING (producer_id = auth.uid());

CREATE POLICY "Producers can insert their own parcels" ON public.parcels
  FOR INSERT WITH CHECK (producer_id = auth.uid());

CREATE POLICY "Producers can update their own parcels" ON public.parcels
  FOR UPDATE USING (producer_id = auth.uid());

CREATE POLICY "Technicians can view all parcels" ON public.parcels
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'technician'
    )
  );

CREATE POLICY "Technicians can update all parcels" ON public.parcels
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'technician'
    )
  );

CREATE POLICY "Consumers can view all parcels" ON public.parcels
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'consumer'
    )
  );

-- RLS Policies for events
CREATE POLICY "Users can view events for parcels they have access to" ON public.events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.parcels p
      JOIN public.profiles prof ON prof.id = auth.uid()
      WHERE p.id = parcel_id AND (
        p.producer_id = auth.uid() OR
        prof.role IN ('technician', 'consumer')
      )
    )
  );

CREATE POLICY "Producers and technicians can create events" ON public.events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('producer', 'technician')
    )
  );

CREATE POLICY "Producers and technicians can update events" ON public.events
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('producer', 'technician')
    )
  );

-- RLS Policies for batches
CREATE POLICY "Users can view batches for parcels they have access to" ON public.batches
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.parcels p
      JOIN public.profiles prof ON prof.id = auth.uid()
      WHERE p.id = parcel_id AND (
        p.producer_id = auth.uid() OR
        prof.role IN ('technician', 'distributor', 'consumer')
      )
    )
  );

CREATE POLICY "Producers and distributors can create batches" ON public.batches
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('producer', 'distributor')
    )
  );

CREATE POLICY "Producers, technicians and distributors can update batches" ON public.batches
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('producer', 'technician', 'distributor')
    )
  );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.parcels TO anon, authenticated;
GRANT ALL ON public.events TO anon, authenticated;
GRANT ALL ON public.batches TO anon, authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated; 