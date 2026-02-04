import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { ALL_PARKING_ZONES } from "@/data/parkingZones.ts";

export const seedParkingZonesOnce = async () => {
  const flag = localStorage.getItem("parking_zones_seeded");
  if (flag) return;

  for (const zone of ALL_PARKING_ZONES) {
    await setDoc(doc(collection(db, "parking_zones")), {
      ...zone,
      createdAt: new Date(),
    });
  }

  localStorage.setItem("parking_zones_seeded", "true");
};
