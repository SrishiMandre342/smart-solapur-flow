import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import CityMap from '@/components/CityMap';
import StatCard from '@/components/StatCard';
import PSIIndicator from '@/components/PSIIndicator';
import TrafficBadge from '@/components/TrafficBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  parkingZones, 
  trafficZones, 
  getTotalStats,
  ParkingZone,
  SOLAPUR_CENTER
} from '@/data/mockData';
import { 
  MapPin, 
  Car, 
  Navigation, 
  Clock, 
  IndianRupee,
  X,
  CheckCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CitizenDashboard: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedZone, setSelectedZone] = useState<ParkingZone | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { toast } = useToast();

  const stats = getTotalStats();

  const detectLocation = () => {
    setIsLocating(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // For demo, we'll use Solapur center with slight offset
          // In production, use actual coordinates
          setUserLocation({
            lat: SOLAPUR_CENTER.lat + (Math.random() - 0.5) * 0.01,
            lng: SOLAPUR_CENTER.lng + (Math.random() - 0.5) * 0.01,
          });
          setIsLocating(false);
          toast({
            title: "Location detected",
            description: "Map centered on your current location",
          });
        },
        (error) => {
          // Fallback to Solapur center
          setUserLocation({
            lat: SOLAPUR_CENTER.lat,
            lng: SOLAPUR_CENTER.lng,
          });
          setIsLocating(false);
          toast({
            title: "Using default location",
            description: "Showing Solapur city center",
          });
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setUserLocation({
        lat: SOLAPUR_CENTER.lat,
        lng: SOLAPUR_CENTER.lng,
      });
      setIsLocating(false);
    }
  };

  const handleSelectParkingZone = (zone: ParkingZone) => {
    setSelectedZone(zone);
    setShowBookingModal(true);
  };

  const handleBookParking = () => {
    toast({
      title: "Booking Confirmed!",
      description: `Your parking at ${selectedZone?.name} has been booked.`,
    });
    setShowBookingModal(false);
    setSelectedZone(null);
  };

  // Find nearby zones (within 2km for demo)
  const nearbyParkingZones = parkingZones.slice(0, 5);

  return (
    <DashboardLayout title="Citizen Dashboard">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Available Slots"
          value={stats.availableSlots}
          subtitle={`of ${stats.totalSlots} total`}
          icon={Car}
          variant="success"
        />
        <StatCard
          title="Parking Zones"
          value={stats.totalZones}
          subtitle="Across city"
          icon={MapPin}
          variant="primary"
        />
        <StatCard
          title="Avg. Occupancy"
          value={`${stats.occupancy}%`}
          subtitle="City-wide"
          icon={Clock}
          variant={stats.occupancy > 70 ? 'warning' : 'default'}
        />
        <StatCard
          title="Avg. PSI"
          value={`${stats.avgPsi}%`}
          subtitle="Parking Stress"
          icon={AlertTriangle}
          variant={stats.avgPsi > 60 ? 'warning' : 'default'}
        />
      </div>

      {/* Location Detection */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Navigation className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Detect Your Location</h3>
                <p className="text-sm text-muted-foreground">
                  {userLocation 
                    ? 'Location detected - viewing nearby parking zones'
                    : 'Allow location access to find parking near you'}
                </p>
              </div>
            </div>
            <Button 
              onClick={detectLocation} 
              disabled={isLocating}
              variant={userLocation ? 'outline' : 'hero'}
            >
              {isLocating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Detecting...
                </>
              ) : userLocation ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Update Location
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 mr-2" />
                  Detect Location
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Map and Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <CityMap
            parkingZones={parkingZones}
            trafficZones={trafficZones}
            userLocation={userLocation}
            onSelectParkingZone={handleSelectParkingZone}
          />
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-success" />
              <span className="text-muted-foreground">Low Traffic/PSI</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-warning" />
              <span className="text-muted-foreground">Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-destructive" />
              <span className="text-muted-foreground">High Congestion</span>
            </div>
          </div>
        </div>

        {/* Nearby Parking Zones */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Car className="w-5 h-5 text-primary" />
                Nearby Parking Zones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {nearbyParkingZones.map((zone) => (
                <motion.div
                  key={zone.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer"
                  onClick={() => handleSelectParkingZone(zone)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-foreground text-sm">{zone.name}</h4>
                      <p className="text-xs text-muted-foreground">{zone.wardName}</p>
                    </div>
                    <PSIIndicator value={zone.psi} size="sm" showLabel={false} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">{zone.availableSlots}</span>/{zone.totalSlots} slots
                    </span>
                    <span className="font-semibold text-primary">₹{zone.pricePerHour}/hr</span>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Traffic Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Traffic Hotspots
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trafficZones
                .filter((z) => z.congestionLevel === 'high')
                .slice(0, 3)
                .map((zone) => (
                  <div
                    key={zone.id}
                    className="p-3 rounded-lg border border-destructive/20 bg-destructive/5"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-foreground text-sm">{zone.name}</h4>
                      <TrafficBadge level={zone.congestionLevel} size="sm" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Avg. Speed: {zone.avgSpeed} km/h • {zone.vehicleCount} vehicles
                    </p>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && selectedZone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-foreground">Book Parking</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowBookingModal(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold text-foreground mb-1">{selectedZone.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedZone.wardName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Available Slots</p>
                    <p className="text-lg font-semibold text-foreground">
                      {selectedZone.availableSlots}/{selectedZone.totalSlots}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Parking Stress</p>
                    <PSIIndicator value={selectedZone.psi} />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-5 h-5 text-primary" />
                      <span className="text-muted-foreground">Price</span>
                    </div>
                    <span className="text-2xl font-bold text-primary">
                      ₹{selectedZone.pricePerHour}/hr
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowBookingModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="hero"
                    className="flex-1"
                    onClick={handleBookParking}
                  >
                    Confirm Booking
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default CitizenDashboard;
