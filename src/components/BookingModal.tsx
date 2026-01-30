import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateBooking, useUpdateBookingPayment } from '@/hooks/useBookings';
import { Movie } from '@/hooks/useMovies';
import { useTheaterShowtimes, Showtime, Theater } from '@/hooks/useTheaters';
import { toast } from '@/hooks/use-toast';
import { Loader2, Calendar, Clock, Users, CreditCard, CheckCircle, MapPin, ChevronLeft } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie;
  onRequireAuth: () => void;
}

type BookingStep = 'theaters' | 'details' | 'payment' | 'success';

interface SelectedShowtime {
  showtime: Showtime;
  theater: Theater;
}

const BookingModal = ({ isOpen, onClose, movie, onRequireAuth }: BookingModalProps) => {
  const { user } = useAuth();
  const createBooking = useCreateBooking();
  const updatePayment = useUpdateBookingPayment();
  
  const [step, setStep] = useState<BookingStep>('theaters');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedShowtime, setSelectedShowtime] = useState<SelectedShowtime | null>(null);
  const [seats, setSeats] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);

  const { data: theaterShowtimes, isLoading: loadingShowtimes } = useTheaterShowtimes(movie.id, selectedDate);

  const totalAmount = useMemo(() => {
    const basePrice = movie.price || 250;
    const multiplier = selectedShowtime?.showtime.price_multiplier || 1;
    return basePrice * multiplier * seats;
  }, [movie.price, selectedShowtime, seats]);

  // Generate next 7 days
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      value: format(date, 'yyyy-MM-dd'),
      dayLabel: format(date, 'EEE'),
      dateLabel: format(date, 'd'),
      monthLabel: format(date, 'MMM'),
    };
  });

  const handleSelectShowtime = (showtime: Showtime, theater: Theater) => {
    setSelectedShowtime({ showtime, theater });
    setStep('details');
  };

  const handleBooking = async () => {
    if (!user) {
      onRequireAuth();
      return;
    }

    if (!selectedShowtime) {
      toast({
        title: 'Select Showtime',
        description: 'Please select a showtime to continue.',
        variant: 'destructive',
      });
      return;
    }

    setProcessing(true);
    try {
      const booking = await createBooking.mutateAsync({
        movie_id: movie.id,
        booking_date: selectedDate,
        booking_time: selectedShowtime.showtime.show_time,
        seats,
        total_amount: totalAmount,
        theater_id: selectedShowtime.theater.id,
        showtime_id: selectedShowtime.showtime.id,
      });
      
      setCurrentBookingId(booking.id);
      setStep('payment');
      
      // Mock email notification (toast)
      toast({
        title: '📧 Booking Confirmation Email Sent!',
        description: `A confirmation email has been sent for ${movie.title}.`,
      });
    } catch (error: any) {
      toast({
        title: 'Booking Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!currentBookingId) return;
    
    setProcessing(true);
    
    // Mock payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      await updatePayment.mutateAsync({
        bookingId: currentBookingId,
        status: 'paid',
      });
      
      setStep('success');
      
      // Mock payment confirmation notification
      toast({
        title: '💳 Payment Successful!',
        description: `Your payment of ₹${totalAmount} has been processed.`,
      });
    } catch (error: any) {
      toast({
        title: 'Payment Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const resetAndClose = () => {
    setStep('theaters');
    setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
    setSelectedShowtime(null);
    setSeats(1);
    setCurrentBookingId(null);
    onClose();
  };

  const goBack = () => {
    if (step === 'details') {
      setSelectedShowtime(null);
      setStep('theaters');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="bg-card border-border sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-2">
            {step === 'details' && (
              <Button variant="ghost" size="icon" onClick={goBack} className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle className="text-xl font-bold text-foreground">
              {step === 'theaters' && 'Select Theater & Showtime'}
              {step === 'details' && 'Confirm Booking'}
              {step === 'payment' && 'Complete Payment'}
              {step === 'success' && 'Booking Confirmed!'}
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Movie Info - Always Visible */}
        <div className="flex gap-4 p-4 bg-muted rounded-lg flex-shrink-0">
          <img
            src={movie.poster_url || ''}
            alt={movie.title}
            className="w-16 h-24 object-cover rounded"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{movie.title}</h3>
            <p className="text-sm text-muted-foreground">{movie.duration} • {movie.language}</p>
            <p className="text-sm text-muted-foreground truncate">{movie.genres?.join(', ')}</p>
            <p className="text-primary font-semibold mt-1">₹{movie.price}/ticket</p>
          </div>
        </div>

        {step === 'theaters' && (
          <div className="flex-1 overflow-hidden flex flex-col space-y-4 mt-4">
            {/* Date Selection */}
            <div className="space-y-2 flex-shrink-0">
              <Label className="text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Select Date
              </Label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {availableDates.map((date) => (
                  <Button
                    key={date.value}
                    variant={selectedDate === date.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDate(date.value)}
                    className={`flex flex-col h-16 min-w-[60px] px-3 ${
                      selectedDate === date.value 
                        ? 'bg-primary text-primary-foreground' 
                        : 'border-border text-foreground hover:bg-muted'
                    }`}
                  >
                    <span className="text-xs">{date.dayLabel}</span>
                    <span className="text-lg font-bold">{date.dateLabel}</span>
                    <span className="text-xs">{date.monthLabel}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Theaters & Showtimes */}
            <div className="space-y-2 flex-1 overflow-hidden flex flex-col">
              <h2 className="text-lg font-semibold text-foreground flex-shrink-0">
                Theaters Showing {movie.title}
              </h2>
              
              <ScrollArea className="flex-1">
                <div className="space-y-4 pr-4">
                  {loadingShowtimes ? (
                    <>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 bg-muted/50 rounded-lg space-y-3">
                          <Skeleton className="h-5 w-48" />
                          <Skeleton className="h-4 w-64" />
                          <div className="flex gap-2">
                            <Skeleton className="h-10 w-20" />
                            <Skeleton className="h-10 w-20" />
                            <Skeleton className="h-10 w-20" />
                          </div>
                        </div>
                      ))}
                    </>
                  ) : theaterShowtimes && theaterShowtimes.length > 0 ? (
                    theaterShowtimes.map(({ theater, showtimes }) => (
                      <div key={theater.id} className="p-4 bg-muted/50 rounded-lg space-y-3">
                        <div>
                          <h3 className="font-semibold text-foreground">{theater.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {theater.location}
                          </p>
                          {theater.amenities && theater.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {theater.amenities.slice(0, 3).map((amenity) => (
                                <Badge key={amenity} variant="secondary" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {showtimes.map((showtime) => (
                            <Button
                              key={showtime.id}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSelectShowtime(showtime, theater)}
                              className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                            >
                              <Clock className="w-3 h-3 mr-1" />
                              {showtime.show_time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No showtimes available for this date.</p>
                      <p className="text-sm mt-2">Try selecting a different date.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}

        {step === 'details' && selectedShowtime && (
          <div className="space-y-4 mt-4">
            {/* Selected Theater & Time */}
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Theater:</span>
                <span className="text-foreground font-medium">{selectedShowtime.theater.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="text-foreground text-sm">{selectedShowtime.theater.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="text-foreground">{format(new Date(selectedDate), 'EEE, MMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="text-foreground font-medium">{selectedShowtime.showtime.show_time}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seats" className="text-foreground flex items-center gap-2">
                <Users className="w-4 h-4" /> Number of Seats
              </Label>
              <Input
                id="seats"
                type="number"
                min={1}
                max={10}
                value={seats}
                onChange={(e) => setSeats(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <span className="text-foreground">Total Amount:</span>
              <span className="text-2xl font-bold text-primary">₹{totalAmount}</span>
            </div>

            <Button
              onClick={handleBooking}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Proceed to Payment'
              )}
            </Button>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-4 mt-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Theater:</span>
                <span className="text-foreground">{selectedShowtime?.theater.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date:</span>
                <span className="text-foreground">{format(new Date(selectedDate), 'EEE, MMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time:</span>
                <span className="text-foreground">{selectedShowtime?.showtime.show_time}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Seats:</span>
                <span className="text-foreground">{seats}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-border">
                <span className="text-foreground">Total:</span>
                <span className="text-primary">₹{totalAmount}</span>
              </div>
            </div>

            <div className="p-4 border border-dashed border-border rounded-lg text-center">
              <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Mock Payment Gateway</p>
              <p className="text-xs text-muted-foreground">Click below to simulate payment</p>
            </div>

            <Button
              onClick={handlePayment}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay ₹{totalAmount}
                </>
              )}
            </Button>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Booking Confirmed!</h3>
              <p className="text-muted-foreground mt-2">
                Your tickets for {movie.title} have been booked successfully.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Movie:</span>
                <span className="text-foreground font-medium">{movie.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Theater:</span>
                <span className="text-foreground">{selectedShowtime?.theater.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date:</span>
                <span className="text-foreground">{format(new Date(selectedDate), 'EEE, MMM d')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time:</span>
                <span className="text-foreground">{selectedShowtime?.showtime.show_time}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Seats:</span>
                <span className="text-foreground">{seats}</span>
              </div>
            </div>
            <Button
              onClick={resetAndClose}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
