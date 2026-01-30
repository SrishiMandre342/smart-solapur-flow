import { db } from "@/firebase/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  increment,
  onSnapshot,
  Unsubscribe
} from "firebase/firestore";
import { ParkingZone } from "@/types";

/*
|--------------------------------------------------------------------------
| One-time fetch of parking zones
|--------------------------------------------------------------------------
*/
export async function fetchParkingZones(): Promise<ParkingZone[]> {
  const ref = collection(db, "parking_zones");
  const snap = await getDocs(ref);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as ParkingZone[];
}

/*
|--------------------------------------------------------------------------
| Real-time listener for parking zones
|--------------------------------------------------------------------------
*/
export function listenParkingZones(
  cb: (zones: ParkingZone[]) => void
): Unsubscribe {
  const ref = collection(db, "parking_zones");
  return onSnapshot(ref, (snap) => {
    const zones = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as ParkingZone[];
    cb(zones);
  });
}

/*
|--------------------------------------------------------------------------
| Update slots by +1 or -1
|--------------------------------------------------------------------------
*/
export async function updateZoneSlots(
  zoneId: string,
  change: number
): Promise<void> {
  const ref = doc(db, "parking_zones", zoneId);
  await updateDoc(ref, {
    availableSlots: increment(change),
  });
}

/*
|--------------------------------------------------------------------------
| Helper: compute stats from zones
|--------------------------------------------------------------------------
*/
export function computeStats(zones: ParkingZone[]) {
  if (zones.length === 0) {
    return {
      totalSlots: 0,
      availableSlots: 0,
      occupancy: 0,
      avgPsi: 0,
      totalZones: 0,
    };
  }

  const totalSlots = zones.reduce((acc, z) => acc + (z.totalSlots || 0), 0);
  const availableSlots = zones.reduce((acc, z) => acc + (z.availableSlots || 0), 0);
  const avgPsi = Math.round(
    zones.reduce((acc, z) => acc + (z.psi || 0), 0) / zones.length
  );

  return {
    totalSlots,
    availableSlots,
    occupancy: totalSlots > 0 ? Math.round(((totalSlots - availableSlots) / totalSlots) * 100) : 0,
    avgPsi,
    totalZones: zones.length,
  };
}
