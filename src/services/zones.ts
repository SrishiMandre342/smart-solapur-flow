// src/services/zones.ts

import { db } from "@/firebase/firebase";
import { collection, getDocs, doc, updateDoc, increment } from "firebase/firestore";

export async function fetchParkingZones() {
  const ref = collection(db, "parkingZones");
  const snap = await getDocs(ref);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as any[];
}

// update slots by +1 or -1
export async function updateZoneSlots(zoneId: string, change: number) {
  const ref = doc(db, "parkingZones", zoneId);
  await updateDoc(ref, {
    availableSlots: increment(change),
  });
}
