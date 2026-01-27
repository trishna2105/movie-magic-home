import { Star } from "lucide-react";
import { Movie } from "@/hooks/useMovies";

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <div className="relative overflow-hidden rounded-lg card-hover">
        {/* Poster */}
        <div className="aspect-[2/3] overflow-hidden">
          <img
            src={movie.poster_url || 'https://via.placeholder.com/400x600'}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/80 to-transparent p-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-foreground font-semibold text-sm">
              {movie.rating ? `${movie.rating}/10` : 'N/A'}
            </span>
            <span className="text-muted-foreground text-xs ml-1">
              {movie.votes || '0'} Votes
            </span>
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            Book Now
          </span>
        </div>
      </div>

      {/* Movie Info */}
      <div className="mt-3 space-y-1">
        <h3 className="text-foreground font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        <p className="text-muted-foreground text-xs line-clamp-1">
          {movie.genres?.join(" / ") || 'Unknown'}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
