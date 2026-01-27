import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateBooking, useUpdateBookingPayment } from '@/hooks/useBookings';
import { Movie } from '@/hooks/useMovies';
import { toast } from '@/hooks/use-toast';
import { Loader2, Calendar, Clock, Users, CreditCard, CheckCircle } from 'lucide-react';
import { format, addDays } from 'date-fns';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie;
  onRequireAuth: () => void;
}

type BookingStep = 'details' | 'payment' | 'success';

const BookingModal = ({ isOpen, onClose, movie, onRequireAuth }: BookingModalProps) => {
  const { user } = useAuth();
  const createBooking = useCreateBooking();
  const updatePayment = useUpdateBookingPayment();
  
  const [step, setStep] = useState<BookingStep>('details');
  const [bookingDate, setBookingDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [bookingTime, setBookingTime] = useState('');
  const [seats, setSeats] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);

  const showtimes = ['10:00 AM', '1:30 PM', '4:00 PM', '7:30 PM', '10:00 PM'];
  const totalAmount = (movie.price || 250) * seats;

  // Generate next 7 days
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      value: format(date, 'yyyy-MM-dd'),
      label: format(date, 'EEE, MMM d'),
    };
  });

  const handleBooking = async () => {
    if (!user) {
      onRequireAuth();
      return;
    }

    if (!bookingTime) {
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
        booking_date: bookingDate,
        booking_time: bookingTime,
        seats,
        total_amount: totalAmount,
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
    setStep('details');
    setBookingDate(format(new Date(), 'yyyy-MM-dd'));
    setBookingTime('');
    setSeats(1);
    setCurrentBookingId(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="bg-card border-border sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {step === 'details' && 'Book Tickets'}
            {step === 'payment' && 'Complete Payment'}
            {step === 'success' && 'Booking Confirmed!'}
          </DialogTitle>
        </DialogHeader>

        {/* Movie Info */}
        <div className="flex gap-4 p-4 bg-muted rounded-lg">
          <img
            src={movie.poster_url || ''}
            alt={movie.title}
            className="w-20 h-28 object-cover rounded"
          />
          <div>
            <h3 className="font-semibold text-foreground">{movie.title}</h3>
            <p className="text-sm text-muted-foreground">{movie.duration} • {movie.language}</p>
            <p className="text-sm text-muted-foreground">{movie.genres?.join(', ')}</p>
            <p className="text-primary font-semibold mt-2">₹{movie.price}/ticket</p>
          </div>
        </div>

        {step === 'details' && (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Select Date
              </Label>
              <Select value={bookingDate} onValueChange={setBookingDate}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {availableDates.map((date) => (
                    <SelectItem key={date.value} value={date.value}>
                      {date.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" /> Select Showtime
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {showtimes.map((time) => (
                  <Button
                    key={time}
                    variant={bookingTime === time ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setBookingTime(time)}
                    className={bookingTime === time 
                      ? 'bg-primary text-primary-foreground' 
                      : 'border-border text-foreground hover:bg-muted'
                    }
                  >
                    {time}
                  </Button>
                ))}
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
                <span className="text-muted-foreground">Date:</span>
                <span className="text-foreground">{format(new Date(bookingDate), 'EEE, MMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time:</span>
                <span className="text-foreground">{bookingTime}</span>
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
                <span className="text-muted-foreground">Date:</span>
                <span className="text-foreground">{format(new Date(bookingDate), 'EEE, MMM d')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time:</span>
                <span className="text-foreground">{bookingTime}</span>
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
