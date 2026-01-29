import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PSIIndicator from '@/components/PSIIndicator';
import { ParkingZone } from '@/types';
import { MapPin, Car, IndianRupee, Navigation, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ParkingZoneCardProps {
  zone: ParkingZone & { distance?: number };
  onNavigate?: (zone: ParkingZone) => void;
  onBook?: (zone: ParkingZone) => void;
  isSelected?: boolean;
  showDistance?: boolean;
  className?: string;
}

const ParkingZoneCard: React.FC<ParkingZoneCardProps> = ({
  zone,
  onNavigate,
  onBook,
  isSelected = false,
  showDistance = true,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          'transition-all cursor-pointer',
          isSelected
            ? 'border-primary bg-primary/5 shadow-md'
            : 'border-border hover:border-primary/50 hover:bg-muted/30',
          className
        )}
      >
        <CardContent className="p-4">
          {/* Header: Name + PSI */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground text-sm truncate">
                {zone.name}
              </h4>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{zone.wardName}</span>
              </p>
            </div>
            <PSIIndicator value={zone.psi} size="sm" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Slots:</span>
              <span className="font-semibold text-foreground">
                <span className={zone.availableSlots === 0 ? "text-destructive" : "text-success"}>
                  {zone.availableSlots}
                </span>
                /{zone.totalSlots}
              </span>
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              <IndianRupee className="w-3.5 h-3.5 text-primary" />
              <span className="font-semibold text-primary">
                {zone.pricePerHour}/hr
              </span>
            </div>
          </div>

          {/* Distance */}
          {showDistance && zone.distance !== undefined && (
            <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5" />
              {zone.distance.toFixed(1)} km away
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {onNavigate && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs h-8 border-border"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(zone);
                }}
              >
                <Navigation className="w-3.5 h-3.5 mr-1" />
                Navigate
              </Button>
            )}
            {onBook && (
              <Button
                size="sm"
                className="flex-1 text-xs h-8"
                disabled={zone.availableSlots === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  onBook(zone);
                }}
              >
                <Car className="w-3.5 h-3.5 mr-1" />
                {zone.availableSlots === 0 ? 'Full' : 'Book'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ParkingZoneCard;
