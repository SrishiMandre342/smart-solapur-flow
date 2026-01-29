import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ParkingZone } from "@/types";
import PSIIndicator from "@/components/PSIIndicator";
import { MapPin, Navigation, Car, IndianRupee, Gauge } from "lucide-react";

interface Props {
  zones: (ParkingZone & { distance?: number })[];
  onSelectZone: (zone: ParkingZone) => void;
  onNavigate: (zone: ParkingZone) => void;
  selectedZoneId?: string;
}

const NearbyParkingList: React.FC<Props> = ({
  zones,
  onSelectZone,
  onNavigate,
  selectedZoneId,
}) => {
  return (
    <Card className="h-full border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Car className="w-5 h-5 text-primary" />
          Nearby Parking
          <span className="text-sm font-normal text-muted-foreground ml-auto">
            {zones.length} zones
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100%-60px)] max-h-[500px] lg:max-h-[600px]">
          <div className="space-y-3 p-4 pt-0">
            {zones.length === 0 ? (
              <div className="text-center py-8">
                <Car className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No parking zones nearby
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try selecting a different location
                </p>
              </div>
            ) : (
              zones.map((zone, index) => (
                <motion.div
                  key={zone.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedZoneId === zone.id
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border hover:border-primary/50 hover:bg-muted/30"
                    }`}
                    onClick={() => onSelectZone(zone)}
                  >
                    {/* Header: Name + PSI */}
                    <div className="flex items-start justify-between mb-3">
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
                    {zone.distance !== undefined && (
                      <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                        <Gauge className="w-3.5 h-3.5" />
                        {zone.distance.toFixed(1)} km away
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
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
                      <Button
                        size="sm"
                        className="flex-1 text-xs h-8"
                        disabled={zone.availableSlots === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectZone(zone);
                        }}
                      >
                        <Car className="w-3.5 h-3.5 mr-1" />
                        {zone.availableSlots === 0 ? "Full" : "Book"}
                      </Button>
                    </div>
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
