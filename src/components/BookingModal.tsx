import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PSIIndicator from '@/components/PSIIndicator';
import { ParkingZone } from '@/data/mockData';
import { Booking, generateBookingId } from '@/data/bookings';
import {
  MapPin,
  Car,
  Clock,
  IndianRupee,
  CheckCircle,
  Navigation,
} from 'lucide-react';

interface BookingModalProps {
  zone: ParkingZone | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (booking: Booking) => void;
  routeInfo?: {
    distance: number;
    eta: number;
    congestion: 'low' | 'moderate' | 'high';
  } | null;
  userName?: string;
  userEmail?: string;
}

const BookingModal: React.FC<BookingModalProps> = ({
  zone,
  isOpen,
  onClose,
  onConfirm,
  routeInfo,
  userName = 'Citizen User',
  userEmail = 'citizen@example.com',
}) => {
  const [duration, setDuration] = useState('1');
  const [isConfirming, setIsConfirming] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!zone) return null;

  const totalAmount = zone.pricePerHour * parseInt(duration);

  const handleConfirm = () => {
    setIsConfirming(true);
    
    // Simulate booking confirmation
    setTimeout(() => {
      const booking: Booking = {
        id: generateBookingId(),
        zoneId: zone.id,
        zoneName: zone.name,
        wardName: zone.wardName,
        citizenEmail: userEmail,
        citizenName: userName,
        time: new Date().toISOString(),
        duration: parseInt(duration),
        status: 'confirmed',
        amount: totalAmount,
      };
      
      setIsConfirming(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        onConfirm(booking);
        setShowSuccess(false);
        setDuration('1');
      }, 1500);
    }, 1000);
  };

  const getCongestionColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-success';
      case 'moderate':
        return 'text-warning';
      case 'high':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Booking Confirmed!
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your parking slot has been reserved
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-primary" />
                  Book Parking
                </DialogTitle>
                <DialogDescription>
                  Reserve your parking spot at {zone.name}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Zone Info */}
                <div className="p-4 rounded-lg bg-secondary/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">
                      {zone.name}
                    </span>
                    <PSIIndicator value={zone.psi} size="sm" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{zone.wardName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Available Slots</span>
                    <span className="font-medium text-foreground">
                      {zone.availableSlots} / {zone.totalSlots}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Price per Hour</span>
                    <span className="font-medium text-primary">
                      ₹{zone.pricePerHour}
                    </span>
                  </div>
                </div>

                {/* Route Info */}
                {routeInfo && (
                  <div className="p-3 rounded-lg border border-border bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <Navigation className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Route Info</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Distance</p>
                        <p className="text-sm font-semibold">
                          {routeInfo.distance.toFixed(1)} km
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">ETA</p>
                        <p className="text-sm font-semibold">
                          {routeInfo.eta} min
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Traffic</p>
                        <p
                          className={`text-sm font-semibold capitalize ${getCongestionColor(
                            routeInfo.congestion
                          )}`}
                        >
                          {routeInfo.congestion}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Duration Selection */}
                <div className="space-y-2">
                  <Label htmlFor="duration" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Duration
                  </Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger id="duration">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Hour</SelectItem>
                      <SelectItem value="2">2 Hours</SelectItem>
                      <SelectItem value="3">3 Hours</SelectItem>
                      <SelectItem value="4">4 Hours</SelectItem>
                      <SelectItem value="5">5 Hours</SelectItem>
                      <SelectItem value="6">6 Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Total Amount */}
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">
                      Total Amount
                    </span>
                    <span className="text-xl font-bold text-primary flex items-center">
                      <IndianRupee className="w-5 h-5" />
                      {totalAmount}
                    </span>
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={isConfirming || zone.availableSlots === 0}
                >
                  {isConfirming ? 'Confirming...' : 'Confirm Booking'}
                </Button>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
