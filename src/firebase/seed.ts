import { db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";

async function seed() {
  const parkingZones = [
    {
      id: "sadar",
      name: "Sadar Main Parking",
      ward: "Sadar Bazar",
      lat: 17.6738,
      lng: 75.9069,
      totalSlots: 40,
      availableSlots: 8,
      pricePerHour: 30,
      psi: 82,
    },
    {
      id: "market",
      name: "Market Complex Parking",
      ward: "Sadar Bazar",
      lat: 17.6751,
      lng: 75.9082,
      totalSlots: 30,
      availableSlots: 12,
      pricePerHour: 25,
      psi: 65,
    },
    {
      id: "chowk",
      name: "Chowk Parking",
      ward: "Murarji Peth",
      lat: 17.6713,
      lng: 75.9112,
      totalSlots: 25,
      availableSlots: 5,
      pricePerHour: 35,
      psi: 78,
    }
  ];

  const trafficZones = [
    {
      id: "railway",
      name: "Railway Station",
      lat: 17.6753,
      lng: 75.9032,
      congestionLevel: "high",
      avgSpeed: 12
    },
    {
      id: "hotgi",
      name: "Hotgi Road",
      lat: 17.6805,
      lng: 75.9141,
      congestionLevel: "low",
      avgSpeed: 45
    },
    {
      id: "akkalkot",
      name: "Akkalkot Road",
      lat: 17.6718,
      lng: 75.8983,
      congestionLevel: "low",
      avgSpeed: 40
    }
  ];

  for (let zone of parkingZones) {
    await setDoc(doc(db, "parking_zones", zone.id), zone);
  }

  for (let zone of trafficZones) {
    await setDoc(doc(db, "traffic_zones", zone.id), zone);
  }

  console.log("Firestore seed complete 🚀");
}

seed();
