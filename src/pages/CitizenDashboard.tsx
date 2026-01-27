import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import CityMap from "@/components/CityMap";
import StatCard from "@/components/StatCard";
import LocationSelector from "@/components/LocationSelector";
import BookingModal from "@/components/BookingModal";
import MyBookings from "@/components/MyBookings";
import NearbyParkingList from "@/components/NearbyParkingList";
import RouteDisplay from "@/components/RouteDisplay";

import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

import { db } from "@/firebase/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy
} from "firebase/firestore";

import { MapPin, Car, Clock, AlertTriangle } from "lucide-react";

type ParkingZone = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  totalSlots: number;
  availableSlots: number;
  pricePerHour: number;
};

type Booking = {
  id: string;
  zoneId: string;
  zoneName: string;
  amount: number;
  startTime: any;
  endTime: any;
  status: string;
};

const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [parkingZones, setParkingZones] = useState<ParkingZone[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedZone, setSelectedZone] = useState<ParkingZone | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [routeInfo, setRouteInfo] = useState<any>(null);

  const RADIUS_KM = 2.5;

  // --- LIVE PARKING DATA ---
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "parking_zones"), (snap) => {
      setParkingZones(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ParkingZone)));
    });
    return unsub;
  }, []);

  // --- USER BOOKINGS LIVE ---
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(
      query(collection(db, "bookings"), where("userId", "==", user.uid), orderBy("startTime", "desc")),
      (snap) => {
        setBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Booking)));
      }
    );
    return unsub;
  }, [user]);

  // --- DETECT USER LOCATION (SIMULATED) ---
  const detectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setUserLocation({
            lat: 17.6599 + (Math.random() - 0.5) * 0.01,
            lng: 75.9064 + (Math.random() - 0.5) * 0.01,
          });
          toast({ title: "Location detected", description: "Nearby parking shown" });
        },
        () => {
          setUserLocation({ lat: 17.6599, lng: 75.9064 });
        }
      );
    } else {
      setUserLocation({ lat: 17.6599, lng: 75.9064 });
    }
  };

  // --- DISTANCE UTILITY ---
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // --- NEARBY PARKING FILTER ---
  const nearbyParking = useMemo(() => {
    if (!userLocation) return [];
    return parkingZones
      .map((z) => ({
        ...z,
        distance: getDistance(userLocation.lat, userLocation.lng, z.lat, z.lng)
      }))
      .filter((z) => z.distance <= RADIUS_KM)
      .sort((a, b) => a.distance - b.distance);
  }, [userLocation, parkingZones]);

  // --- SIMPLE ROUTE + ETA ---
  const handleNavigate = (zone: ParkingZone) => {
    if (!userLocation) return;

    const distance = getDistance(
      userLocation.lat,
      userLocation.lng,
      zone.lat,
      zone.lng
    );

    const speed = 30; // km/h
    const eta = Math.ceil((distance / speed) * 60);

    setRouteInfo({
      destinationName: zone.name,
      distance,
      eta,
      path: [
        [userLocation.lat, userLocation.lng],
        [zone.lat, zone.lng]
      ]
    });
  };

  const handleSelectParking = (zone: ParkingZone) => {
    setSelectedZone(zone);
    setShowBookingModal(true);
  };

  const stats = {
    totalSlots: parkingZones.reduce((a, z) => a + z.totalSlots, 0),
    availableSlots: parkingZones.reduce((a, z) => a + z.availableSlots, 0),
    totalZones: parkingZones.length,
    avgPsi: 0
  };

  return (
    <DashboardLayout title="Citizen Dashboard">
      <motion.div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Available Slots" value={stats.availableSlots} icon={Car} variant="success" />
          <StatCard title="Parking Zones" value={stats.totalZones} icon={MapPin} variant="primary" />
          <StatCard title="Avg. Occupancy" value={`${Math.round((1 - stats.availableSlots / stats.totalSlots) * 100)}%`} icon={Clock} />
          <StatCard title="PSI" value="Live disabled" icon={AlertTriangle} />
        </div>

        <LocationSelector onDetectLocation={detectLocation} userLocation={userLocation} />

        {routeInfo && <RouteDisplay routeInfo={routeInfo} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CityMap
              parkingZones={nearbyParking}
              userLocation={userLocation}
              routeInfo={routeInfo}
              onSelectParkingZone={handleSelectParking}
              onNavigate={handleNavigate}
              showRadius
              radiusKm={RADIUS_KM}
            />
          </div>

          <div>
            <NearbyParkingList
              zones={nearbyParking}
              onSelectZone={handleSelectParking}
              onNavigate={handleNavigate}
            />
          </div>
        </div>

        <MyBookings bookings={bookings} />

        <BookingModal
          zone={selectedZone}
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          userEmail={user?.email}
          userName={user?.name}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default CitizenDashboard;
