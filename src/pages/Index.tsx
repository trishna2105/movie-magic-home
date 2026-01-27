import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MovieSection from "@/components/MovieSection";
import Footer from "@/components/Footer";
import {
  featuredMovie,
  nowPlayingMovies,
  upcomingMovies,
  trendingMovies,
} from "@/data/movies";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <HeroSection
          title={featuredMovie.title}
          description={featuredMovie.description}
          backgroundImage={featuredMovie.backgroundImage}
          rating={featuredMovie.rating}
          duration={featuredMovie.duration}
          genre={featuredMovie.genre}
        />

        {/* Movie Sections */}
        <div className="space-y-4">
          <MovieSection title="🎬 Now Playing" movies={nowPlayingMovies} />
          <MovieSection title="🔥 Trending Now" movies={trendingMovies} />
          <MovieSection title="🎥 Coming Soon" movies={upcomingMovies} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
