import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { fetchParkingZones, updateZoneSlots } from "@/services/zones";
import { fetchBookings, markBookingPaid } from "@/services/bookingService";

import {
  IndianRupee,
  Car,
  Ticket,
  Bell,
  Gauge,
  MapPin,
  CheckCircle,
} from "lucide-react";

const AdminDashboard = () => {
  const [zones, setZones] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const z = await fetchParkingZones();
    const b = await fetchBookings();
    setZones(z);
    setBookings(b);
    setLoading(false);
  };

  const handleMarkPaid = async (bookingId: string, zoneId: string) => {
    await markBookingPaid(bookingId);
    await updateZoneSlots(zoneId, -1);
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <DashboardLayout title="Admin Dashboard">Loading...</DashboardLayout>;

  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <DashboardLayout title="Admin Dashboard">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="zones">Zones</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex gap-2 items-center">
                  <IndianRupee className="w-4 h-4" /> Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                ₹{totalRevenue}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex gap-2 items-center">
                  <Car className="w-4 h-4" /> Total Slots
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                {zones.reduce((a, b) => a + b.totalSlots, 0)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex gap-2 items-center">
                  <Ticket className="w-4 h-4" /> Total Bookings
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                {bookings.length}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ZONES TAB */}
        <TabsContent value="zones">
          <Card>
            <CardHeader>
              <CardTitle>Parking Zones</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left p-2">Zone</th>
                    <th className="text-left p-2">Ward</th>
                    <th className="text-left p-2">Slots</th>
                    <th className="text-left p-2">Price/hr</th>
                  </tr>
                </thead>
                <tbody>
                  {zones.map((z) => (
                    <tr key={z.id}>
                      <td className="p-2">{z.name}</td>
                      <td className="p-2">{z.ward}</td>
                      <td className="p-2">
                        {z.availableSlots}/{z.totalSlots}
                      </td>
                      <td className="p-2">₹{z.pricePerHour}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BOOKINGS TAB */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="p-2 text-left">User</th>
                    <th className="p-2 text-left">Zone</th>
                    <th className="p-2 text-left">Amount</th>
                    <th className="p-2 text-left">Payment</th>
                    <th className="p-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td className="p-2">{b.userEmail}</td>
                      <td className="p-2">{b.zoneName}</td>
                      <td className="p-2">₹{b.amount}</td>
                      <td className="p-2 capitalize">{b.paymentStatus}</td>
                      <td className="p-2">
                        {b.paymentStatus === "pending" ? (
                          <button
                            className="text-green-600 flex gap-1 items-center"
                            onClick={() => handleMarkPaid(b.id, b.zoneId)}
                          >
                            <CheckCircle className="w-4 h-4" /> Mark Paid
                          </button>
                        ) : (
                          "Paid"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ALERTS TAB */}
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>No Alerts Yet</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              System running smoothly.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AdminDashboard;
