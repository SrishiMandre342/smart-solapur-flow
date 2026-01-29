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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PSIIndicator from "@/components/PSIIndicator";
import { ParkingZone } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { IndianRupee, Car, MapPin, CheckCircle, Clock, CreditCard } from "lucide-react";

interface BookingModalProps {
  zone: ParkingZone | null;
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ zone, isOpen, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [duration, setDuration] = useState("1");
  const [plate, setPlate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const totalAmount = zone ? zone.pricePerHour * parseInt(duration) : 0;

  const handleConfirm = async () => {
    if (!zone || !user || !plate.trim()) return;
    setLoading(true);

    // Simulate booking (mock - no backend call)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);
    setSuccess(true);

    toast({
      title: "Booking Confirmed!",
      description: `Your parking at ${zone.name} has been reserved.`,
    });

    setTimeout(() => {
      setSuccess(false);
      setPlate("");
      setDuration("1");
      onClose();
    }, 1500);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSuccess(false);
      setPlate("");
      setDuration("1");
      onClose();
    }
  };

  if (!zone) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="z-[9999] max-w-md bg-card border-border">
        {!success ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-foreground">
                <Car className="w-5 h-5 text-primary" />
                Book Parking
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Reserve a slot at {zone.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              {/* Zone Info Card */}
              <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{zone.name}</span>
                  <PSIIndicator value={zone.psi} size="sm" />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {zone.wardName}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available:</span>
                    <span className="font-medium text-foreground">
                      {zone.availableSlots}/{zone.totalSlots}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rate:</span>
                    <span className="font-medium text-primary">₹{zone.pricePerHour}/hr</span>
                  </div>
                </div>
              </div>

              {/* Vehicle Number */}
              <div className="space-y-2">
                <Label htmlFor="plate" className="text-foreground">Vehicle Number</Label>
                <Input
                  id="plate"
                  type="text"
                  placeholder="e.g. MH13AB1234"
                  className="bg-background border-input"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                />
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-foreground">Duration (Hours)</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="z-[10000] bg-popover border-border">
                    {[1, 2, 3, 4, 5, 6].map((h) => (
                      <SelectItem key={h} value={h.toString()}>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {h} Hour{h > 1 ? "s" : ""}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Total Amount */}
              <div className="p-4 border border-primary/30 rounded-lg bg-primary/5 flex justify-between items-center">
                <span className="font-semibold text-foreground flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  Total Amount
                </span>
                <span className="flex items-center gap-1 text-xl font-bold text-primary">
                  <IndianRupee className="w-5 h-5" />
                  {totalAmount}
                </span>
              </div>
            </div>

            <DialogFooter className="pt-4 gap-2">
              <Button variant="outline" onClick={onClose} className="border-border">
                Cancel
              </Button>
              <Button
                disabled={loading || !plate.trim()}
                onClick={handleConfirm}
                className="bg-primary text-primary-foreground"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Booking
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <p className="text-xl font-semibold text-foreground">Booking Confirmed!</p>
            <p className="text-sm text-muted-foreground mt-2">
              Visit admin counter to complete payment
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
