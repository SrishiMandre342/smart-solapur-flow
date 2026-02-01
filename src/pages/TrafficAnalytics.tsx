import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import TrafficBadge from '@/components/TrafficBadge';
import CityMap from '@/components/CityMap';
import { TrafficZone, Ward } from '@/types';
import { listenTrafficZones, computeTrafficStats } from '@/services/trafficService';
import { listenWards, staticWards } from '@/services/wardService';
import { SOLAPUR_CENTER } from '@/lib/constants';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  Activity,
  AlertTriangle,
  Car,
  Clock,
  Gauge,
  TrendingUp,
} from 'lucide-react';

const TrafficAnalytics: React.FC = () => {
  const [trafficZones, setTrafficZones] = useState<TrafficZone[]>([]);
  const [wards, setWards] = useState<Ward[]>(staticWards);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubTraffic = listenTrafficZones((data) => {
      setTrafficZones(data);
      setLoading(false);
    });

    const unsubWards = listenWards((data) => {
      if (data.length > 0) {
        setWards(data);
      }
    });

    return () => {
      unsubTraffic();
      unsubWards();
    };
  }, []);

  const stats = computeTrafficStats(trafficZones);

  // Congestion distribution data
  const congestionDistribution = [
    { name: 'Low', value: trafficZones.filter(z => z.congestionLevel === 'low').length, color: '#22c55e' },
    { name: 'Moderate', value: trafficZones.filter(z => z.congestionLevel === 'moderate').length, color: '#f59e0b' },
    { name: 'High', value: trafficZones.filter(z => z.congestionLevel === 'high').length, color: '#ef4444' },
  ];

  // Ward-wise congestion data
  const wardCongestion = wards.map(ward => ({
    name: ward.name.split(' ')[0],
    avgSpeed: ward.avgSpeed || 30,
    level: ward.congestionLevel,
    vehicles: trafficZones
      .filter(z => z.wardId === ward.id)
      .reduce((sum, z) => sum + z.vehicleCount, 0) || Math.floor(Math.random() * 200 + 50),
  }));

  // Peak time data based on current traffic
  const baseTraffic = trafficZones.length > 0 ? trafficZones.length * 5 : 50;
  const peakTimeData = [
    { hour: '6AM', traffic: Math.round(baseTraffic * 0.4) },
    { hour: '8AM', traffic: Math.round(baseTraffic * 1.7) },
    { hour: '10AM', traffic: Math.round(baseTraffic * 1.3) },
    { hour: '12PM', traffic: Math.round(baseTraffic * 1.1) },
    { hour: '2PM', traffic: Math.round(baseTraffic * 0.9) },
    { hour: '4PM', traffic: Math.round(baseTraffic * 1.2) },
    { hour: '6PM', traffic: Math.round(baseTraffic * 1.8) },
    { hour: '8PM', traffic: Math.round(baseTraffic * 1.5) },
    { hour: '10PM', traffic: Math.round(baseTraffic * 0.7) },
  ];

  // Top congestion hotspots
  const hotspots = [...trafficZones]
    .filter(z => z.congestionLevel === 'high')
    .sort((a, b) => a.avgSpeed - b.avgSpeed)
    .slice(0, 3);

  if (loading) {
    return (
      <DashboardLayout title="Traffic Analytics">
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="h-[500px]">
                <CardContent className="p-6">
                  <Skeleton className="h-full w-full" />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <Skeleton className="h-48 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Traffic Analytics">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Traffic Zones</p>
                  <p className="text-xl font-bold">{trafficZones.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <Gauge className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Speed</p>
                  <p className="text-xl font-bold">{stats.avgSpeed} km/h</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Car className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Vehicles</p>
                  <p className="text-xl font-bold">{stats.totalVehicles}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">High Congestion</p>
                  <p className="text-xl font-bold">{stats.highCongestionCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map and Hotspots */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-[500px]">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Traffic Congestion Map
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-60px)]">
                <CityMap
                  parkingZones={[]}
                  trafficZones={trafficZones}
                  userLocation={null}
                  onSelectParkingZone={() => {}}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  Top Congestion Hotspots
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hotspots.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <Car className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No high congestion zones</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {hotspots.map((zone, index) => (
                      <div
                        key={zone.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-destructive/10 text-destructive text-sm font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium text-sm">{zone.name}</p>
                            <p className="text-xs text-muted-foreground">{zone.wardName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{zone.avgSpeed} km/h</p>
                          <TrafficBadge level={zone.congestionLevel} size="sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Congestion Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {trafficZones.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">No traffic data available</p>
                  </div>
                ) : (
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={congestionDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {congestionDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Peak Traffic Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={peakTimeData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="hour" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="traffic"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary) / 0.2)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-primary" />
                Ward-wise Average Speed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={wardCongestion}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar
                      dataKey="avgSpeed"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ward Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5 text-primary" />
              Ward-wise Traffic Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {wards.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No ward data available</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wards.map(ward => (
                  <div
                    key={ward.id}
                    className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{ward.name}</h4>
                      <TrafficBadge level={ward.congestionLevel} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Avg Speed</p>
                        <p className="font-medium">{ward.avgSpeed || 30} km/h</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Vehicles</p>
                        <p className="font-medium">
                          {trafficZones
                            .filter(z => z.wardId === ward.id)
                            .reduce((sum, z) => sum + z.vehicleCount, 0) || '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default TrafficAnalytics;
