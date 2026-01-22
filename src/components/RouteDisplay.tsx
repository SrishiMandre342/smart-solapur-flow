import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Navigation, Clock, Gauge, AlertTriangle } from 'lucide-react';
import TrafficBadge from '@/components/TrafficBadge';

interface RouteInfo {
  distance: number;
  eta: number;
  congestion: 'low' | 'moderate' | 'high';
  destinationName: string;
}

interface RouteDisplayProps {
  routeInfo: RouteInfo | null;
}

const RouteDisplay: React.FC<RouteDisplayProps> = ({ routeInfo }) => {
  if (!routeInfo) return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Navigation className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            Route to {routeInfo.destinationName}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Gauge className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-lg font-bold text-foreground">
              {routeInfo.distance.toFixed(1)} km
            </p>
            <p className="text-xs text-muted-foreground">Distance</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-lg font-bold text-foreground">
              {routeInfo.eta} min
            </p>
            <p className="text-xs text-muted-foreground">ETA</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <AlertTriangle className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="mb-1">
              <TrafficBadge level={routeInfo.congestion} size="sm" />
            </div>
            <p className="text-xs text-muted-foreground">Traffic</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteDisplay;
