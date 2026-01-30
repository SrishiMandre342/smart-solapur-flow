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
  orderBy,
  where,
  onSnapshot,
  Unsubscribe
} from "firebase/firestore";

export interface BookingData {
  id: string;
  userId: string;
  userEmail: string;
  zoneId: string;
  zoneName: string;
  plateNumber: string;
  duration: number;
  amount: number;
  status: "active" | "completed";
  paymentStatus: "pending" | "paid";
  createdAt: any;
  paidAt?: any;
}

/*
|--------------------------------------------------------------------------
| Citizen — Book Slot (writes to Firestore)
|--------------------------------------------------------------------------
*/
export const bookSlot = async (
  userId: string,
  userEmail: string,
  zoneId: string,
  zoneName: string,
  plateNumber: string,
  duration: number,
  amount: number
): Promise<string> => {
  const zoneRef = doc(db, "parking_zones", zoneId);
  const bookingCollection = collection(db, "bookings");

  // Decrease available slots
  await updateDoc(zoneRef, {
    availableSlots: increment(-1)
  });

  // Create booking document
  const bookingRef = await addDoc(bookingCollection, {
    userId,
    userEmail,
    zoneId,
    zoneName,
    plateNumber,
    duration,
    amount,
    status: "active",
    paymentStatus: "pending",
    createdAt: serverTimestamp()
  });

  return bookingRef.id;
};

/*
|--------------------------------------------------------------------------
| Admin — Fetch Bookings (One-Time Load)
|--------------------------------------------------------------------------
*/
export const fetchBookings = async (): Promise<BookingData[]> => {
  const bookingsRef = collection(db, "bookings");
  const q = query(bookingsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  const list: BookingData[] = [];
  snapshot.forEach((d) => {
    list.push({ id: d.id, ...d.data() } as BookingData);
  });

  return list;
};

/*
|--------------------------------------------------------------------------
| Real-time Listeners
|--------------------------------------------------------------------------
*/
export const listenBookings = (cb: (data: BookingData[]) => void): Unsubscribe => {
  const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const bookings = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as BookingData[];
    cb(bookings);
  });
};

export const listenUserBookings = (
  userId: string,
  cb: (data: BookingData[]) => void
): Unsubscribe => {
  const q = query(
    collection(db, "bookings"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    const bookings = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as BookingData[];
    cb(bookings);
  });
};

/*
|--------------------------------------------------------------------------
| Admin — Mark Booking Paid
|--------------------------------------------------------------------------
*/
export const markPaid = async (bookingId: string): Promise<void> => {
  const bookingRef = doc(db, "bookings", bookingId);
  await updateDoc(bookingRef, {
    paymentStatus: "paid",
    paidAt: serverTimestamp()
  });
};

/*
|--------------------------------------------------------------------------
| Admin — Mark Booking Completed (and restore slot)
|--------------------------------------------------------------------------
*/
export const markCompleted = async (
  bookingId: string,
  zoneId: string
): Promise<void> => {
  const bookingRef = doc(db, "bookings", bookingId);
  const zoneRef = doc(db, "parking_zones", zoneId);

  await updateDoc(bookingRef, {
    status: "completed",
    paymentStatus: "paid",
    paidAt: serverTimestamp()
  });

  // Restore the slot
  await updateDoc(zoneRef, {
    availableSlots: increment(1)
  });
};

/*
|--------------------------------------------------------------------------
| Admin — Mark Booking Paid + Completed in one action
|--------------------------------------------------------------------------
*/
export const markBookingPaidAndComplete = async (
  bookingId: string,
  zoneId: string,
  amount: number
): Promise<void> => {
  const bookingRef = doc(db, "bookings", bookingId);
  const zoneRef = doc(db, "parking_zones", zoneId);

  await updateDoc(bookingRef, {
    paymentStatus: "paid",
    status: "completed",
    paidAt: serverTimestamp()
  });

  // Restore the slot and update revenue
  await updateDoc(zoneRef, {
    availableSlots: increment(1),
    revenueToday: increment(amount)
  });
};
