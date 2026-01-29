import { db } from "@/firebase/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  increment,
  onSnapshot,
} from "firebase/firestore";

export interface BookingPayload {
  zoneId: string;
  zoneName: string;
  userId: string;
  userEmail: string;
  plateNumber: string;
  duration: number;
  amount: number;
}

export const createBooking = async (payload: BookingPayload) => {
  const ref = collection(db, "bookings");

  const bookingRef = await addDoc(ref, {
    ...payload,
    status: "reserved",
    paymentStatus: "pending",
    createdAt: serverTimestamp(),
    startTime: serverTimestamp(),
  });

  // decrease parking slots
  const zoneRef = doc(db, "parking_zones", payload.zoneId);
  await updateDoc(zoneRef, {
    availableSlots: increment(-1),
  });

  return bookingRef.id;
};

export const markBookingPaid = async (bookingId: string, zoneId: string) => {
  const bookingRef = doc(db, "bookings", bookingId);

  await updateDoc(bookingRef, {
    status: "completed",
    paymentStatus: "paid",
    endTime: serverTimestamp(),
  });

  // increase slot availability again
  const zoneRef = doc(db, "parking_zones", zoneId);
  await updateDoc(zoneRef, {
    availableSlots: increment(1),
  });
};

export const getBookingsLive = (cb: (data: any) => void) => {
  const ref = collection(db, "bookings");
  return onSnapshot(ref, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

// Revenue fetcher
export const getRevenue = async () => {
  const ref = collection(db, "bookings");
  const q = query(ref, where("paymentStatus", "==", "paid"));
  const snap = await getDocs(q);

  let total = 0;
  snap.forEach((doc) => {
    total += doc.data().amount;
  });

  return total;
};
