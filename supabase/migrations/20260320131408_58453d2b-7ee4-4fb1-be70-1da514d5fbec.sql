
DROP POLICY "Users can view their own profile" ON public.profiles;

CREATE POLICY "Authenticated users can read all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);
