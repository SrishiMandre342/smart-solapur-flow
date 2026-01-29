import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation, Clock, Gauge, AlertTriangle, CheckCircle } from 'lucide-react';

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

  const getCongestionConfig = (level: 'low' | 'moderate' | 'high') => {
    switch (level) {
      case 'low':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/30',
          label: 'Light Traffic',
          icon: CheckCircle,
        };
      case 'moderate':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/30',
          label: 'Moderate Traffic',
          icon: AlertTriangle,
        };
      case 'high':
        return {
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/30',
          label: 'Heavy Traffic',
          icon: AlertTriangle,
        };
    }
  };

  const config = getCongestionConfig(routeInfo.congestion);
  const CongestionIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`border ${config.borderColor} ${config.bgColor}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-full bg-primary/10">
              <Navigation className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <span className="text-sm font-semibold text-foreground">
                Navigating to
              </span>
              <p className="text-xs text-muted-foreground truncate">
                {routeInfo.destinationName}
              </p>
            </div>
            <Badge
              variant="outline"
              className={`${config.color} ${config.borderColor} flex items-center gap-1`}
            >
              <CongestionIcon className="w-3 h-3" />
              {config.label}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Distance */}
            <div className="text-center p-3 rounded-lg bg-card border border-border">
              <div className="flex items-center justify-center mb-2">
                <Gauge className="w-5 h-5 text-primary" />
              </div>
              <p className="text-lg font-bold text-foreground">
                {routeInfo.distance.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">km</p>
            </div>

            {/* ETA */}
            <div className="text-center p-3 rounded-lg bg-card border border-border">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <p className="text-lg font-bold text-foreground">
                {routeInfo.eta}
              </p>
              <p className="text-xs text-muted-foreground">min</p>
            </div>

            {/* Traffic Status */}
            <div className={`text-center p-3 rounded-lg border ${config.borderColor} ${config.bgColor}`}>
              <div className="flex items-center justify-center mb-2">
                <CongestionIcon className={`w-5 h-5 ${config.color}`} />
              </div>
              <p className={`text-lg font-bold ${config.color} capitalize`}>
                {routeInfo.congestion}
              </p>
              <p className="text-xs text-muted-foreground">traffic</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RouteDisplay;
