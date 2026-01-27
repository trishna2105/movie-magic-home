import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings } from "@/hooks/useBookings";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Ticket, Calendar, Clock, CreditCard } from "lucide-react";
import { format } from "date-fns";

const Bookings = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { data: bookings, isLoading } = useBookings();

  useEffect(() => {
    if (!authLoading && !user) {
      setShowAuthModal(true);
    }
  }, [user, authLoading]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSignInClick={() => setShowAuthModal(true)} />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Ticket className="w-8 h-8 text-primary" />
            My Bookings
          </h1>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Skeleton className="w-24 h-36 rounded" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !user ? (
            <Card className="bg-card border-border">
              <CardContent className="p-12 text-center">
                <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Sign in to view your bookings
                </h2>
                <p className="text-muted-foreground">
                  You need to be logged in to see your booking history.
                </p>
              </CardContent>
            </Card>
          ) : bookings && bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking: any) => (
                <Card key={booking.id} className="bg-card border-border overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-32 h-48 sm:h-auto">
                        <img
                          src={booking.movies?.poster_url || 'https://via.placeholder.com/128x192'}
                          alt={booking.movies?.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4 sm:p-6">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                          <h3 className="text-lg font-semibold text-foreground">
                            {booking.movies?.title}
                          </h3>
                          <Badge className={getStatusColor(booking.payment_status)}>
                            {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(booking.booking_date), 'EEE, MMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{booking.booking_time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Ticket className="w-4 h-4" />
                            <span>{booking.seats} {booking.seats > 1 ? 'Seats' : 'Seat'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-primary font-semibold">
                            <CreditCard className="w-4 h-4" />
                            <span>₹{booking.total_amount}</span>
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-3">
                          Booked on {format(new Date(booking.created_at), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="p-12 text-center">
                <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  No bookings yet
                </h2>
                <p className="text-muted-foreground">
                  Start exploring movies and book your first ticket!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => {
          setShowAuthModal(false);
          if (!user) navigate('/');
        }} 
      />
    </div>
  );
};

export default Bookings;
