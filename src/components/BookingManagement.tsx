import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Clock, User, MapPin, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  listenBookings,
  markPaid,
  markCompleted,
  BookingData
} from "@/services/bookingService";

const BookingManagement: React.FC = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenBookings((data) => {
      setBookings(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleMarkPaid = async (id: string) => {
    try {
      await markPaid(id);
      toast({
        title: "Payment Marked",
        description: `Booking ${id.slice(0, 8)}... marked as paid`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark as paid",
        variant: "destructive",
      });
    }
  };

  const handleMarkCompleted = async (booking: BookingData) => {
    try {
      await markCompleted(booking.id, booking.zoneId);
      toast({
        title: "Booking Completed",
        description: `Booking ${booking.id.slice(0, 8)}... marked as complete`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete booking",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Booking Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Booking Management</CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No bookings yet. Bookings will appear here in real-time.
          </p>
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
