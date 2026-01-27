import { Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Movie } from "@/hooks/useMovies";
import { Skeleton } from "@/components/ui/skeleton";

interface HeroSectionProps {
  movie?: Movie | null;
  loading?: boolean;
  onBookClick: () => void;
}

const HeroSection = ({ movie, loading, onBookClick }: HeroSectionProps) => {
  if (loading) {
    return (
      <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-end overflow-hidden bg-muted">
        <div className="relative container mx-auto px-4 pb-12 md:pb-20 pt-32">
          <div className="max-w-2xl space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-20 w-3/4" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-36" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!movie) return null;

  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-end overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={movie.poster_url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80'}
          alt={movie.title}
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 pb-12 md:pb-20 pt-32">
        <div className="max-w-2xl animate-slide-in">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
              FEATURED
            </span>
            <span className="text-muted-foreground text-sm">{movie.language}</span>
            <span className="text-muted-foreground text-sm">•</span>
            <span className="text-muted-foreground text-sm">{movie.duration}</span>
            <span className="text-muted-foreground text-sm">•</span>
            <span className="text-muted-foreground text-sm">{movie.genres?.join(' / ')}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
            {movie.title}
          </h1>

          {/* Description */}
          <p className="text-muted-foreground text-base md:text-lg mb-8 line-clamp-3">
            {movie.description}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-8"
              onClick={onBookClick}
            >
              <Play className="w-5 h-5 fill-current" />
              Book Tickets
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-muted-foreground/30 text-foreground hover:bg-muted gap-2"
            >
              <Info className="w-5 h-5" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
