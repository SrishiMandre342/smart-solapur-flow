import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import CityMap from '@/components/CityMap';
import StatCard from '@/components/StatCard';
import LocationSelector from '@/components/LocationSelector';
import BookingModal from '@/components/BookingModal';
import MyBookings from '@/components/MyBookings';
import NearbyParkingList from '@/components/NearbyParkingList';
import RouteDisplay from '@/components/RouteDisplay';
import { 
  parkingZones, 
  trafficZones, 
  getTotalStats,
  ParkingZone,
  SOLAPUR_CENTER
} from '@/data/mockData';
import { SolapurLocation, getDistance } from '@/data/locations';
import { Booking } from '@/data/bookings';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MapPin, 
  Car, 
  Clock, 
  AlertTriangle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<SolapurLocation | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedZone, setSelectedZone] = useState<ParkingZone | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [navigatingToZone, setNavigatingToZone] = useState<ParkingZone | null>(null);
  const { toast } = useToast();

  const stats = getTotalStats();
  const RADIUS_KM = 2.5;

  // Get effective location for map centering
  const effectiveLocation = useMemo(() => {
    if (selectedLocation) {
      return { lat: selectedLocation.lat, lng: selectedLocation.lng };
    }
    return userLocation;
  }, [selectedLocation, userLocation]);

  // Filter parking zones within radius
  const nearbyParkingZones = useMemo(() => {
    if (!effectiveLocation) return parkingZones.slice(0, 6);
    
    return parkingZones
      .map((zone) => ({
        ...zone,
        distance: getDistance(effectiveLocation.lat, effectiveLocation.lng, zone.lat, zone.lng),
      }))
      .filter((zone) => zone.distance <= RADIUS_KM)
      .sort((a, b) => a.distance - b.distance);
  }, [effectiveLocation]);

  // Filter traffic zones within radius
  const nearbyTrafficZones = useMemo(() => {
    if (!effectiveLocation) return trafficZones;
    
    return trafficZones.filter((zone) => {
      const distance = getDistance(effectiveLocation.lat, effectiveLocation.lng, zone.lat, zone.lng);
      return distance <= RADIUS_KM * 1.5;
    });
  }, [effectiveLocation]);

  // Calculate route info
  const routeInfo = useMemo(() => {
    if (!effectiveLocation || !navigatingToZone) return null;

    const distance = getDistance(
      effectiveLocation.lat,
      effectiveLocation.lng,
      navigatingToZone.lat,
      navigatingToZone.lng
    );

    // Determine congestion based on traffic zones along path
    const nearbyTraffic = trafficZones.filter((tz) => {
      const d = getDistance(effectiveLocation.lat, effectiveLocation.lng, tz.lat, tz.lng);
      return d <= distance;
    });
    
    const hasHighCongestion = nearbyTraffic.some((t) => t.congestionLevel === 'high');
    const hasModerate = nearbyTraffic.some((t) => t.congestionLevel === 'moderate');
    const congestion: 'low' | 'moderate' | 'high' = hasHighCongestion
      ? 'high'
      : hasModerate
      ? 'moderate'
      : 'low';

    const speed = congestion === 'high' ? 15 : congestion === 'moderate' ? 25 : 40;
    const eta = Math.ceil((distance / speed) * 60);

    return {
      distance,
      eta,
      congestion,
      destinationName: navigatingToZone.name,
      path: [
        [effectiveLocation.lat, effectiveLocation.lng] as [number, number],
        [navigatingToZone.lat, navigatingToZone.lng] as [number, number],
      ],
    };
  }, [effectiveLocation, navigatingToZone]);

  const detectLocation = () => {
    setIsLocating(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Simulate location within Solapur
          setUserLocation({
            lat: SOLAPUR_CENTER.lat + (Math.random() - 0.5) * 0.01,
            lng: SOLAPUR_CENTER.lng + (Math.random() - 0.5) * 0.01,
          });
          setSelectedLocation(null);
          setIsLocating(false);
          toast({
            title: "Location detected",
            description: "Showing parking zones within 2.5 km radius",
          });
        },
        () => {
          setUserLocation({ lat: SOLAPUR_CENTER.lat, lng: SOLAPUR_CENTER.lng });
          setSelectedLocation(null);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setUserLocation({ lat: SOLAPUR_CENTER.lat, lng: SOLAPUR_CENTER.lng });
      setSelectedLocation(null);
      setIsLocating(false);
    }
  };

  const handleSelectLocation = (location: SolapurLocation | null) => {
    setSelectedLocation(location);
    setNavigatingToZone(null);
    if (location) {
      setUserLocation({ lat: location.lat, lng: location.lng });
    }
  };

  const handleSelectParkingZone = (zone: ParkingZone) => {
    setSelectedZone(zone);
    setShowBookingModal(true);
  };

  const handleNavigate = (zone: ParkingZone) => {
    setNavigatingToZone(zone);
    toast({
      title: "Route calculated",
      description: `Showing route to ${zone.name}`,
    });
  };

  const handleConfirmBooking = (booking: Booking) => {
    setMyBookings((prev) => [booking, ...prev]);
    setShowBookingModal(false);
    setSelectedZone(null);
    setNavigatingToZone(null);
    toast({
      title: "Booking Confirmed!",
      description: `Your parking at ${booking.zoneName} has been booked.`,
    });
  };

  return (
    <DashboardLayout title="Citizen Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Available Slots" value={stats.availableSlots} subtitle={`of ${stats.totalSlots} total`} icon={Car} variant="success" />
        <StatCard title="Parking Zones" value={stats.totalZones} subtitle="Across city" icon={MapPin} variant="primary" />
        <StatCard title="Avg. Occupancy" value={`${stats.occupancy}%`} subtitle="City-wide" icon={Clock} variant={stats.occupancy > 70 ? 'warning' : 'default'} />
        <StatCard title="Avg. PSI" value={`${stats.avgPsi}%`} subtitle="Parking Stress" icon={AlertTriangle} variant={stats.avgPsi > 60 ? 'warning' : 'default'} />
      </div>

      {/* Location Selector */}
      <div className="mb-6">
        <LocationSelector
          selectedLocation={selectedLocation}
          userLocation={userLocation}
          isLocating={isLocating}
          onSelectLocation={handleSelectLocation}
          onDetectLocation={detectLocation}
        />
      </div>

      {/* Route Display */}
      {routeInfo && (
        <div className="mb-6">
          <RouteDisplay routeInfo={routeInfo} />
        </div>
      )}

      {/* Map + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="w-full h-[550px] rounded-lg overflow-hidden border shadow-sm">
            <CityMap
              parkingZones={nearbyParkingZones}
              trafficZones={nearbyTrafficZones}
              userLocation={effectiveLocation}
              onSelectParkingZone={handleSelectParkingZone}
              selectedZoneId={navigatingToZone?.id}
              routeInfo={routeInfo ? { path: routeInfo.path, congestion: routeInfo.congestion } : null}
              radiusKm={RADIUS_KM}
              showRadius={!!effectiveLocation}
            />
          </div>
          {/* Legend */}
          <div className="mt-3 flex gap-4 text-sm">
            <span className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-success" /> Low PSI/Traffic</span>
            <span className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-warning" /> Moderate</span>
            <span className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-destructive" /> High</span>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <NearbyParkingList
            zones={nearbyParkingZones}
            onSelectZone={handleSelectParkingZone}
            onNavigate={handleNavigate}
            selectedZoneId={navigatingToZone?.id}
          />
        </div>
      </div>

      {/* My Bookings */}
      <MyBookings bookings={myBookings} />

      {/* Booking Modal */}
      <BookingModal
        zone={selectedZone}
        isOpen={showBookingModal}
        onClose={() => { setShowBookingModal(false); setSelectedZone(null); }}
        onConfirm={handleConfirmBooking}
        routeInfo={routeInfo && selectedZone?.id === navigatingToZone?.id ? routeInfo : null}
        userName={user?.name}
        userEmail={user?.email}
      />
    </DashboardLayout>
  );
};

export default CitizenDashboard;
