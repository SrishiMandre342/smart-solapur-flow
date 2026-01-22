import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import CityMap from '@/components/CityMap';
import StatCard from '@/components/StatCard';
import PSIIndicator from '@/components/PSIIndicator';
import TrafficBadge from '@/components/TrafficBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  AlertTriangle,
  Loader2,
  CheckCircle
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
        () => {
          setUserLocation({
            lat: SOLAPUR_CENTER.lat,
            lng: SOLAPUR_CENTER.lng,
          });
          setIsLocating(false);
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

  const nearbyParkingZones = parkingZones.slice(0, 5);

  return (
    <DashboardLayout title="Citizen Dashboard">
      
      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Available Slots" value={stats.availableSlots} subtitle={`of ${stats.totalSlots} total`} icon={Car} variant="success" />
        <StatCard title="Parking Zones" value={stats.totalZones} subtitle="Across city" icon={MapPin} variant="primary" />
        <StatCard title="Avg. Occupancy" value={`${stats.occupancy}%`} subtitle="City-wide" icon={Clock} variant={stats.occupancy > 70 ? 'warning' : 'default'} />
        <StatCard title="Avg. PSI" value={`${stats.avgPsi}%`} subtitle="Parking Stress" icon={AlertTriangle} variant={stats.avgPsi > 60 ? 'warning' : 'default'} />
      </div>

      {/* LOCATION */}
      <Card className="mb-6">
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Navigation className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">Detect Location</h3>
              <p className="text-sm text-muted-foreground">
                {userLocation ? 'Showing nearby parking zones' : 'Allow location access to find parking'}
              </p>
            </div>
          </div>
          <Button onClick={detectLocation} disabled={isLocating} variant={userLocation ? 'outline' : 'hero'}>
            {isLocating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <MapPin className="w-4 h-4 mr-2" />}
            {isLocating ? 'Detecting...' : userLocation ? 'Update Location' : 'Detect Location'}
          </Button>
        </CardContent>
      </Card>

      {/* MAP + SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[650px]">
        <div className="lg:col-span-2">
          <div className="w-full h-[600px] rounded-lg overflow-hidden border shadow-sm">
            <CityMap
              parkingZones={parkingZones}
              trafficZones={trafficZones}
              userLocation={userLocation}
              onSelectParkingZone={handleSelectParkingZone}
            />
          </div>

          {/* LEGEND */}
          <div className="mt-3 flex gap-4 text-sm">
            <span className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-success" /> Low</span>
            <span className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-warning" /> Moderate</span>
            <span className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-destructive" /> High</span>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-4">
          {/* Nearby section */}
          {/* ... unchanged ... */}
        </div>
      </div>

      {/* BOOKING MODAL */}
      {/* ... KEEP YOUR ORIGINAL MODAL CODE ... */}
      {showBookingModal && selectedZone && (
        // your modal code stays here unchanged
        <></>
      )}

    </DashboardLayout>
  );
};

export default CitizenDashboard;
