import { db } from "@/firebase/firebase";
import {
  collection,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { TrafficZone } from "@/types";

/*
|--------------------------------------------------------------------------
| Real-time listener for traffic zones
|--------------------------------------------------------------------------
*/
export function listenTrafficZones(
  cb: (zones: TrafficZone[]) => void
): Unsubscribe {
  const ref = collection(db, "traffic_zones");
  return onSnapshot(ref, (snap) => {
    const zones = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as TrafficZone[];
    cb(zones);
  });
}

/*
|--------------------------------------------------------------------------
| Compute traffic stats
|--------------------------------------------------------------------------
*/
export function computeTrafficStats(zones: TrafficZone[]) {
  if (zones.length === 0) {
    return {
      avgSpeed: 0,
      totalVehicles: 0,
      highCongestionCount: 0,
      lowCongestionCount: 0,
    };
  }

  const avgSpeed = Math.round(
    zones.reduce((sum, z) => sum + (z.avgSpeed || 0), 0) / zones.length
  );
  const totalVehicles = zones.reduce((sum, z) => sum + (z.vehicleCount || 0), 0);
  const highCongestionCount = zones.filter((z) => z.congestionLevel === "high").length;
  const lowCongestionCount = zones.filter((z) => z.congestionLevel === "low").length;

  return {
    avgSpeed,
    totalVehicles,
    highCongestionCount,
    lowCongestionCount,
  };
}
