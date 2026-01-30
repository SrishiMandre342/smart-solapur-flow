import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, CheckCircle, MapPin, IndianRupee, Calendar } from "lucide-react";
import { listenUserBookings, BookingData } from "@/services/bookingService";

const MyBookings: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const unsubscribe = listenUserBookings(user.uid, (data) => {
      setBookings(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  if (!user?.uid) return null;

  const activeBookings = bookings.filter((b) => b.status === "active");
  const completedBookings = bookings.filter((b) => b.status === "completed");

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString();
    }
    if (timestamp instanceof Date) {
      return timestamp.toLocaleDateString();
    }
    return "N/A";
  };

  const BookingCard = ({ booking }: { booking: BookingData }) => (
    <div className="p-4 border border-border rounded-lg bg-card hover:bg-muted/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground">{booking.zoneName}</span>
        </div>
        <Badge
          variant="outline"
          className={
            booking.status === "active"
              ? "border-primary text-primary"
              : "border-success text-success"
          }
        >
          {booking.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <IndianRupee className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground font-medium">₹{booking.amount}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground">{booking.duration} hr</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground text-xs">
            {formatDate(booking.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {booking.paymentStatus === "paid" ? (
            <Badge className="bg-success text-success-foreground text-xs">
              <CheckCircle className="w-3 h-3 mr-1" /> Paid
            </Badge>
          ) : (
            <Badge variant="outline" className="border-warning text-warning text-xs">
              <Clock className="w-3 h-3 mr-1" /> Pending
            </Badge>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-primary" />
            My Bookings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="w-5 h-5 text-primary" />
          My Bookings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Active ({activeBookings.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Completed ({completedBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-3">
            {activeBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No active bookings
              </p>
            ) : (
              activeBookings.map((b) => <BookingCard key={b.id} booking={b} />)
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3">
            {completedBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No completed bookings
              </p>
            ) : (
              completedBookings.map((b) => <BookingCard key={b.id} booking={b} />)
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MyBookings;
