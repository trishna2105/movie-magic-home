import MovieCard from "./MovieCard";
import { ChevronRight } from "lucide-react";
import { Movie } from "@/hooks/useMovies";
import { Skeleton } from "@/components/ui/skeleton";

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  loading?: boolean;
  onMovieClick: (movie: Movie) => void;
}

const MovieSection = ({ title, movies, loading, onMovieClick }: MovieSectionProps) => {
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
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="aspect-[2/3] rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {movies.map((movie, index) => (
              <div
                key={movie.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <MovieCard
                  movie={movie}
                  onClick={() => onMovieClick(movie)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MovieSection;
