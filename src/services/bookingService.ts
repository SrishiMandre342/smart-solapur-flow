import { db } from "@/firebase/firebase";
import {
  doc,
  addDoc,
  getDocs,
  updateDoc,
  increment,
  collection,
  serverTimestamp,
  query,
  orderBy
} from "firebase/firestore";

/*
|--------------------------------------------------------------------------
| Citizen — Book Slot
|--------------------------------------------------------------------------
*/
export const bookSlot = async (
  userId: string,
  zoneId: string,
  amount: number
) => {
  const zoneRef = doc(db, "parking_zones", zoneId);
  const bookingCollection = collection(db, "bookings");
  const cityRef = doc(db, "stats", "city");

  await updateDoc(zoneRef, {
    availableSlots: increment(-1)
  });

  const bookingRef = await addDoc(bookingCollection, {
    userId,
    zoneId,
    amount,
    status: "ongoing",
    paymentStatus: "pending",
    createdAt: serverTimestamp()
  });

  await updateDoc(cityRef, {
    pendingAmount: increment(amount)
  });

  return bookingRef.id;
};

/*
|--------------------------------------------------------------------------
| Admin — Fetch Bookings (One-Time Load)
|--------------------------------------------------------------------------
*/
export const fetchBookings = async () => {
  const bookingsRef = collection(db, "bookings");
  const q = query(bookingsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  const list: any[] = [];
  snapshot.forEach((d) => {
    list.push({ id: d.id, ...d.data() });
  });

  return list;
};

/*
|--------------------------------------------------------------------------
| Admin — Mark Booking Paid
|--------------------------------------------------------------------------
*/
export const markBookingPaid = async (
  bookingId: string,
  zoneId: string,
  amount: number
) => {
  const bookingRef = doc(db, "bookings", bookingId);
  const zoneRef = doc(db, "parking_zones", zoneId);
  const cityRef = doc(db, "stats", "city");

  await updateDoc(bookingRef, {
    paymentStatus: "paid",
    status: "completed",
    paidAt: serverTimestamp()
  });

  await updateDoc(zoneRef, {
    revenueToday: increment(amount)
  });

  await updateDoc(cityRef, {
    revenueToday: increment(amount),
    pendingAmount: increment(-amount)
  });

  return true;
};
