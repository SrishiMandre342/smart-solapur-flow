import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, User, MapPin, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  id: string;
  userId: string;
  userEmail?: string;
  zoneName: string;
  zoneId: string;
  amount: number;
  status: "ongoing" | "completed";
  paymentStatus: "pending" | "paid";
  createdAt?: Date;
}

// Mock bookings data
const mockBookings: Booking[] = [
  {
    id: "BK001",
    userId: "user1",
    userEmail: "citizen@demo.com",
    zoneName: "Station Road Parking",
    zoneId: "zone1",
    amount: 60,
    status: "ongoing",
    paymentStatus: "pending",
    createdAt: new Date(),
  },
  {
    id: "BK002",
    userId: "user2",
    userEmail: "user2@demo.com",
    zoneName: "Sadar Bazaar Parking",
    zoneId: "zone2",
    amount: 80,
    status: "completed",
    paymentStatus: "paid",
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: "BK003",
    userId: "user3",
    userEmail: "user3@demo.com",
    zoneName: "MIDC Zone A",
    zoneId: "zone3",
    amount: 40,
    status: "ongoing",
    paymentStatus: "pending",
    createdAt: new Date(Date.now() - 1800000),
  },
];

const BookingManagement: React.FC = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);

  const handleMarkPaid = (id: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, paymentStatus: "paid" as const } : b
      )
    );
    toast({
      title: "Payment Marked",
      description: `Booking ${id} marked as paid`,
    });
  };

  const handleMarkCompleted = (booking: Booking) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === booking.id ? { ...b, status: "completed" as const } : b
      )
    );
    toast({
      title: "Booking Completed",
      description: `Booking ${booking.id} marked as complete`,
    });
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Booking Management</CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <p className="text-sm text-muted-foreground">No bookings found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-3 text-left font-medium text-muted-foreground">Zone</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">User</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Amount</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Payment</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-medium text-foreground">{b.zoneName}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{b.userEmail || b.userId}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 font-semibold text-foreground">
                        <IndianRupee className="w-4 h-4" />
                        {b.amount}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={b.paymentStatus === "pending" ? "outline" : "default"}
                        className={
                          b.paymentStatus === "pending"
                            ? "border-warning text-warning"
                            : "bg-success text-success-foreground"
                        }
                      >
                        {b.paymentStatus === "pending" ? (
                          <><Clock className="w-3 h-3 mr-1" /> Pending</>
                        ) : (
                          <><CheckCircle className="w-3 h-3 mr-1" /> Paid</>
                        )}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge
                        variant="outline"
                        className={
                          b.status === "completed"
                            ? "border-success text-success"
                            : "border-primary text-primary"
                        }
                      >
                        {b.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {b.paymentStatus === "pending" && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleMarkPaid(b.id)}
                          >
                            Mark Paid
                          </Button>
                        )}

                        {b.paymentStatus === "paid" && b.status !== "completed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkCompleted(b)}
                          >
                            Complete
                          </Button>
                        )}

                        {b.status === "completed" && (
                          <span className="flex items-center gap-1 text-success font-medium text-sm">
                            <CheckCircle className="w-4 h-4" /> Done
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingManagement;
