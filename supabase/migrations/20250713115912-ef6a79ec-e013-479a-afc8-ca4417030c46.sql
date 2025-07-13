
-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pets table for real pet data
CREATE TABLE public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- dog, cat, bird, rabbit, etc.
  breed TEXT,
  age TEXT,
  gender TEXT,
  size TEXT, -- small, medium, large
  color TEXT,
  description TEXT,
  health_status TEXT,
  vaccination_status TEXT,
  spayed_neutered BOOLEAN DEFAULT FALSE,
  good_with_kids BOOLEAN DEFAULT FALSE,
  good_with_pets BOOLEAN DEFAULT FALSE,
  energy_level TEXT, -- low, medium, high
  location TEXT,
  adoption_fee DECIMAL(10,2),
  images TEXT[], -- array of image URLs
  status TEXT DEFAULT 'available', -- available, pending, adopted
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create adoption requests table
CREATE TABLE public.adoption_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE,
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adoption_requests ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Pets policies
CREATE POLICY "Anyone can view available pets" ON public.pets FOR SELECT USING (status = 'available');
CREATE POLICY "Users can view their own pets" ON public.pets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own pets" ON public.pets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pets" ON public.pets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own pets" ON public.pets FOR DELETE USING (auth.uid() = user_id);

-- Adoption requests policies
CREATE POLICY "Users can view requests for their pets" ON public.adoption_requests FOR SELECT USING (auth.uid() = owner_id OR auth.uid() = requester_id);
CREATE POLICY "Users can create adoption requests" ON public.adoption_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Pet owners can update request status" ON public.adoption_requests FOR UPDATE USING (auth.uid() = owner_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample pet data
INSERT INTO public.pets (name, type, breed, age, gender, size, color, description, health_status, vaccination_status, spayed_neutered, good_with_kids, good_with_pets, energy_level, location, adoption_fee, images, user_id) VALUES
('Buddy', 'dog', 'Golden Retriever', '2 years', 'Male', 'Large', 'Golden', 'Buddy is a friendly and energetic Golden Retriever who loves playing fetch and swimming. He''s great with kids and other dogs, making him the perfect family companion.', 'Excellent', 'Up to date', true, true, true, 'High', 'New York, NY', 350.00, ARRAY['https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&fit=crop&crop=faces'], NULL),
('Luna', 'cat', 'Siamese', '1 year', 'Female', 'Medium', 'Cream and Brown', 'Luna is a beautiful Siamese cat with striking blue eyes. She''s playful, intelligent, and loves attention from her humans.', 'Excellent', 'Up to date', true, true, false, 'Medium', 'Los Angeles, CA', 200.00, ARRAY['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=600&fit=crop&crop=faces'], NULL),
('Max', 'dog', 'German Shepherd', '3 years', 'Male', 'Large', 'Black and Tan', 'Max is a loyal and intelligent German Shepherd. He''s well-trained, protective, and would make an excellent guard dog for the right family.', 'Good', 'Up to date', true, true, true, 'High', 'Chicago, IL', 400.00, ARRAY['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800&h=600&fit=crop&crop=faces'], NULL),
('Whiskers', 'cat', 'Persian', '4 years', 'Male', 'Medium', 'White', 'Whiskers is a gentle Persian cat who loves to be pampered. He''s calm, affectionate, and perfect for someone looking for a laid-back companion.', 'Good', 'Up to date', true, true, true, 'Low', 'Miami, FL', 250.00, ARRAY['https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop&crop=faces'], NULL),
('Rocky', 'dog', 'Bulldog', '5 years', 'Male', 'Medium', 'Brindle', 'Rocky is a sweet and gentle Bulldog who loves lounging around and short walks. He''s great with children and has a calm temperament.', 'Good', 'Up to date', true, true, true, 'Low', 'Austin, TX', 300.00, ARRAY['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop&crop=faces'], NULL),
('Bella', 'dog', 'Labrador Retriever', '1 year', 'Female', 'Medium', 'Chocolate', 'Bella is a young and energetic Chocolate Lab who loves to play and learn new tricks. She''s perfect for an active family.', 'Excellent', 'Up to date', true, true, true, 'High', 'Seattle, WA', 275.00, ARRAY['https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&h=600&fit=crop&crop=faces'], NULL),
('Shadow', 'cat', 'Maine Coon', '2 years', 'Male', 'Large', 'Gray', 'Shadow is a majestic Maine Coon with a gentle giant personality. He''s friendly, sociable, and gets along well with everyone.', 'Excellent', 'Up to date', true, true, true, 'Medium', 'Portland, OR', 300.00, ARRAY['https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800&h=600&fit=crop&crop=faces'], NULL),
('Charlie', 'dog', 'Beagle', '6 years', 'Male', 'Medium', 'Tricolor', 'Charlie is a senior Beagle with lots of love to give. He''s calm, house-trained, and looking for a quiet home to spend his golden years.', 'Good', 'Up to date', true, true, true, 'Medium', 'Denver, CO', 150.00, ARRAY['https://images.unsplash.com/photo-1551717743-49959800b1f6?w=800&h=600&fit=crop&crop=faces'], NULL);
