import { Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  title: string;
  description: string;
  backgroundImage: string;
  rating: string;
  duration: string;
  genre: string;
}

const HeroSection = ({
  title,
  description,
  backgroundImage,
  rating,
  duration,
  genre,
}: HeroSectionProps) => {
  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-end overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt={title}
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
            <span className="text-muted-foreground text-sm">{rating}</span>
            <span className="text-muted-foreground text-sm">•</span>
            <span className="text-muted-foreground text-sm">{duration}</span>
            <span className="text-muted-foreground text-sm">•</span>
            <span className="text-muted-foreground text-sm">{genre}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
            {title}
          </h1>

          {/* Description */}
          <p className="text-muted-foreground text-base md:text-lg mb-8 line-clamp-3">
            {description}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-8">
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
