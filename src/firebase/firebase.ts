// src/firebase/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD2zMUNksY6cPA6U2X5FErYU8gkkkxjP-E",
  authDomain: "smartflow-solapur.firebaseapp.com",
  projectId: "smartflow-solapur",
  storageBucket: "smartflow-solapur.appspot.com",
  messagingSenderId: "337416711205",
  appId: "1:337416711205:web:1685a67e1b32f1d444e3cc",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
