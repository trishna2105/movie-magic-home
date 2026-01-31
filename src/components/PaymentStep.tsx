import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, CreditCard, Smartphone, Building } from 'lucide-react';
import { format } from 'date-fns';

interface PaymentStepProps {
  movieTitle: string;
  theaterName: string;
  selectedDate: string;
  showTime: string;
  selectedSeats: string[];
  totalAmount: number;
  processing: boolean;
  onPayment: () => void;
}

type PaymentMethod = 'credit' | 'debit' | 'upi';

const PaymentStep = ({
  movieTitle,
  theaterName,
  selectedDate,
  showTime,
  selectedSeats,
  totalAmount,
  processing,
  onPayment,
}: PaymentStepProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [upiId, setUpiId] = useState('');

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const groups = digits.match(/.{1,4}/g);
    return groups ? groups.join(' ').slice(0, 19) : '';
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 2) {
      return digits.slice(0, 2) + '/' + digits.slice(2, 4);
    }
    return digits;
  };

  const isFormValid = () => {
    if (paymentMethod === 'upi') {
      return upiId.includes('@');
    }
    return (
      cardNumber.replace(/\s/g, '').length === 16 &&
      cardExpiry.length === 5 &&
      cardCvv.length >= 3 &&
      cardName.length > 2
    );
  };

  return (
    <div className="space-y-4 mt-4">
      {/* Booking Summary */}
      <div className="p-4 bg-muted rounded-lg space-y-2">
        <h3 className="font-semibold text-foreground mb-3">Booking Summary</h3>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Movie:</span>
          <span className="text-foreground font-medium">{movieTitle}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Theater:</span>
          <span className="text-foreground">{theaterName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Date:</span>
          <span className="text-foreground">{format(new Date(selectedDate), 'EEE, MMM d, yyyy')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Time:</span>
          <span className="text-foreground">{showTime}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Seats:</span>
          <span className="text-foreground font-medium">{selectedSeats.sort().join(', ')}</span>
        </div>
        <div className="flex justify-between font-bold pt-2 border-t border-border mt-2">
          <span className="text-foreground">Total Amount:</span>
          <span className="text-primary text-lg">₹{totalAmount}</span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-3">
        <Label className="text-foreground font-semibold">Select Payment Method</Label>
        <RadioGroup
          value={paymentMethod}
          onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
          className="space-y-2"
        >
          <div
            className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              paymentMethod === 'upi'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:bg-muted'
            }`}
            onClick={() => setPaymentMethod('upi')}
          >
            <RadioGroupItem value="upi" id="upi" />
            <Smartphone className="w-5 h-5 text-muted-foreground" />
            <Label htmlFor="upi" className="flex-1 cursor-pointer text-foreground">
              UPI
            </Label>
            <span className="text-xs text-muted-foreground">Instant Payment</span>
          </div>

          <div
            className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              paymentMethod === 'credit'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:bg-muted'
            }`}
            onClick={() => setPaymentMethod('credit')}
          >
            <RadioGroupItem value="credit" id="credit" />
            <CreditCard className="w-5 h-5 text-muted-foreground" />
            <Label htmlFor="credit" className="flex-1 cursor-pointer text-foreground">
              Credit Card
            </Label>
            <span className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</span>
          </div>

          <div
            className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              paymentMethod === 'debit'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:bg-muted'
            }`}
            onClick={() => setPaymentMethod('debit')}
          >
            <RadioGroupItem value="debit" id="debit" />
            <Building className="w-5 h-5 text-muted-foreground" />
            <Label htmlFor="debit" className="flex-1 cursor-pointer text-foreground">
              Debit Card
            </Label>
            <span className="text-xs text-muted-foreground">All Banks Supported</span>
          </div>
        </RadioGroup>
      </div>

      {/* Payment Form */}
      <div className="space-y-4 p-4 border border-border rounded-lg">
        {paymentMethod === 'upi' ? (
          <div className="space-y-2">
            <Label htmlFor="upi-id" className="text-foreground">UPI ID</Label>
            <Input
              id="upi-id"
              placeholder="yourname@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="bg-background border-border text-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Enter your UPI ID (e.g., name@paytm, number@ybl)
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="card-name" className="text-foreground">Cardholder Name</Label>
              <Input
                id="card-name"
                placeholder="Name on card"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-number" className="text-foreground">Card Number</Label>
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry" className="text-foreground">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv" className="text-foreground">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  type="password"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mock Payment Notice */}
      <div className="p-3 bg-muted/50 rounded-lg border border-dashed border-border">
        <p className="text-xs text-muted-foreground text-center">
          🔒 This is a demo payment. No real transaction will occur.
        </p>
      </div>

      {/* Pay Button */}
      <Button
        onClick={onPayment}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        disabled={processing || !isFormValid()}
      >
        {processing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            {paymentMethod === 'upi' ? (
              <Smartphone className="w-4 h-4 mr-2" />
            ) : (
              <CreditCard className="w-4 h-4 mr-2" />
            )}
            Pay ₹{totalAmount}
          </>
        )}
      </Button>
    </div>
  );
};

export default PaymentStep;
