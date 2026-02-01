import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import { ParkingZone } from '@/types';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Car } from 'lucide-react';

interface ParkingChartsProps {
  zones: ParkingZone[];
  totalSlots: number;
  availableSlots: number;
}

const COLORS = {
  occupied: 'hsl(0, 72%, 51%)',
  available: 'hsl(142, 71%, 45%)',
  low: 'hsl(142, 71%, 45%)',
  moderate: 'hsl(38, 92%, 50%)',
  high: 'hsl(0, 72%, 51%)',
};

const ParkingCharts: React.FC<ParkingChartsProps> = ({
  zones,
  totalSlots,
  availableSlots,
}) => {
  // Handle empty state
  if (zones.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="w-4 h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[200px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Car className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No data available</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Occupancy pie chart data
  const occupancyData = [
    { name: 'Occupied', value: totalSlots - availableSlots, color: COLORS.occupied },
    { name: 'Available', value: availableSlots, color: COLORS.available },
  ];

  // PSI bar chart data (top 10 zones)
  const psiData = zones
    .slice(0, 10)
    .map((zone) => ({
      name: zone.name.length > 15 ? zone.name.substring(0, 15) + '...' : zone.name,
      psi: zone.psi,
      fill:
        zone.psi < 40
          ? COLORS.low
          : zone.psi < 70
          ? COLORS.moderate
          : COLORS.high,
    }));

  // PSI over time data (computed from current zones average)
  const avgPsi = zones.length > 0 
    ? Math.round(zones.reduce((sum, z) => sum + z.psi, 0) / zones.length)
    : 0;
  
  const psiOverTimeData = [
    { time: '6 AM', avgPsi: Math.max(10, avgPsi - 35), peakPsi: Math.max(20, avgPsi - 25) },
    { time: '8 AM', avgPsi: Math.max(20, avgPsi - 15), peakPsi: Math.max(40, avgPsi + 5) },
    { time: '10 AM', avgPsi: Math.max(30, avgPsi - 5), peakPsi: Math.max(50, avgPsi + 15) },
    { time: '12 PM', avgPsi: avgPsi, peakPsi: Math.min(95, avgPsi + 20) },
    { time: '2 PM', avgPsi: Math.max(35, avgPsi - 5), peakPsi: Math.min(90, avgPsi + 15) },
    { time: '4 PM', avgPsi: Math.min(85, avgPsi + 5), peakPsi: Math.min(95, avgPsi + 25) },
    { time: '6 PM', avgPsi: Math.min(90, avgPsi + 10), peakPsi: Math.min(100, avgPsi + 30) },
    { time: '8 PM', avgPsi: Math.max(30, avgPsi - 10), peakPsi: Math.min(85, avgPsi + 10) },
    { time: '10 PM', avgPsi: Math.max(15, avgPsi - 30), peakPsi: Math.max(25, avgPsi - 15) },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Occupancy Pie Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <PieChartIcon className="w-4 h-4 text-primary" />
            Occupancy Ratio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={occupancyData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {occupancyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2 text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS.occupied }}
              />
              <span className="text-muted-foreground">
                Occupied: {totalSlots - availableSlots}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS.available }}
              />
              <span className="text-muted-foreground">
                Available: {availableSlots}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PSI Bar Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="w-4 h-4 text-primary" />
            PSI by Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={psiData} layout="vertical" margin={{ left: 0, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis type="number" domain={[0, 100]} />
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
              />
              <Bar dataKey="psi" radius={[0, 4, 4, 0]}>
                {psiData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* PSI Over Time */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="w-4 h-4 text-primary" />
            PSI Trend (Today)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={psiOverTimeData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="avgPsi"
                name="Avg PSI"
                stroke="hsl(38, 92%, 50%)"
                fill="hsl(38, 92%, 50%)"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="peakPsi"
                name="Peak PSI"
                stroke="hsl(0, 72%, 51%)"
                fill="hsl(0, 72%, 51%)"
                fillOpacity={0.2}
              />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParkingCharts;
