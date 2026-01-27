import MovieCard from "./MovieCard";
import { ChevronRight } from "lucide-react";

interface Movie {
  id: number;
  title: string;
  poster: string;
  rating: number;
  votes: string;
  genres: string[];
}

interface MovieSectionProps {
  title: string;
  movies: Movie[];
}

const MovieSection = ({ title, movies }: MovieSectionProps) => {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{title}</h2>
          <button className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors text-sm font-medium">
            See All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <MovieCard
                title={movie.title}
                poster={movie.poster}
                rating={movie.rating}
                votes={movie.votes}
                genres={movie.genres}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieSection;
