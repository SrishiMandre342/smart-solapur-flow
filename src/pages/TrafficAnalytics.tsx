import React from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TrafficBadge from '@/components/TrafficBadge';
import CityMap from '@/components/CityMap';
import { trafficZones, wards, SOLAPUR_CENTER } from '@/data/mockData';
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
  // Congestion distribution data
  const congestionDistribution = [
    { name: 'Low', value: trafficZones.filter(z => z.congestionLevel === 'low').length, color: '#22c55e' },
    { name: 'Moderate', value: trafficZones.filter(z => z.congestionLevel === 'moderate').length, color: '#f59e0b' },
    { name: 'High', value: trafficZones.filter(z => z.congestionLevel === 'high').length, color: '#ef4444' },
  ];

  // Ward-wise congestion data
  const wardCongestion = wards.map(ward => ({
    name: ward.name.split(' ')[0],
    avgSpeed: ward.avgSpeed,
    level: ward.congestionLevel,
    vehicles: Math.floor(Math.random() * 300 + 100),
  }));

  // Peak time data (mock)
  const peakTimeData = [
    { hour: '6AM', traffic: 20 },
    { hour: '8AM', traffic: 85 },
    { hour: '10AM', traffic: 65 },
    { hour: '12PM', traffic: 55 },
    { hour: '2PM', traffic: 45 },
    { hour: '4PM', traffic: 60 },
    { hour: '6PM', traffic: 90 },
    { hour: '8PM', traffic: 75 },
    { hour: '10PM', traffic: 35 },
  ];

  // Top congestion hotspots
  const hotspots = [...trafficZones]
    .filter(z => z.congestionLevel === 'high')
    .sort((a, b) => a.avgSpeed - b.avgSpeed)
    .slice(0, 3);

  // Calculate averages
  const avgSpeed = Math.round(trafficZones.reduce((sum, z) => sum + z.avgSpeed, 0) / trafficZones.length);
  const totalVehicles = trafficZones.reduce((sum, z) => sum + z.vehicleCount, 0);
  const highCongestionCount = trafficZones.filter(z => z.congestionLevel === 'high').length;

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
                  <p className="text-xl font-bold">{avgSpeed} km/h</p>
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
                  <p className="text-xl font-bold">{totalVehicles}</p>
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
                  <p className="text-xl font-bold">{highCongestionCount}</p>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Congestion Distribution</CardTitle>
              </CardHeader>
              <CardContent>
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
                      <p className="font-medium">{ward.avgSpeed} km/h</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Vehicles</p>
                      <p className="font-medium">{Math.floor(Math.random() * 300 + 100)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default TrafficAnalytics;
