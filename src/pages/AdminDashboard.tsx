import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { listenParkingZones, computeStats } from "@/services/zoneService";
import { listenBookings, markBookingPaidAndComplete, BookingData } from "@/services/bookingService";
import { ParkingZone } from "@/types";
import {
  IndianRupee,
  Car,
  Ticket,
  Bell,
  Gauge,
  MapPin,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [zones, setZones] = useState<ParkingZone[]>([]);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loadingZones, setLoadingZones] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    const unsubZones = listenParkingZones((data) => {
      setZones(data);
      setLoadingZones(false);
    });

    const unsubBookings = listenBookings((data) => {
      setBookings(data);
      setLoadingBookings(false);
    });

    return () => {
      unsubZones();
      unsubBookings();
    };
  }, []);

  const stats = computeStats(zones);

  const handleMarkPaid = async (booking: BookingData) => {
    try {
      await markBookingPaidAndComplete(booking.id, booking.zoneId, booking.amount);
      toast({
        title: "Payment Confirmed",
        description: `Booking marked as paid and completed`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking",
        variant: "destructive",
      });
    }
  };

  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  const pendingPayments = bookings.filter((b) => b.paymentStatus === "pending");

  const loading = loadingZones || loadingBookings;

  return (
    <DashboardLayout title="Admin Dashboard">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 bg-muted/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="zones">Zones</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="flex gap-2 items-center text-sm font-medium text-muted-foreground">
                  <IndianRupee className="w-4 h-4 text-primary" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold text-foreground">₹{totalRevenue}</div>
                    <p className="text-xs text-success flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" /> From paid bookings
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="flex gap-2 items-center text-sm font-medium text-muted-foreground">
                  <Car className="w-4 h-4 text-primary" />
                  Total Slots
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold text-foreground">{stats.totalSlots}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.availableSlots} available
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="flex gap-2 items-center text-sm font-medium text-muted-foreground">
                  <Gauge className="w-4 h-4 text-warning" />
                  Occupancy Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold text-foreground">{stats.occupancy}%</div>
                    <p className="text-xs text-muted-foreground mt-1">City average</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="flex gap-2 items-center text-sm font-medium text-muted-foreground">
                  <Ticket className="w-4 h-4 text-primary" />
                  Total Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold text-foreground">{bookings.length}</div>
                    <p className="text-xs text-warning flex items-center gap-1 mt-1">
                      <AlertTriangle className="w-3 h-3" /> {pendingPayments.length} pending
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ZONES TAB */}
        <TabsContent value="zones">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Parking Zones ({zones.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingZones ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : zones.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No parking zones found. Add zones in Firestore collection "parking_zones".
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 font-medium text-muted-foreground">Zone</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Ward</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Slots</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">PSI</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Price/hr</th>
                      </tr>
                    </thead>
                    <tbody>
                      {zones.map((z) => (
                        <tr key={z.id} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="p-3 font-medium text-foreground">{z.name}</td>
                          <td className="p-3 text-muted-foreground">{z.wardName}</td>
                          <td className="p-3 text-foreground">
                            <span className="font-semibold text-success">{z.availableSlots}</span>
                            /{z.totalSlots}
                          </td>
                          <td className="p-3">
                            <Badge
                              variant="outline"
                              className={
                                z.psi < 40
                                  ? "border-success text-success"
                                  : z.psi < 70
                                  ? "border-warning text-warning"
                                  : "border-destructive text-destructive"
                              }
                            >
                              {z.psi}
                            </Badge>
                          </td>
                          <td className="p-3 text-primary font-medium">₹{z.pricePerHour}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* BOOKINGS TAB */}
        <TabsContent value="bookings">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-primary" />
                Bookings ({bookings.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingBookings ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No bookings yet. Bookings will appear here in real-time.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="p-3 text-left font-medium text-muted-foreground">User</th>
                        <th className="p-3 text-left font-medium text-muted-foreground">Zone</th>
                        <th className="p-3 text-left font-medium text-muted-foreground">Amount</th>
                        <th className="p-3 text-left font-medium text-muted-foreground">Payment</th>
                        <th className="p-3 text-left font-medium text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b.id} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="p-3 text-foreground">{b.userEmail}</td>
                          <td className="p-3 text-foreground">{b.zoneName}</td>
                          <td className="p-3 font-medium text-foreground">₹{b.amount}</td>
                          <td className="p-3">
                            <Badge
                              variant={b.paymentStatus === "pending" ? "outline" : "default"}
                              className={
                                b.paymentStatus === "pending"
                                  ? "border-warning text-warning"
                                  : "bg-success text-success-foreground"
                              }
                            >
                              {b.paymentStatus}
                            </Badge>
                          </td>
                          <td className="p-3">
                            {b.paymentStatus === "pending" ? (
                              <Button
                                size="sm"
                                onClick={() => handleMarkPaid(b)}
                                className="bg-success hover:bg-success/90"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Mark Paid
                              </Button>
                            ) : (
                              <span className="text-success flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" /> Paid
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ALERTS TAB */}
        <TabsContent value="alerts">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {zones.filter((z) => z.psi >= 70).length > 0 ? (
                zones
                  .filter((z) => z.psi >= 70)
                  .map((zone) => (
                    <div
                      key={zone.id}
                      className="p-3 rounded-lg bg-warning/10 border border-warning/30 flex items-start gap-3"
                    >
                      <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">High PSI Alert</p>
                        <p className="text-sm text-muted-foreground">
                          {zone.name} has reached {zone.psi}% capacity
                        </p>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No critical alerts at this time
                </p>
              )}
              
              {pendingPayments.length > 3 && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Pending Payments</p>
                    <p className="text-sm text-muted-foreground">
                      {pendingPayments.length} bookings with pending payment
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AdminDashboard;
