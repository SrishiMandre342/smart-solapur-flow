import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { parkingZones, getTotalStats } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
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

// Mock bookings data for admin
const mockBookings = [
  {
    id: "BK001",
    userEmail: "citizen@demo.com",
    zoneName: "Station Road Parking",
    zoneId: "zone1",
    amount: 60,
    status: "ongoing",
    paymentStatus: "pending",
  },
  {
    id: "BK002",
    userEmail: "user2@demo.com",
    zoneName: "Sadar Bazaar Parking",
    zoneId: "zone2",
    amount: 80,
    status: "completed",
    paymentStatus: "paid",
  },
  {
    id: "BK003",
    userEmail: "user3@demo.com",
    zoneName: "MIDC Zone A",
    zoneId: "zone3",
    amount: 40,
    status: "ongoing",
    paymentStatus: "pending",
  },
];

const AdminDashboard = () => {
  const { toast } = useToast();
  const [zones] = useState(parkingZones);
  const [bookings, setBookings] = useState(mockBookings);

  const stats = getTotalStats();

  const handleMarkPaid = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, paymentStatus: "paid", status: "completed" }
          : b
      )
    );
    toast({
      title: "Payment Confirmed",
      description: `Booking ${bookingId} marked as paid`,
    });
  };

  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + b.amount, 0);

  const pendingPayments = bookings.filter((b) => b.paymentStatus === "pending");

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
                <div className="text-2xl font-bold text-foreground">₹{totalRevenue}</div>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> +12% from yesterday
                </p>
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
                <div className="text-2xl font-bold text-foreground">{stats.totalSlots}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.availableSlots} available
                </p>
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
                <div className="text-2xl font-bold text-foreground">{stats.occupancy}%</div>
                <p className="text-xs text-muted-foreground mt-1">City average</p>
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
                <div className="text-2xl font-bold text-foreground">{bookings.length}</div>
                <p className="text-xs text-warning flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3" /> {pendingPayments.length} pending
                </p>
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
                Parking Zones
              </CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* BOOKINGS TAB */}
        <TabsContent value="bookings">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-primary" />
                Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                              onClick={() => handleMarkPaid(b.id)}
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
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/30 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">High PSI Alert</p>
                  <p className="text-sm text-muted-foreground">
                    Station Road Parking has reached 85% capacity
                  </p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Traffic Congestion</p>
                  <p className="text-sm text-muted-foreground">
                    Heavy congestion detected on Akkalkot Road
                  </p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted border border-border flex items-start gap-3">
                <Bell className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">System Update</p>
                  <p className="text-sm text-muted-foreground">
                    Parking rates updated for all zones
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AdminDashboard;
