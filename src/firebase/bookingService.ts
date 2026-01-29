import { db } from "@/firebase/firebase";
import {
  doc,
  updateDoc,
  increment,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

export const createBooking = async (
  userId: string,
  zoneId: string,
  amount: number
) => {
  await updateDoc(doc(db, "parking_zones", zoneId), {
    availableSlots: increment(-1),
  });

  const ref = await addDoc(collection(db, "bookings"), {
    userId,
    zoneId,
    amount,
    status: "pending",
    paymentStatus: "pending",
    createdAt: serverTimestamp(),
  });

  return ref.id;
};

export const markPaid = async (bookingId: string) => {
  await updateDoc(doc(db, "bookings", bookingId), {
    paymentStatus: "paid",
  });
};

export const markCompleted = async (bookingId: string, zoneId: string) => {
  await updateDoc(doc(db, "bookings", bookingId), {
    status: "completed",
  });

  await updateDoc(doc(db, "parking_zones", zoneId), {
    availableSlots: increment(+1),
  });
};

export const listenBookings = (cb: (data: any[]) => void) => {
  const q = query(collection(db, "bookings"));
  return onSnapshot(q, (snap) => {
    cb(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
    );
  });
};

export const listenUserBookings = (userId: string, cb: (data: any[]) => void) => {
  const q = query(collection(db, "bookings"), where("userId", "==", userId));
  return onSnapshot(q, (snap) => {
    cb(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
    );
  });
};
