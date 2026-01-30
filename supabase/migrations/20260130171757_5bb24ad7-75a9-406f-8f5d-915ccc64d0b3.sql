-- Create theaters table
CREATE TABLE public.theaters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Mumbai',
  address TEXT,
  amenities TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create showtimes table linking movies to theaters
CREATE TABLE public.showtimes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  movie_id UUID NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
  theater_id UUID NOT NULL REFERENCES public.theaters(id) ON DELETE CASCADE,
  show_date DATE NOT NULL,
  show_time TEXT NOT NULL,
  price_multiplier NUMERIC DEFAULT 1.0,
  available_seats INTEGER DEFAULT 100,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(movie_id, theater_id, show_date, show_time)
);

-- Enable RLS
ALTER TABLE public.theaters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showtimes ENABLE ROW LEVEL SECURITY;

-- Create policies for theaters (publicly readable)
CREATE POLICY "Anyone can view theaters" 
ON public.theaters 
FOR SELECT 
USING (true);

-- Create policies for showtimes (publicly readable)
CREATE POLICY "Anyone can view showtimes" 
ON public.showtimes 
FOR SELECT 
USING (true);

-- Add theater_id and showtime_id to bookings table
ALTER TABLE public.bookings 
ADD COLUMN theater_id UUID REFERENCES public.theaters(id),
ADD COLUMN showtime_id UUID REFERENCES public.showtimes(id);

-- Insert sample theaters
INSERT INTO public.theaters (name, location, city, address, amenities) VALUES
('PVR Cinemas', 'Phoenix Mall, Lower Parel', 'Mumbai', 'Phoenix Marketcity, Lower Parel, Mumbai 400013', ARRAY['Dolby Atmos', 'IMAX', 'Recliner Seats', 'Parking']),
('INOX Megaplex', 'R-City Mall, Ghatkopar', 'Mumbai', 'R-City Mall, LBS Marg, Ghatkopar West, Mumbai 400086', ARRAY['4DX', 'IMAX', 'Food Court']),
('Cinepolis', 'Viviana Mall, Thane', 'Mumbai', 'Viviana Mall, Thane West 400606', ARRAY['VIP Lounge', 'Dolby Atmos', 'Kids Zone']),
('PVR ICON', 'Oberoi Mall, Goregaon', 'Mumbai', 'Oberoi Mall, Goregaon East, Mumbai 400063', ARRAY['Director''s Cut', 'IMAX', 'Premium Lounge']),
('Carnival Cinemas', 'Andheri West', 'Mumbai', 'Oshiwara, Andheri West, Mumbai 400053', ARRAY['Dolby', 'Parking']);