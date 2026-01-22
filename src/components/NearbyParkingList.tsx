import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import PSIIndicator from '@/components/PSIIndicator';
import { ParkingZone } from '@/data/mockData';
import { Car, MapPin, IndianRupee, Navigation } from 'lucide-react';

interface NearbyParkingListProps {
  zones: ParkingZone[];
  onSelectZone: (zone: ParkingZone) => void;
  onNavigate?: (zone: ParkingZone) => void;
  selectedZoneId?: string;
}

const NearbyParkingList: React.FC<NearbyParkingListProps> = ({
  zones,
  onSelectZone,
  onNavigate,
  selectedZoneId,
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Car className="w-5 h-5 text-primary" />
          Nearby Parking ({zones.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[450px]">
          <div className="space-y-2 p-3">
            {zones.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select a location to find nearby parking</p>
              </div>
            ) : (
              zones.map((zone, index) => (
                <motion.div
                  key={zone.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedZoneId === zone.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card hover:border-primary/50 hover:bg-secondary/30'
                  }`}
                  onClick={() => onSelectZone(zone)}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm truncate">
                        {zone.name}
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {zone.wardName}
                      </p>
                    </div>
                    <PSIIndicator value={zone.psi} size="sm" showLabel={false} />
                  </div>

                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {zone.availableSlots}
                      </span>{' '}
                      / {zone.totalSlots} slots
                    </span>
                    <span className="font-semibold text-primary flex items-center">
                      <IndianRupee className="w-3 h-3" />
                      {zone.pricePerHour}/hr
                    </span>
                  </div>

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
                    <Button
                      size="sm"
                      className="flex-1 text-xs h-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectZone(zone);
                      }}
                    >
                      <Car className="w-3 h-3 mr-1" />
                      Book
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NearbyParkingList;
