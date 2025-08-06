
-- Add favorites table for users to save pets
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, pet_id)
);

-- Enable RLS on favorites table
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for favorites
CREATE POLICY "Users can view their own favorites" 
  ON public.favorites 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites" 
  ON public.favorites 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorites" 
  ON public.favorites 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add more sample pets with complete information
INSERT INTO public.pets (name, type, breed, age, gender, size, color, description, health_status, vaccination_status, energy_level, location, adoption_fee, images, status) VALUES
('Luna', 'Dog', 'Golden Retriever', '3 years', 'Female', 'Large', 'Golden', 'Friendly and energetic dog, loves to play fetch and great with children.', 'Healthy', 'Up to date', 'High', 'San Francisco, CA', 200, ARRAY['/lovable-uploads/31154413-c1e7-4cb4-81de-7018c48a7b72.png'], 'available'),
('Whiskers', 'Cat', 'Persian', '2 years', 'Male', 'Medium', 'White', 'Calm and gentle cat, perfect for apartment living. Loves to cuddle.', 'Healthy', 'Up to date', 'Low', 'Oakland, CA', 150, ARRAY['/lovable-uploads/42a710fd-3b12-47a8-ae84-16cdc38bba0f.png'], 'available'),
('Charlie', 'Dog', 'Labrador Mix', '1 year', 'Male', 'Large', 'Brown', 'Playful puppy looking for an active family. Great with kids and other pets.', 'Healthy', 'Up to date', 'High', 'Berkeley, CA', 0, ARRAY['/lovable-uploads/809569e1-bc95-4f34-a5d1-4ad64c00cdf3.png'], 'available'),
('Mittens', 'Cat', 'Domestic Shorthair', '4 years', 'Female', 'Small', 'Black and White', 'Sweet indoor cat who loves sunny windows and quiet afternoons.', 'Healthy', 'Up to date', 'Low', 'San Jose, CA', 75, ARRAY['/lovable-uploads/8eb06a14-cd33-44d7-871d-b5780d546175.png'], 'available'),
('Max', 'Dog', 'German Shepherd', '5 years', 'Male', 'Large', 'Black and Tan', 'Well-trained and loyal companion. Good with experienced dog owners.', 'Healthy', 'Up to date', 'Medium', 'Palo Alto, CA', 300, ARRAY['/lovable-uploads/e0629f7a-170b-453b-8dd8-d2f5cef5c027.png'], 'available'),
('Bella', 'Cat', 'Siamese', '3 years', 'Female', 'Medium', 'Cream and Brown', 'Talkative and affectionate cat who loves attention and interactive play.', 'Healthy', 'Up to date', 'Medium', 'Mountain View, CA', 125, ARRAY['/lovable-uploads/31154413-c1e7-4cb4-81de-7018c48a7b72.png'], 'available');
