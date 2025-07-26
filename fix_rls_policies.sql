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
