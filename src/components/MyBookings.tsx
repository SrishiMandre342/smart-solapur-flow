import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, MapPin, IndianRupee, Calendar } from "lucide-react";

interface Booking {
  id: string;
  zoneName: string;
  zoneId: string;
  amount: number;
  duration: number;
  status: "ongoing" | "completed" | "expired";
  paymentStatus: "pending" | "paid";
  createdAt: Date;
}

// Mock user bookings
const mockUserBookings: Booking[] = [
  {
    id: "BK001",
    zoneName: "Station Road Parking",
    zoneId: "zone1",
    amount: 60,
    duration: 2,
    status: "ongoing",
    paymentStatus: "pending",
    createdAt: new Date(),
  },
  {
    id: "BK002",
    zoneName: "Sadar Bazaar Parking",
    zoneId: "zone2",
    amount: 40,
    duration: 1,
    status: "completed",
    paymentStatus: "paid",
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: "BK003",
    zoneName: "MIDC Zone A",
    zoneId: "zone3",
    amount: 80,
    duration: 2,
    status: "completed",
    paymentStatus: "paid",
    createdAt: new Date(Date.now() - 172800000),
  },
];

const MyBookings: React.FC = () => {
  const { user } = useAuth();
  const [bookings] = useState<Booking[]>(mockUserBookings);

  if (!user?.uid) return null;

  const activeBookings = bookings.filter((b) => b.status === "ongoing");
  const completedBookings = bookings.filter(
    (b) => b.status === "completed" || b.status === "expired"
  );

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <div className="p-4 border border-border rounded-lg bg-card hover:bg-muted/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground">{booking.zoneName}</span>
        </div>
        <Badge
          variant="outline"
          className={
            booking.status === "ongoing"
              ? "border-primary text-primary"
              : booking.status === "completed"
              ? "border-success text-success"
              : "border-destructive text-destructive"
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
            {booking.createdAt.toLocaleDateString()}
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
