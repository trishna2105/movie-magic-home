import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Theater {
  id: string;
  name: string;
  location: string;
  city: string;
  address: string | null;
  amenities: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Showtime {
  id: string;
  movie_id: string;
  theater_id: string;
  show_date: string;
  show_time: string;
  price_multiplier: number | null;
  available_seats: number | null;
  is_available: boolean | null;
  created_at: string;
  updated_at: string;
  theater?: Theater;
}

export const useTheaters = () => {
  return useQuery({
    queryKey: ['theaters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('theaters')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Theater[];
    },
  });
};

export const useShowtimes = (movieId: string, date?: string) => {
  return useQuery({
    queryKey: ['showtimes', movieId, date],
    queryFn: async () => {
      let query = supabase
        .from('showtimes')
        .select(`
          *,
          theater:theaters(*)
        `)
        .eq('movie_id', movieId)
        .eq('is_available', true)
        .order('show_time');

      if (date) {
        query = query.eq('show_date', date);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as (Showtime & { theater: Theater })[];
    },
    enabled: !!movieId,
  });
};

export const useTheaterShowtimes = (movieId: string, date?: string) => {
  return useQuery({
    queryKey: ['theater-showtimes', movieId, date],
    queryFn: async () => {
      let query = supabase
        .from('showtimes')
        .select(`
          *,
          theater:theaters(*)
        `)
        .eq('movie_id', movieId)
        .eq('is_available', true);

      if (date) {
        query = query.eq('show_date', date);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Group showtimes by theater
      const groupedByTheater = (data as (Showtime & { theater: Theater })[]).reduce(
        (acc, showtime) => {
          const theaterId = showtime.theater_id;
          if (!acc[theaterId]) {
            acc[theaterId] = {
              theater: showtime.theater,
              showtimes: [],
            };
          }
          acc[theaterId].showtimes.push(showtime);
          return acc;
        },
        {} as Record<string, { theater: Theater; showtimes: Showtime[] }>
      );

      // Sort showtimes within each theater
      Object.values(groupedByTheater).forEach((group) => {
        group.showtimes.sort((a, b) => {
          const timeA = convertTo24Hour(a.show_time);
          const timeB = convertTo24Hour(b.show_time);
          return timeA.localeCompare(timeB);
        });
      });

      return Object.values(groupedByTheater);
    },
    enabled: !!movieId,
  });
};

// Helper function to convert 12-hour time to 24-hour for sorting
function convertTo24Hour(time12h: string): string {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  
  if (hours === '12') {
    hours = modifier === 'AM' ? '00' : '12';
  } else if (modifier === 'PM') {
    hours = String(parseInt(hours, 10) + 12);
  }
  
  return `${hours.padStart(2, '0')}:${minutes}`;
}
