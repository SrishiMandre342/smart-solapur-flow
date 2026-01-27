import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PSIIndicator from '@/components/PSIIndicator';
import { ParkingZone } from '@/types';
import { MapPin, Car, IndianRupee, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ParkingZoneCardProps {
  zone: ParkingZone;
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
            : 'border-border hover:border-primary/50 hover:bg-secondary/30',
          className
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground text-sm truncate">
                {zone.name}
              </h4>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                {zone.wardName}
              </p>
            </div>
            <PSIIndicator value={zone.psi} size="sm" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="flex items-center gap-1">
              <Car className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">Slots:</span>
              <span className="font-semibold text-foreground">
                {zone.availableSlots}/{zone.totalSlots}
              </span>
            </div>
            <div className="flex items-center gap-1 justify-end">
              <IndianRupee className="w-3 h-3 text-primary" />
              <span className="font-semibold text-primary">
                {zone.pricePerHour}/hr
              </span>
            </div>
          </div>

          {showDistance && zone.distance !== undefined && (
            <p className="text-xs text-muted-foreground mb-3">
              📍 {zone.distance.toFixed(1)} km away
            </p>
          )}

          <div className="flex gap-2">
            {onNavigate && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs h-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(zone);
                }}
              >
                <Navigation className="w-3 h-3 mr-1" />
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
                <Car className="w-3 h-3 mr-1" />
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
