import React from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import PSIIndicator from '@/components/PSIIndicator';
import TrafficBadge from '@/components/TrafficBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  wards, 
  parkingZones, 
  trafficZones, 
  getTotalStats 
} from '@/data/mockData';
import { 
  MapPin, 
  Car, 
  TrendingUp, 
  IndianRupee,
  AlertTriangle,
  BarChart3,
  Users,
  Gauge
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const stats = getTotalStats();

  // Calculate additional stats
  const highCongestionWards = wards.filter(w => w.congestionLevel === 'high').length;
  const lowAvailabilityZones = parkingZones.filter(z => z.psi > 70).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <DashboardLayout title="Admin Dashboard">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Key Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            subtitle="Today"
            icon={IndianRupee}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Total Slots"
            value={stats.totalSlots}
            subtitle={`${stats.availableSlots} available`}
            icon={Car}
            variant="default"
          />
          <StatCard
            title="Occupancy Rate"
            value={`${stats.occupancy}%`}
            subtitle="City-wide average"
            icon={BarChart3}
            variant={stats.occupancy > 80 ? 'warning' : 'success'}
          />
          <StatCard
            title="High Congestion"
            value={highCongestionWards}
            subtitle={`of ${stats.totalWards} wards`}
            icon={AlertTriangle}
            variant="destructive"
          />
        </motion.div>

        {/* Ward Overview Cards */}
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
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
                  {/* Traffic Info */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Avg. Speed</span>
                    <span className="font-semibold text-foreground">{ward.avgSpeed} km/h</span>
                  </div>

                  {/* Parking Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Parking Availability</span>
                      <span className="font-semibold text-foreground">
                        {ward.availableSlots}/{ward.totalParkingSlots}
                      </span>
                    </div>
                    <Progress 
                      value={((ward.totalParkingSlots - ward.availableSlots) / ward.totalParkingSlots) * 100} 
                      className="h-2"
                    />
                  </div>

                  {/* PSI and Revenue */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">PSI:</span>
                      <PSIIndicator value={ward.avgPsi} size="sm" showLabel={false} />
                    </div>
                    <div className="text-sm font-semibold text-primary">
                      ₹{ward.dailyRevenue.toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Parking Zones Table */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5 text-primary" />
                Parking Zones Occupancy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Zone Name</TableHead>
                      <TableHead>Ward</TableHead>
                      <TableHead className="text-center">Total Slots</TableHead>
                      <TableHead className="text-center">Available</TableHead>
                      <TableHead className="text-center">Occupancy</TableHead>
                      <TableHead className="text-center">PSI</TableHead>
                      <TableHead className="text-right">Price/hr</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parkingZones.slice(0, 10).map((zone) => {
                      const occupancy = Math.round(((zone.totalSlots - zone.availableSlots) / zone.totalSlots) * 100);
                      return (
                        <TableRow key={zone.id}>
                          <TableCell className="font-medium">{zone.name}</TableCell>
                          <TableCell className="text-muted-foreground">{zone.wardName}</TableCell>
                          <TableCell className="text-center">{zone.totalSlots}</TableCell>
                          <TableCell className="text-center">{zone.availableSlots}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Progress value={occupancy} className="w-16 h-2" />
                              <span className="text-xs text-muted-foreground">{occupancy}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <PSIIndicator value={zone.psi} size="sm" showLabel={false} />
                          </TableCell>
                          <TableCell className="text-right font-semibold">₹{zone.pricePerHour}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Traffic Congestion Summary */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Traffic Congestion Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* High Congestion */}
                <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-foreground">High Congestion</h4>
                    <TrafficBadge level="high" size="sm" />
                  </div>
                  <div className="space-y-2">
                    {trafficZones
                      .filter(z => z.congestionLevel === 'high')
                      .slice(0, 3)
                      .map(zone => (
                        <div key={zone.id} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{zone.name}</span>
                          <span className="text-foreground">{zone.avgSpeed} km/h</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Moderate Congestion */}
                <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-foreground">Moderate</h4>
                    <TrafficBadge level="moderate" size="sm" />
                  </div>
                  <div className="space-y-2">
                    {trafficZones
                      .filter(z => z.congestionLevel === 'moderate')
                      .slice(0, 3)
                      .map(zone => (
                        <div key={zone.id} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{zone.name}</span>
                          <span className="text-foreground">{zone.avgSpeed} km/h</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Low Congestion */}
                <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-foreground">Low Congestion</h4>
                    <TrafficBadge level="low" size="sm" />
                  </div>
                  <div className="space-y-2">
                    {trafficZones
                      .filter(z => z.congestionLevel === 'low')
                      .slice(0, 3)
                      .map(zone => (
                        <div key={zone.id} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{zone.name}</span>
                          <span className="text-foreground">{zone.avgSpeed} km/h</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Revenue Summary */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Revenue Summary by Ward
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wards.map((ward) => {
                  const revenuePercentage = (ward.dailyRevenue / stats.totalRevenue) * 100;
                  return (
                    <div key={ward.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{ward.name}</span>
                        <span className="font-semibold text-primary">
                          ₹{ward.dailyRevenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={revenuePercentage} className="h-2 flex-1" />
                        <span className="text-xs text-muted-foreground w-12">
                          {revenuePercentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-foreground">Total Daily Revenue</span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{stats.totalRevenue.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
