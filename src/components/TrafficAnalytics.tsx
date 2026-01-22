import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TrafficZone } from '@/data/mockData';
import TrafficBadge from '@/components/TrafficBadge';
import { AlertTriangle, Gauge, Car } from 'lucide-react';

interface TrafficAnalyticsProps {
  trafficZones: TrafficZone[];
}

const COLORS = {
  low: 'hsl(142, 71%, 45%)',
  moderate: 'hsl(38, 92%, 50%)',
  high: 'hsl(0, 72%, 51%)',
};

const TrafficAnalytics: React.FC<TrafficAnalyticsProps> = ({ trafficZones }) => {
  // Top 3 worst congestion points
  const worstCongestion = [...trafficZones]
    .sort((a, b) => {
      const order = { high: 3, moderate: 2, low: 1 };
      return order[b.congestionLevel] - order[a.congestionLevel] || a.avgSpeed - b.avgSpeed;
    })
    .slice(0, 3);

  // Average speed across all zones
  const avgSpeed = Math.round(
    trafficZones.reduce((sum, z) => sum + z.avgSpeed, 0) / trafficZones.length
  );

  // Total vehicle count
  const totalVehicles = trafficZones.reduce((sum, z) => sum + z.vehicleCount, 0);

  // Vehicle count by congestion level
  const vehiclesByLevel = {
    high: trafficZones
      .filter((z) => z.congestionLevel === 'high')
      .reduce((sum, z) => sum + z.vehicleCount, 0),
    moderate: trafficZones
      .filter((z) => z.congestionLevel === 'moderate')
      .reduce((sum, z) => sum + z.vehicleCount, 0),
    low: trafficZones
      .filter((z) => z.congestionLevel === 'low')
      .reduce((sum, z) => sum + z.vehicleCount, 0),
  };

  // Speed by zone data for chart
  const speedData = trafficZones.map((zone) => ({
    name: zone.name.length > 12 ? zone.name.substring(0, 12) + '...' : zone.name,
    speed: zone.avgSpeed,
    color: COLORS[zone.congestionLevel],
  }));

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Gauge className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Speed</p>
                <p className="text-2xl font-bold text-foreground">{avgSpeed} km/h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Car className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Vehicles</p>
                <p className="text-2xl font-bold text-foreground">
                  {totalVehicles.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">High Congestion</p>
                <p className="text-2xl font-bold text-foreground">
                  {trafficZones.filter((z) => z.congestionLevel === 'high').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Car className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clear Roads</p>
                <p className="text-2xl font-bold text-foreground">
                  {trafficZones.filter((z) => z.congestionLevel === 'low').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top 3 Worst Congestion */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              Top 3 Congestion Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {worstCongestion.map((zone, index) => (
                <div
                  key={zone.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center text-destructive font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{zone.name}</p>
                      <p className="text-xs text-muted-foreground">{zone.wardName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <TrafficBadge level={zone.congestionLevel} size="sm" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {zone.avgSpeed} km/h • {zone.vehicleCount} vehicles
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Speed Chart */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Gauge className="w-4 h-4 text-primary" />
              Speed by Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={speedData} layout="vertical" margin={{ left: 0, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" domain={[0, 60]} unit=" km/h" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={80}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`${value} km/h`, 'Speed']}
                />
                <Bar dataKey="speed" radius={[0, 4, 4, 0]}>
                  {speedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Distribution */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Car className="w-4 h-4 text-primary" />
            Vehicle Distribution by Traffic Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20 text-center">
              <p className="text-2xl font-bold text-destructive">
                {vehiclesByLevel.high.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">High Traffic Zones</p>
            </div>
            <div className="p-4 rounded-lg bg-warning/5 border border-warning/20 text-center">
              <p className="text-2xl font-bold text-warning">
                {vehiclesByLevel.moderate.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Moderate Zones</p>
            </div>
            <div className="p-4 rounded-lg bg-success/5 border border-success/20 text-center">
              <p className="text-2xl font-bold text-success">
                {vehiclesByLevel.low.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Low Traffic Zones</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrafficAnalytics;
