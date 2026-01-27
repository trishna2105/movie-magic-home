import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MovieSection from "@/components/MovieSection";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import BookingModal from "@/components/BookingModal";
import { useAvailableMovies, Movie } from "@/hooks/useMovies";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
  const { data: movies, isLoading } = useAvailableMovies();

  const featuredMovie = movies?.[0];
  const nowPlaying = movies?.filter(m => m.rating && m.rating > 0).slice(0, 5) || [];
  const trending = movies?.filter(m => m.rating && m.rating >= 8.5).slice(0, 5) || [];
  const comingSoon = movies?.filter(m => !m.rating || m.rating === 0).slice(0, 5) || [];

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setShowBookingModal(true);
  };

  const handleHeroBookClick = () => {
    if (featuredMovie) {
      setSelectedMovie(featuredMovie);
      setShowBookingModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSignInClick={() => setShowAuthModal(true)} />
      
      <main>
        {/* Hero Section */}
        <HeroSection
          movie={featuredMovie}
          loading={isLoading}
          onBookClick={handleHeroBookClick}
        />

        {/* Movie Sections */}
        <div className="space-y-4">
          <MovieSection 
            title="🎬 Now Playing" 
            movies={nowPlaying} 
            loading={isLoading}
            onMovieClick={handleMovieClick}
          />
          <MovieSection 
            title="🔥 Trending Now" 
            movies={trending} 
            loading={isLoading}
            onMovieClick={handleMovieClick}
          />
          <MovieSection 
            title="🎥 Coming Soon" 
            movies={comingSoon} 
            loading={isLoading}
            onMovieClick={handleMovieClick}
          />
        </div>
      </main>

      <Footer />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      {/* Booking Modal */}
      {selectedMovie && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedMovie(null);
          }}
          movie={selectedMovie}
          onRequireAuth={() => {
            setShowBookingModal(false);
            setShowAuthModal(true);
          }}
        />
      )}
    </div>
  );
};

export default Index;
