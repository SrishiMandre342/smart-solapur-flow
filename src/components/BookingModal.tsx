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
import { Label } from '@/components/ui/label';
import PSIIndicator from '@/components/PSIIndicator';
import { ParkingZone } from '@/data/mockData';
import { MapPin, Car, Clock, IndianRupee, CheckCircle, Navigation } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Backend services
import { createBooking } from '@/services/bookings';
import { updateZoneSlots } from '@/services/zones';

interface BookingModalProps {
  zone: ParkingZone | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
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
  onSuccess,
  routeInfo,
  userName = "Citizen",
  userEmail = "unknown@example.com",
}) => {

  const [duration, setDuration] = useState('1');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  if (!zone) return null;

  const totalAmount = zone.pricePerHour * parseInt(duration);

  const handleConfirm = async () => {
    if (zone.availableSlots === 0) {
      toast({
        title: "No Slots Available",
        description: "Please select another parking zone.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Create booking in Firestore
      await createBooking({
        zoneId: zone.id,
        zoneName: zone.name,
        wardName: zone.wardName,
        citizenName: userName,
        citizenEmail: userEmail,
        duration: Number(duration),
        amount: totalAmount,
        status: "confirmed",
        paymentStatus: "pending",
      });

      // 2. Decrease available slots by 1
      await updateZoneSlots(zone.id, -1);

      setSuccess(true);

      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess(false);
      }, 1200);

    } catch (err: any) {
      console.error(err);
      toast({
        title: "Booking Failed",
        description: err.message || "Try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCongestionColor = (level: string) =>
    level === "high" ? "text-destructive" :
    level === "moderate" ? "text-warning" :
    "text-success";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2 py-6"
            >
              <CheckCircle className="w-12 h-12 text-success" />
              <h3 className="font-semibold text-lg">Booking Confirmed!</h3>
              <p className="text-sm text-muted-foreground">
                Pay at parking counter when you arrive.
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
                  <Car className="w-5 h-5 text-primary" /> Book Parking
                </DialogTitle>
                <DialogDescription>
                  Reserve a slot for {zone.name}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Parking Zone Info */}
                <div className="p-3 rounded-lg border bg-secondary/30">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{zone.name}</span>
                    <PSIIndicator value={zone.psi} size="sm" />
                  </div>

                  <div className="text-sm flex items-center gap-2 mt-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" /> {zone.wardName}
                  </div>

                  <div className="text-sm mt-2 flex justify-between">
                    <span>Available Slots:</span>
                    <span className="font-semibold">
                      {zone.availableSlots}/{zone.totalSlots}
                    </span>
                  </div>

                  <div className="text-sm mt-1 flex justify-between">
                    <span>Price/hr:</span>
                    <span className="font-semibold text-primary">₹{zone.pricePerHour}</span>
                  </div>
                </div>

                {/* Route Info */}
                {routeInfo && (
                  <div className="p-3 border rounded-lg bg-card">
                    <div className="flex items-center gap-2 font-medium text-sm mb-2">
                      <Navigation className="w-4 h-4 text-primary" /> Route Info
                    </div>
                    <div className="grid grid-cols-3 text-center">
                      <div>
                        <p className="text-xs">Distance</p>
                        <p className="font-semibold">{routeInfo.distance.toFixed(1)} km</p>
                      </div>
                      <div>
                        <p className="text-xs">ETA</p>
                        <p className="font-semibold">{routeInfo.eta} min</p>
                      </div>
                      <div>
                        <p className="text-xs">Traffic</p>
                        <p className={`font-semibold capitalize ${getCongestionColor(routeInfo.congestion)}`}>
                          {routeInfo.congestion}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Duration */}
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6].map((d) => (
                        <SelectItem key={d} value={`${d}`}>{d} Hour</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Total */}
                <div className="p-3 border rounded-lg bg-primary/10 flex justify-between items-center">
                  <span className="font-medium">Amount</span>
                  <span className="text-xl font-bold flex items-center gap-1 text-primary">
                    <IndianRupee className="w-5 h-5" /> {totalAmount}
                  </span>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button
                  onClick={handleConfirm}
                  disabled={loading || zone.availableSlots === 0}
                >
                  {zone.availableSlots === 0 ? "No Slots" : loading ? "Booking..." : "Confirm"}
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
