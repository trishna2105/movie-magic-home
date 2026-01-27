import { Star } from "lucide-react";

interface MovieCardProps {
  title: string;
  poster: string;
  rating: number;
  votes: string;
  genres: string[];
}

const MovieCard = ({ title, poster, rating, votes, genres }: MovieCardProps) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg card-hover">
        {/* Poster */}
        <div className="aspect-[2/3] overflow-hidden">
          <img
            src={poster}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/80 to-transparent p-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-foreground font-semibold text-sm">{rating}/10</span>
            <span className="text-muted-foreground text-xs ml-1">{votes} Votes</span>
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Movie Info */}
      <div className="mt-3 space-y-1">
        <h3 className="text-foreground font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-xs line-clamp-1">
          {genres.join(" / ")}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
