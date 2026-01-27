import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">B</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">
              Book<span className="text-primary">MyShow</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Movies
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Stream
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Events
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Plays
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Sports
            </a>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Search className="w-5 h-5" />
            </Button>
            <Button className="hidden sm:flex bg-primary hover:bg-primary/90 text-primary-foreground">
              Sign In
            </Button>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
                Movies
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Stream
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Events
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Plays
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Sports
              </a>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-2">
                Sign In
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
