import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { markBookingPaid } from "@/services/bookingService";
import { toast } from "@/hooks/use-toast";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/firebase";

interface Booking {
  id: string;
  userName: string;
  userEmail: string;
  zoneName: string;
  zoneId: string;
  amount: number;
  status: string;
  paymentStatus: string;
  createdAt: any;
}

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
      setBookings(data);
    });
    return () => unsub();
  }, []);

  const handleMarkPaid = async (b: Booking) => {
    setLoadingId(b.id);

    try {
      await markBookingPaid(b.id, b.zoneId, b.amount);
      toast({
        title: "Payment Recorded",
        description: `₹${b.amount} received for ${b.zoneName}`,
      });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to update payment" });
    }

    setLoadingId(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {bookings.length === 0 && (
          <div className="text-sm text-muted-foreground">No bookings yet</div>
        )}

        {bookings.map((b) => (
          <div
            key={b.id}
            className="grid grid-cols-6 items-center gap-4 border-b py-3"
          >
            <span className="text-sm">{b.id}</span>
            <span className="text-sm">{b.userEmail}</span>
            <span className="text-sm">{b.zoneName}</span>
            <span className="font-medium">₹{b.amount}</span>
            <span className="text-xs">
              {b.paymentStatus === "paid" ? (
                <span className="text-green-600 font-semibold">Paid</span>
              ) : (
                <span className="text-yellow-600 font-semibold">Pending</span>
              )}
            </span>

            {b.paymentStatus === "pending" ? (
              <Button
                size="sm"
                variant="default"
                disabled={loadingId === b.id}
                onClick={() => handleMarkPaid(b)}
              >
                {loadingId === b.id ? "Processing..." : "Mark Paid"}
              </Button>
            ) : (
              <span className="text-green-600 text-sm font-semibold">Completed</span>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AdminBookings;
