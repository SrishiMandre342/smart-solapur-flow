import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";

export const registerUser = async (email: string, password: string, role: "citizen" | "admin") => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", userCred.user.uid), {
    email,
    role,
    createdAt: Date.now()
  });
  return userCred.user;
};

export const loginUser = async (email: string, password: string) => {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  const userDoc = await getDoc(doc(db, "users", userCred.user.uid));
  return { user: userCred.user, data: userDoc.data() };
};
