import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SeatSelectionProps {
  totalSeatsToSelect: number;
  selectedSeats: string[];
  onSeatsChange: (seats: string[]) => void;
  showtimeId: string;
}

interface Seat {
  id: string;
  row: string;
  number: number;
  isAvailable: boolean;
}

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const SEATS_PER_ROW = 12;

// Generate mock filled seats based on showtime (deterministic based on showtimeId)
const generateFilledSeats = (showtimeId: string): Set<string> => {
  const filled = new Set<string>();
  // Use showtime ID to create a pseudo-random but consistent pattern
  const hash = showtimeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Fill approximately 30-50% of seats
  ROWS.forEach((row, rowIndex) => {
    for (let i = 1; i <= SEATS_PER_ROW; i++) {
      const seatId = `${row}${i}`;
      // Create a deterministic pattern based on hash
      const shouldBeFilled = ((hash + rowIndex * 7 + i * 13) % 10) < 4;
      if (shouldBeFilled) {
        filled.add(seatId);
      }
    }
  });
  
  return filled;
};

const SeatSelection = ({ totalSeatsToSelect, selectedSeats, onSeatsChange, showtimeId }: SeatSelectionProps) => {
  const [filledSeats, setFilledSeats] = useState<Set<string>>(new Set());

  useEffect(() => {
    setFilledSeats(generateFilledSeats(showtimeId));
  }, [showtimeId]);

  const handleSeatClick = (seatId: string) => {
    if (filledSeats.has(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      // Deselect the seat
      onSeatsChange(selectedSeats.filter(s => s !== seatId));
    } else if (selectedSeats.length < totalSeatsToSelect) {
      // Select the seat if we haven't reached the limit
      onSeatsChange([...selectedSeats, seatId]);
    }
  };

  const generateSeats = (): Seat[][] => {
    return ROWS.map(row => {
      return Array.from({ length: SEATS_PER_ROW }, (_, i) => ({
        id: `${row}${i + 1}`,
        row,
        number: i + 1,
        isAvailable: !filledSeats.has(`${row}${i + 1}`),
      }));
    });
  };

  const seats = generateSeats();

  return (
    <div className="space-y-4">
      {/* Screen indicator */}
      <div className="text-center mb-6">
        <div className="bg-gradient-to-b from-primary/50 to-transparent h-8 rounded-t-full mx-8 flex items-center justify-center">
          <span className="text-xs text-primary-foreground font-medium tracking-widest">SCREEN</span>
        </div>
        <div className="h-1 bg-primary/30 mx-8 rounded-b-sm" />
      </div>

      {/* Seat grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-fit flex flex-col items-center gap-2">
          {seats.map((row, rowIndex) => (
            <div key={ROWS[rowIndex]} className="flex items-center gap-1">
              {/* Row label */}
              <span className="w-6 text-xs font-medium text-muted-foreground text-center">
                {ROWS[rowIndex]}
              </span>
              
              {/* Seats */}
              <div className="flex gap-1">
                {row.slice(0, 6).map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => handleSeatClick(seat.id)}
                    disabled={!seat.isAvailable}
                    className={cn(
                      "w-7 h-7 sm:w-8 sm:h-8 rounded text-xs font-medium transition-all duration-200",
                      "flex items-center justify-center",
                      !seat.isAvailable && "bg-muted text-muted-foreground cursor-not-allowed",
                      seat.isAvailable && !selectedSeats.includes(seat.id) && 
                        "border-2 border-green-500 text-green-500 hover:bg-green-500/20",
                      selectedSeats.includes(seat.id) && 
                        "bg-primary text-primary-foreground border-2 border-primary"
                    )}
                  >
                    {seat.number}
                  </button>
                ))}
              </div>
              
              {/* Aisle gap */}
              <div className="w-4 sm:w-6" />
              
              {/* More seats */}
              <div className="flex gap-1">
                {row.slice(6).map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => handleSeatClick(seat.id)}
                    disabled={!seat.isAvailable}
                    className={cn(
                      "w-7 h-7 sm:w-8 sm:h-8 rounded text-xs font-medium transition-all duration-200",
                      "flex items-center justify-center",
                      !seat.isAvailable && "bg-muted text-muted-foreground cursor-not-allowed",
                      seat.isAvailable && !selectedSeats.includes(seat.id) && 
                        "border-2 border-green-500 text-green-500 hover:bg-green-500/20",
                      selectedSeats.includes(seat.id) && 
                        "bg-primary text-primary-foreground border-2 border-primary"
                    )}
                  >
                    {seat.number}
                  </button>
                ))}
              </div>
              
              {/* Row label */}
              <span className="w-6 text-xs font-medium text-muted-foreground text-center">
                {ROWS[rowIndex]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-green-500 rounded flex items-center justify-center">
            <span className="text-[10px] text-green-500">1</span>
          </div>
          <span className="text-xs text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary border-2 border-primary rounded flex items-center justify-center">
            <span className="text-[10px] text-primary-foreground">1</span>
          </div>
          <span className="text-xs text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-muted rounded flex items-center justify-center">
            <span className="text-[10px] text-muted-foreground">1</span>
          </div>
          <span className="text-xs text-muted-foreground">Filled</span>
        </div>
      </div>

      {/* Selection info */}
      <div className="text-center pt-2">
        <p className="text-sm text-muted-foreground">
          Selected: <span className="font-medium text-foreground">{selectedSeats.length}</span> / {totalSeatsToSelect} seats
        </p>
        {selectedSeats.length > 0 && (
          <p className="text-sm text-primary font-medium mt-1">
            Seats: {selectedSeats.sort().join(', ')}
          </p>
        )}
      </div>
    </div>
  );
};

export default SeatSelection;
