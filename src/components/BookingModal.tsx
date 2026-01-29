// src/components/BookingModal.tsx

import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import PSIIndicator from "@/components/PSIIndicator";
import { ParkingZone } from "@/data/mockData";
import { bookSlot } from "@/services/bookingService";
import { useAuth } from "@/contexts/AuthContext";
import { IndianRupee, Car, MapPin, CheckCircle, Clock } from "lucide-react";

interface BookingModalProps {
  zone: ParkingZone | null;
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ zone, isOpen, onClose }) => {
  const { user } = useAuth();
  const [duration, setDuration] = useState(1);
  const [plate, setPlate] = useState("");
  const [loading, setLoading] = useState(false);
  const totalAmount = zone ? zone.pricePerHour * duration : 0;
  const [success, setSuccess] = useState(false);

  const handleConfirm = async () => {
    if (!zone || !user) return;
    setLoading(true);

    await bookSlot(user.uid, zone.id, totalAmount, plate);

    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  if (!zone || !isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {!success ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Car className="w-5 h-5 text-primary" />
                Book Parking
              </DialogTitle>
              <DialogDescription>
                Reserve a slot at {zone.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              <div className="p-4 rounded-lg border bg-muted/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{zone.name}</span>
                  <PSIIndicator value={zone.psi} size="sm" />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" /> {zone.wardName}
                </div>
                <div className="text-sm flex justify-between">
                  <span>Available Slots:</span>
                  <span>{zone.availableSlots}/{zone.totalSlots}</span>
                </div>
                <div className="text-sm flex justify-between">
                  <span>Price Per Hour:</span>
                  <span>₹{zone.pricePerHour}</span>
                </div>
              </div>

              {/* Plate Input */}
              <div className="space-y-2">
                <Label>Vehicle Number</Label>
                <input
                  type="text"
                  placeholder="e.g. MH13AB1234"
                  className="border rounded px-3 py-2 w-full"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                />
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label>Duration (Hours)</Label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="border rounded px-3 py-2 w-full"
                >
                  {[1, 2, 3, 4, 5, 6].map((h) => (
                    <option key={h} value={h}>{h} Hour</option>
                  ))}
                </select>
              </div>

              <div className="p-3 border rounded bg-primary/10 flex justify-between font-semibold">
                <span>Total Amount</span>
                <span className="flex items-center gap-1">
                  <IndianRupee className="w-4 h-4" /> {totalAmount}
                </span>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button disabled={loading || !plate} onClick={handleConfirm}>
                {loading ? "Processing..." : "Confirm Booking"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="w-12 h-12 text-green-600" />
            <p className="mt-2 text-lg font-semibold">Booking Confirmed!</p>
            <p className="text-sm text-muted-foreground">Visit admin to pay</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
