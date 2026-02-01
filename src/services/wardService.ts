import { db } from "@/firebase/firebase";
import {
  collection,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { Ward } from "@/types";

/*
|--------------------------------------------------------------------------
| Real-time listener for wards
|--------------------------------------------------------------------------
*/
export function listenWards(cb: (wards: Ward[]) => void): Unsubscribe {
  const ref = collection(db, "wards");
  return onSnapshot(ref, (snap) => {
    const wards = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Ward[];
    cb(wards);
  });
}

/*
|--------------------------------------------------------------------------
| Static ward list (for dropdowns when Firestore wards empty)
|--------------------------------------------------------------------------
*/
export const staticWards: Ward[] = [
  {
    id: "ward-1",
    name: "Sadar Bazaar",
    totalParkingZones: 0,
    totalParkingSlots: 0,
    availableSlots: 0,
    avgPsi: 0,
    congestionLevel: "moderate",
    avgSpeed: 0,
    dailyRevenue: 0,
  },
  {
    id: "ward-2",
    name: "Railway Station",
    totalParkingZones: 0,
    totalParkingSlots: 0,
    availableSlots: 0,
    avgPsi: 0,
    congestionLevel: "moderate",
    avgSpeed: 0,
    dailyRevenue: 0,
  },
  {
    id: "ward-3",
    name: "Siddheshwar Peth",
    totalParkingZones: 0,
    totalParkingSlots: 0,
    availableSlots: 0,
    avgPsi: 0,
    congestionLevel: "low",
    avgSpeed: 0,
    dailyRevenue: 0,
  },
  {
    id: "ward-4",
    name: "Akkalkot Road",
    totalParkingZones: 0,
    totalParkingSlots: 0,
    availableSlots: 0,
    avgPsi: 0,
    congestionLevel: "low",
    avgSpeed: 0,
    dailyRevenue: 0,
  },
  {
    id: "ward-5",
    name: "Murarji Peth",
    totalParkingZones: 0,
    totalParkingSlots: 0,
    availableSlots: 0,
    avgPsi: 0,
    congestionLevel: "moderate",
    avgSpeed: 0,
    dailyRevenue: 0,
  },
  {
    id: "ward-6",
    name: "Hotgi Road",
    totalParkingZones: 0,
    totalParkingSlots: 0,
    availableSlots: 0,
    avgPsi: 0,
    congestionLevel: "low",
    avgSpeed: 0,
    dailyRevenue: 0,
  },
];
