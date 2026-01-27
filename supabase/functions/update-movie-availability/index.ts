import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get current date
    const today = new Date().toISOString().split('T')[0];

    // Update movies: set is_available to true for movies with release_date <= today
    const { data: updatedMovies, error: updateError } = await supabase
      .from('movies')
      .update({ is_available: true })
      .lte('release_date', today)
      .eq('is_available', false)
      .select();

    if (updateError) {
      console.error('Error updating movie availability:', updateError);
      throw updateError;
    }

    // Also mark movies as unavailable if they're too old (e.g., released more than 90 days ago)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const cutoffDate = ninetyDaysAgo.toISOString().split('T')[0];

    const { data: archivedMovies, error: archiveError } = await supabase
      .from('movies')
      .update({ is_available: false })
      .lt('release_date', cutoffDate)
      .eq('is_available', true)
      .select();

    if (archiveError) {
      console.error('Error archiving old movies:', archiveError);
    }

    const result = {
      message: 'Movie availability updated successfully',
      timestamp: new Date().toISOString(),
      moviesNowAvailable: updatedMovies?.length || 0,
      moviesArchived: archivedMovies?.length || 0,
    };

    console.log('Update result:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error in update-movie-availability:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
