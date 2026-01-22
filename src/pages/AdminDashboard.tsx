import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import PSIIndicator from '@/components/PSIIndicator';
import TrafficBadge from '@/components/TrafficBadge';
import ParkingCharts from '@/components/ParkingCharts';
import TrafficAnalytics from '@/components/TrafficAnalytics';
import ZoneManagement from '@/components/ZoneManagement';
import BookingManagement from '@/components/BookingManagement';
import NotificationsPanel from '@/components/NotificationsPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  wards,
  parkingZones as initialParkingZones,
  trafficZones,
  getTotalStats,
  ParkingZone,
} from '@/data/mockData';
import { mockBookings, mockNotifications, Notification } from '@/data/bookings';
import {
  MapPin,
  Car,
  TrendingUp,
  IndianRupee,
  AlertTriangle,
  BarChart3,
  Gauge,
  Settings,
  Ticket,
  Bell,
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [parkingZones, setParkingZones] = useState(initialParkingZones);
  const [notifications, setNotifications] = useState(mockNotifications);
  
  const stats = getTotalStats();
  const highCongestionWards = wards.filter((w) => w.congestionLevel === 'high').length;

  const handleAddZone = (zone: ParkingZone & { status: string }) => {
    setParkingZones((prev) => [...prev, zone]);
  };

  const handleEditZone = (updatedZone: ParkingZone & { status: string }) => {
    setParkingZones((prev) =>
      prev.map((z) => (z.id === updatedZone.id ? updatedZone : z))
    );
  };

  const handleDeleteZone = (zoneId: string) => {
    setParkingZones((prev) => prev.filter((z) => z.id !== zoneId));
  };

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <DashboardLayout title="Admin Dashboard">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        {/* Key Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} subtitle="Today" icon={IndianRupee} variant="primary" trend={{ value: 12, isPositive: true }} />
          <StatCard title="Total Slots" value={stats.totalSlots} subtitle={`${stats.availableSlots} available`} icon={Car} variant="default" />
          <StatCard title="Occupancy Rate" value={`${stats.occupancy}%`} subtitle="City-wide average" icon={BarChart3} variant={stats.occupancy > 80 ? 'warning' : 'success'} />
          <StatCard title="High Congestion" value={highCongestionWards} subtitle={`of ${stats.totalWards} wards`} icon={AlertTriangle} variant="destructive" />
        </motion.div>

        {/* Tabs for different sections */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
              <TabsTrigger value="overview" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="traffic" className="gap-2">
                <Gauge className="w-4 h-4" />
                <span className="hidden sm:inline">Traffic</span>
              </TabsTrigger>
              <TabsTrigger value="zones" className="gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Zones</span>
              </TabsTrigger>
              <TabsTrigger value="bookings" className="gap-2">
                <Ticket className="w-4 h-4" />
                <span className="hidden sm:inline">Bookings</span>
              </TabsTrigger>
              <TabsTrigger value="alerts" className="gap-2 relative">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Alerts</span>
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              <ParkingCharts zones={parkingZones} totalSlots={stats.totalSlots} availableSlots={stats.availableSlots} />
              
              {/* Ward Overview */}
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Ward-wise Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wards.map((ward) => (
                  <Card key={ward.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{ward.name}</CardTitle>
                        <TrafficBadge level={ward.congestionLevel} size="sm" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Avg. Speed</span>
                        <span className="font-semibold text-foreground">{ward.avgSpeed} km/h</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Parking</span>
                          <span className="font-semibold text-foreground">{ward.availableSlots}/{ward.totalParkingSlots}</span>
                        </div>
                        <Progress value={((ward.totalParkingSlots - ward.availableSlots) / ward.totalParkingSlots) * 100} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Gauge className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">PSI:</span>
                          <PSIIndicator value={ward.avgPsi} size="sm" showLabel={false} />
                        </div>
                        <div className="text-sm font-semibold text-primary">₹{ward.dailyRevenue.toLocaleString()}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Revenue Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Revenue Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {wards.map((ward) => {
                      const pct = (ward.dailyRevenue / stats.totalRevenue) * 100;
                      return (
                        <div key={ward.id} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-foreground">{ward.name}</span>
                            <span className="font-semibold text-primary">₹{ward.dailyRevenue.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={pct} className="h-2 flex-1" />
                            <span className="text-xs text-muted-foreground w-12">{pct.toFixed(1)}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-lg font-semibold text-foreground">Total Daily Revenue</span>
                    <span className="text-2xl font-bold text-primary">₹{stats.totalRevenue.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Traffic Tab */}
            <TabsContent value="traffic" className="mt-6">
              <TrafficAnalytics trafficZones={trafficZones} />
            </TabsContent>

            {/* Zones Tab */}
            <TabsContent value="zones" className="mt-6">
              <ZoneManagement zones={parkingZones} onAddZone={handleAddZone} onEditZone={handleEditZone} onDeleteZone={handleDeleteZone} />
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="mt-6">
              <BookingManagement bookings={mockBookings} />
            </TabsContent>

            {/* Alerts Tab */}
            <TabsContent value="alerts" className="mt-6">
              <NotificationsPanel notifications={notifications} onMarkRead={handleMarkRead} onDismiss={handleDismiss} onMarkAllRead={handleMarkAllRead} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
